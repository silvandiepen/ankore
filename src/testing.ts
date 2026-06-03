import { describe, expect, it } from 'vitest'
import type { AnkoreConfig } from './config.js'
import { MemoryIdentityStore } from './storage/memory.js'
import { createIdentityWorker } from './worker.js'

export interface IdentityContractOptions {
  config: AnkoreConfig
  tokenPepper?: string
  now?: Date
}

interface SentEmail {
  to: string
  token: string
  otp: string
  purpose: string
}

async function readJson(response: Response): Promise<any> {
  return response.json() as Promise<any>
}

function makeRequest(worker: ReturnType<typeof createIdentityWorker>, path: string, init: RequestInit = {}) {
  return worker.fetch(new Request(`https://identity.example.test${path}`, init), {})
}

function makeHarness(options: IdentityContractOptions) {
  const store = new MemoryIdentityStore()
  const sent: SentEmail[] = []
  const worker = createIdentityWorker(options.config, {
    store,
    now: () => options.now ?? new Date('2026-06-02T12:00:00.000Z'),
    tokenPepper: options.tokenPepper ?? 'ankore-contract-test-pepper',
    sendEmail: async email => { sent.push(email) }
  })

  return { worker, store, sent }
}

export function describeIdentityContract(name: string, options: IdentityContractOptions): void {
  describe(name, () => {
    it('bootstraps a subject, device, and bearer session', async () => {
      const { worker } = makeHarness(options)

      const created = await makeRequest(worker, '/v1/identity/device', { method: 'POST' })
      expect(created.status).toBe(201)
      const bundle = await readJson(created)

      expect(bundle.subject.id).toMatch(/^sub_/)
      expect(bundle.device.id).toMatch(/^dev_/)
      expect(bundle.device.secret).toMatch(/^ank_dev_/)
      expect(bundle.session.token).toMatch(/^ank_/)

      const session = await makeRequest(worker, '/v1/identity/session', {
        headers: { Authorization: `Bearer ${bundle.session.token}` }
      })
      expect(session.status).toBe(200)
      expect(await readJson(session)).toMatchObject({
        subject: { id: bundle.subject.id },
        device: { id: bundle.device.id },
        account: null
      })
    })

    it('restores an existing device with its device secret', async () => {
      const { worker } = makeHarness(options)
      const created = await readJson(await makeRequest(worker, '/v1/identity/device', { method: 'POST' }))

      const restored = await makeRequest(worker, '/v1/identity/device', {
        method: 'POST',
        body: JSON.stringify({ device: { id: created.device.id, secret: created.device.secret } })
      })
      expect(restored.status).toBe(200)
      const restoredBody = await readJson(restored)
      expect(restoredBody.subject.id).toBe(created.subject.id)
      expect(restoredBody.device.id).toBe(created.device.id)
      expect(restoredBody.session.token).not.toBe(created.session.token)
    })

    it('rotates refreshed sessions and rejects the previous token', async () => {
      const { worker } = makeHarness(options)
      const created = await readJson(await makeRequest(worker, '/v1/identity/device', { method: 'POST' }))

      const refreshed = await makeRequest(worker, '/v1/identity/session/refresh', {
        method: 'POST',
        headers: { Authorization: `Bearer ${created.session.token}` }
      })
      expect(refreshed.status).toBe(200)
      const rotated = await readJson(refreshed)
      expect(rotated.session.token).not.toBe(created.session.token)

      expect((await makeRequest(worker, '/v1/identity/session', {
        headers: { Authorization: `Bearer ${created.session.token}` }
      })).status).toBe(401)
      expect((await makeRequest(worker, '/v1/identity/session', {
        headers: { Authorization: `Bearer ${rotated.session.token}` }
      })).status).toBe(200)
    })

    it('creates generic single-use email challenges without exposing account existence', async () => {
      if (!options.config.email.enabled) return

      const { worker, sent, store } = makeHarness(options)
      const created = await readJson(await makeRequest(worker, '/v1/identity/device', { method: 'POST' }))
      const purpose = options.config.email.purposes[0] ?? 'verify_email'

      const challenge = await makeRequest(worker, '/v1/identity/email/challenge', {
        method: 'POST',
        headers: { Authorization: `Bearer ${created.session.token}` },
        body: JSON.stringify({ email: 'sil@example.com', purpose })
      })
      expect(challenge.status).toBe(202)
      expect(await readJson(challenge)).toEqual({ ok: true, message: 'If this email can be used, a message has been sent.' })
      expect(sent).toHaveLength(1)
      expect(sent[0]).toMatchObject({ to: 'sil@example.com', purpose })

      const verified = await makeRequest(worker, '/v1/identity/email/verify', {
        method: 'POST',
        body: JSON.stringify({ token: sent[0]!.token })
      })
      expect(verified.status).toBe(200)
      const verifiedBody = await readJson(verified)
      expect(verifiedBody.subject.id).toBe(created.subject.id)

      expect((await makeRequest(worker, '/v1/identity/email/verify', {
        method: 'POST',
        body: JSON.stringify({ token: sent[0]!.token })
      })).status).toBe(400)

      const accounts = Array.from(store.accounts.values())
      if (options.config.email.storage === 'hash') {
        expect(accounts[0]!.emailPlain).toBeNull()
      } else {
        expect(accounts[0]!.emailPlain).toBe('sil@example.com')
      }
      expect(accounts[0]!.emailHash).toMatch(/^sha256:/)
    })

    it('applies the configured CORS allowlist', async () => {
      const allowedOrigin = options.config.cors.allowedOrigins[0]
      if (!allowedOrigin) return
      const { worker } = makeHarness(options)

      const allowed = await makeRequest(worker, '/v1/identity/device', {
        method: 'OPTIONS',
        headers: { Origin: allowedOrigin, 'Access-Control-Request-Method': 'POST' }
      })
      expect(allowed.status).toBe(204)
      expect(allowed.headers.get('Access-Control-Allow-Origin')).toBe(allowedOrigin)

      const denied = await makeRequest(worker, '/v1/identity/device', {
        method: 'OPTIONS',
        headers: { Origin: 'https://not-allowed.example', 'Access-Control-Request-Method': 'POST' }
      })
      expect(denied.status).toBe(403)
    })
  })
}
