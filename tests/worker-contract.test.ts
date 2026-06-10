import { describe, expect, it } from 'vitest'
import { createIdentityWorker } from '../src/worker'
import { MemoryIdentityStore } from '../src/storage/memory'
import type { AnkoreConfig } from '../src/config'

const tikoConfig: AnkoreConfig = {
  product: 'tiko',
  session: { bearer: true, cookie: false, ttlDays: 180, rotateOnRefresh: true },
  device: { required: true, autoCreateSubject: true },
  email: { enabled: true, storage: 'hash', purposes: ['verify_email', 'recover', 'admin_login'] },
  accounts: { enabled: true, passwords: false, required: false },
  apiKeys: { enabled: false },
  entitlements: { enabled: true },
  cors: { allowedOrigins: ['https://admin.tikoapps.org'] }
}

const mikkiConfig: AnkoreConfig = {
  product: 'mikki',
  session: { bearer: true, cookie: true, ttlDays: 30, rotateOnRefresh: true, cookieName: 'mikki_session' },
  device: { required: false, autoCreateSubject: true },
  email: { enabled: true, storage: 'plain', purposes: ['verify_email', 'recover', 'link_account'] },
  accounts: { enabled: true, passwords: false, required: false },
  apiKeys: { enabled: true },
  entitlements: { enabled: true },
  cors: { allowedOrigins: ['https://mikki.tools'] }
}

function makeWorker(config: AnkoreConfig) {
  const store = new MemoryIdentityStore()
  const sent: Array<{ to: string; token: string; otp: string; purpose: string }> = []
  const worker = createIdentityWorker(config, {
    store,
    now: () => new Date('2026-06-02T12:00:00.000Z'),
    tokenPepper: 'test-pepper',
    sendEmail: async email => { sent.push(email) }
  })
  return { worker, store, sent }
}

async function json(response: Response) {
  return response.json() as Promise<any>
}

async function request(worker: ReturnType<typeof createIdentityWorker>, path: string, init: RequestInit = {}) {
  return worker.fetch(new Request(`https://identity.example.test${path}`, init), {})
}

describe.each([
  ['Tiko', tikoConfig],
  ['Mikki', mikkiConfig]
])('%s identity contract', (_name, config) => {
  it('bootstraps an anonymous device session and validates it', async () => {
    const { worker } = makeWorker(config)

    const created = await request(worker, '/v1/identity/device', { method: 'POST' })
    expect(created.status).toBe(201)
    const bundle = await json(created)

    expect(bundle.subject.id).toMatch(/^sub_/)
    expect(bundle.device.id).toMatch(/^dev_/)
    expect(bundle.session.token).toMatch(/^ank_/)
    const expectedExpiry = config.product === 'tiko' ? '2026-11-29T12:00:00.000Z' : '2026-07-02T12:00:00.000Z'
    expect(bundle.session.expiresAt).toBe(expectedExpiry)

    const session = await request(worker, '/v1/identity/session', {
      headers: { Authorization: `Bearer ${bundle.session.token}` }
    })
    expect(session.status).toBe(200)
    expect(await json(session)).toMatchObject({
      subject: { id: bundle.subject.id },
      device: { id: bundle.device.id },
      account: null
    })
  })

  it('rotates session tokens and revokes the old token', async () => {
    const { worker } = makeWorker(config)
    const created = await json(await request(worker, '/v1/identity/device', { method: 'POST' }))

    const refreshed = await request(worker, '/v1/identity/session/refresh', {
      method: 'POST',
      headers: { Authorization: `Bearer ${created.session.token}` }
    })
    expect(refreshed.status).toBe(200)
    const rotated = await json(refreshed)
    expect(rotated.session.token).not.toEqual(created.session.token)

    expect((await request(worker, '/v1/identity/session', {
      headers: { Authorization: `Bearer ${created.session.token}` }
    })).status).toBe(401)
    expect((await request(worker, '/v1/identity/session', {
      headers: { Authorization: `Bearer ${rotated.session.token}` }
    })).status).toBe(200)
  })

  it('logs out the current session', async () => {
    const { worker } = makeWorker(config)
    const created = await json(await request(worker, '/v1/identity/device', { method: 'POST' }))

    expect((await request(worker, '/v1/identity/logout', {
      method: 'POST',
      headers: { Authorization: `Bearer ${created.session.token}` }
    })).status).toBe(204)

    expect((await request(worker, '/v1/identity/session', {
      headers: { Authorization: `Bearer ${created.session.token}` }
    })).status).toBe(401)
  })

  it('creates and consumes a single-use email challenge', async () => {
    const { worker, sent, store } = makeWorker(config)
    const created = await json(await request(worker, '/v1/identity/device', { method: 'POST' }))

    const challenge = await request(worker, '/v1/identity/email/challenge', {
      method: 'POST',
      headers: { Authorization: `Bearer ${created.session.token}` },
      body: JSON.stringify({ email: 'sil@example.com', purpose: 'verify_email' })
    })
    expect(challenge.status).toBe(202)
    expect(await json(challenge)).toEqual({ ok: true, message: 'If this email can be used, a message has been sent.' })
    expect(sent).toHaveLength(1)

    const verified = await request(worker, '/v1/identity/email/verify', {
      method: 'POST',
      body: JSON.stringify({ token: sent[0]!.token })
    })
    expect(verified.status).toBe(200)
    const verifiedBody = await json(verified)
    expect(verifiedBody.subject.id).toEqual(created.subject.id)
    expect(verifiedBody.account.emailVerified).toBe(true)

    expect((await request(worker, '/v1/identity/email/verify', {
      method: 'POST',
      body: JSON.stringify({ token: sent[0]!.token })
    })).status).toBe(400)

    const accounts = Array.from(store.accounts.values())
    if (config.email.storage === 'hash') {
      expect(accounts[0]!.emailPlain).toBeNull()
      expect(accounts[0]!.emailHash).toMatch(/^sha256:/)
    } else {
      expect(accounts[0]!.emailPlain).toBe('sil@example.com')
    }
  })

  it('handles CORS preflight for allowed origins and rejects disallowed origins', async () => {
    const { worker } = makeWorker(config)
    const allowed = await request(worker, '/v1/identity/device', {
      method: 'OPTIONS',
      headers: { Origin: config.cors.allowedOrigins[0]!, 'Access-Control-Request-Method': 'POST' }
    })
    expect(allowed.status).toBe(204)
    expect(allowed.headers.get('Access-Control-Allow-Origin')).toBe(config.cors.allowedOrigins[0])

    const denied = await request(worker, '/v1/identity/device', {
      method: 'OPTIONS',
      headers: { Origin: 'https://evil.example', 'Access-Control-Request-Method': 'POST' }
    })
    expect(denied.status).toBe(403)
  })
})

