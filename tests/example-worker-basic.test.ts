import { describe, expect, it } from 'vitest'
import { createIdentityWorker } from '../src/worker.js'

describe('examples/worker-basic', () => {
  it('bootstraps and validates a session with the documented config shape', async () => {
    const worker = createIdentityWorker({
      product: 'example',
      basePath: '/v1/identity',
      databaseBinding: 'IDENTITY_DB',
      session: {
        bearer: true,
        cookie: false,
        ttlDays: 90,
        rotateOnRefresh: true
      },
      device: {
        required: true,
        autoCreateSubject: true
      },
      email: {
        enabled: true,
        storage: 'plain',
        purposes: ['verify_email', 'recover', 'link_account']
      },
      accounts: {
        enabled: true,
        passwords: false,
        required: false
      },
      apiKeys: { enabled: true },
      entitlements: { enabled: true },
      cors: { allowedOrigins: ['http://localhost:5173', 'https://example.com'] }
    }, { tokenPepper: 'example-test-pepper' })

    const bootstrap = await worker.fetch(new Request('https://example.com/v1/identity/device', { method: 'POST' }))
    expect(bootstrap.status).toBe(201)

    const body = await bootstrap.json() as { session: { token: string }, subject: { id: string }, device: { id: string } }
    expect(body.subject.id).toMatch(/^sub_/)
    expect(body.device.id).toMatch(/^dev_/)
    expect(body.session.token).toMatch(/^ank_/)

    const session = await worker.fetch(new Request('https://example.com/v1/identity/session', {
      headers: { Authorization: `Bearer ${body.session.token}` }
    }))
    expect(session.status).toBe(200)

    const sessionBody = await session.json() as { subject: { id: string }, device: { id: string }, account: null }
    expect(sessionBody.subject.id).toBe(body.subject.id)
    expect(sessionBody.device.id).toBe(body.device.id)
    expect(sessionBody.account).toBeNull()
  })
})
