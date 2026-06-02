import { describe, expect, it } from 'vitest'
import { normalizeConfig, type AnkoreConfig } from '../src/config'

const baseConfig: AnkoreConfig = {
  product: 'tiko',
  session: { bearer: true, cookie: false, ttlDays: 180, rotateOnRefresh: true },
  device: { required: true, autoCreateSubject: true },
  email: { enabled: true, storage: 'hash', purposes: ['verify_email', 'recover', 'admin_login'] },
  accounts: { enabled: true, passwords: false, required: false },
  apiKeys: { enabled: false },
  entitlements: { enabled: true },
  cors: { allowedOrigins: ['https://admin.tikoapps.org'] }
}

describe('normalizeConfig', () => {
  it('applies Ankore defaults', () => {
    expect(normalizeConfig(baseConfig)).toMatchObject({
      databaseBinding: 'IDENTITY_DB',
      basePath: '/v1/identity',
      tablePrefix: 'identity_'
    })
  })

  it('rejects password auth', () => {
    expect(() => normalizeConfig({
      ...baseConfig,
      accounts: { ...baseConfig.accounts, passwords: true as false }
    })).toThrow('password auth')
  })

  it('requires a session transport', () => {
    expect(() => normalizeConfig({
      ...baseConfig,
      session: { ...baseConfig.session, bearer: false, cookie: false }
    })).toThrow('session transport')
  })

  it('rejects Mikki hash-only account linking until encrypted lookup exists', () => {
    expect(() => normalizeConfig({
      ...baseConfig,
      product: 'mikki',
      email: { enabled: true, storage: 'hash', purposes: ['link_account'] },
      session: { bearer: true, cookie: true, ttlDays: 30 }
    })).toThrow('plain email storage')
  })
})