describe('Mikki API key contract', () => {
  it('creates, verifies, lists, and revokes hashed API keys', async () => {
    const { worker, store } = makeWorker(mikkiConfig)
    const created = await json(await request(worker, '/v1/identity/device', { method: 'POST' }))

    const made = await request(worker, '/v1/identity/api-keys', {
      method: 'POST',
      headers: { Authorization: `Bearer ${created.session.token}` },
      body: JSON.stringify({ name: 'test key', scopes: ['mikki:api'] })
    })
    expect(made.status).toBe(201)
    const keyBody = await json(made)
    expect(keyBody.apiKey.key).toMatch(/^ank_key_/)
    expect(Array.from(store.apiKeys.values())[0]!.keyHash).not.toContain(keyBody.apiKey.key)

    const verified = await request(worker, '/v1/identity/api-keys/verify', {
      method: 'POST',
      body: JSON.stringify({ key: keyBody.apiKey.key })
    })
    expect(verified.status).toBe(200)
    expect(await json(verified)).toMatchObject({ subject: { id: created.subject.id }, scopes: ['mikki:api'] })

    const listed = await json(await request(worker, '/v1/identity/api-keys', {
      headers: { Authorization: `Bearer ${created.session.token}` }
    }))
    expect(listed.apiKeys[0]).not.toHaveProperty('key')
    expect(listed.apiKeys[0]).toMatchObject({ name: 'test key', keyPrefix: keyBody.apiKey.keyPrefix })

    expect((await request(worker, `/v1/identity/api-keys/${keyBody.apiKey.id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${created.session.token}` }
    })).status).toBe(204)
    expect((await request(worker, '/v1/identity/api-keys/verify', {
      method: 'POST',
      body: JSON.stringify({ key: keyBody.apiKey.key })
    })).status).toBe(401)
  })
})

describe('Tiko disabled modules', () => {
  it('rejects API key creation when disabled by config', async () => {
    const { worker } = makeWorker(tikoConfig)
    const created = await json(await request(worker, '/v1/identity/device', { method: 'POST' }))

    const response = await request(worker, '/v1/identity/api-keys', {
      method: 'POST',
      headers: { Authorization: `Bearer ${created.session.token}` },
      body: JSON.stringify({ name: 'nope' })
    })
    expect(response.status).toBe(404)
  })
})

describe.each([
  ['Tiko', tikoConfig],
  ['Mikki', mikkiConfig]
])('%s profile contract', (_name, config) => {
  it('reads and updates subject profile metadata', async () => {
    const { worker } = makeWorker(config)
    const created = await json(await request(worker, '/v1/identity/device', { method: 'POST' }))
    const token = created.session.token

    // GET profile — starts empty
    const initial = await json(await request(worker, '/v1/identity/profile', {
      headers: { Authorization: `Bearer ${token}` }
    }))
    expect(initial.profile).toEqual({})

    // PUT profile — merge metadata
    const updated = await json(await request(worker, '/v1/identity/profile', {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ profile: { parentCodeHash: 'abc123', nickname: 'test' } })
    }))
    expect(updated.profile).toMatchObject({ parentCodeHash: 'abc123', nickname: 'test' })

    // GET profile again — persisted
    const reloaded = await json(await request(worker, '/v1/identity/profile', {
      headers: { Authorization: `Bearer ${token}` }
    }))
    expect(reloaded.profile).toMatchObject({ parentCodeHash: 'abc123', nickname: 'test' })

    // PUT profile — merge updates without losing existing keys
    const merged = await json(await request(worker, '/v1/identity/profile', {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ profile: { nickname: 'updated' } })
    }))
    expect(merged.profile).toMatchObject({ parentCodeHash: 'abc123', nickname: 'updated' })
  })

  it('rejects profile access without session', async () => {
    const { worker } = makeWorker(config)
    expect((await request(worker, '/v1/identity/profile')).status).toBe(401)
    expect((await request(worker, '/v1/identity/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profile: { foo: 'bar' } })
    })).status).toBe(401)
  })

  it('rejects invalid profile payload', async () => {
    const { worker } = makeWorker(config)
    const created = await json(await request(worker, '/v1/identity/device', { method: 'POST' }))
    const token = created.session.token

    const response = await request(worker, '/v1/identity/profile', {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ profile: 'not-an-object' })
    })
    expect(response.status).toBe(400)
  })
})

describe.each([
  ['Tiko', tikoConfig],
  ['Mikki', mikkiConfig]
])('%s email deduplication', (_name, config) => {
  it('reuses existing account when verifying email from a new device', async () => {
    const { worker, store, sent } = makeWorker(config)

    // Device A: bootstrap, challenge, verify → creates account for user@example.com
    const deviceA = await json(await request(worker, '/v1/identity/device', { method: 'POST' }))
    await request(worker, '/v1/identity/email/challenge', {
      method: 'POST',
      headers: { Authorization: `Bearer ${deviceA.session.token}` },
      body: JSON.stringify({ email: 'user@example.com', purpose: 'verify_email' })
    })
    const verifyA = await json(await request(worker, '/v1/identity/email/verify', {
      method: 'POST',
      body: JSON.stringify({ token: sent[0]!.token })
    }))
    expect(verifyA.account.emailVerified).toBe(true)
    const originalAccountId = verifyA.account.id
    const originalSubjectId = verifyA.subject.id

    // Device B: fresh bootstrap (new browser/incognito)
    sent.length = 0
    const deviceB = await json(await request(worker, '/v1/identity/device', { method: 'POST' }))
    expect(deviceB.subject.id).not.toEqual(originalSubjectId)

    // Same email challenge from device B
    await request(worker, '/v1/identity/email/challenge', {
      method: 'POST',
      headers: { Authorization: `Bearer ${deviceB.session.token}` },
      body: JSON.stringify({ email: 'user@example.com', purpose: 'verify_email' })
    })

    // Verify — should link to existing account, NOT create a new one
    const verifyB = await json(await request(worker, '/v1/identity/email/verify', {
      method: 'POST',
      body: JSON.stringify({ token: sent[0]!.token })
    }))

    // The returned subject and account should be the ORIGINAL ones
    expect(verifyB.subject.id).toEqual(originalSubjectId)
    expect(verifyB.account.id).toEqual(originalAccountId)
    expect(verifyB.account.emailVerified).toBe(true)

    // Only one account should exist in the store
    const allAccounts = Array.from(store.accounts.values()).filter(a => !a.disabledAt)
    expect(allAccounts).toHaveLength(1)

    // Device B's subject should be disabled (it was an anonymous throwaway)
    const deviceBSubject = Array.from(store.subjects.values()).find(s => s.id === deviceB.subject.id)
    expect(deviceBSubject?.disabledAt).toBeTruthy()

    // The new device should now belong to the original subject
    const deviceRecord = Array.from(store.devices.values()).find(d => d.id === deviceB.device.id)
    expect(deviceRecord?.subjectId).toEqual(originalSubjectId)
  })

  it('creates a new account when email has not been seen before', async () => {
    const { worker, sent } = makeWorker(config)

    const device = await json(await request(worker, '/v1/identity/device', { method: 'POST' }))
    await request(worker, '/v1/identity/email/challenge', {
      method: 'POST',
      headers: { Authorization: `Bearer ${device.session.token}` },
      body: JSON.stringify({ email: 'brand-new@example.com', purpose: 'verify_email' })
    })
    const verified = await json(await request(worker, '/v1/identity/email/verify', {
      method: 'POST',
      body: JSON.stringify({ token: sent[0]!.token })
    }))
    expect(verified.account.id).toMatch(/^acc_/)
    expect(verified.account.emailVerified).toBe(true)
  })
})
