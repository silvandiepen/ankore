export type ProductName = 'tiko' | 'mikki' | (string & {})

export type EmailStorageMode = 'hash' | 'plain'
export type ChallengePurpose = 'verify_email' | 'recover' | 'link_account' | 'admin_login'

export interface AnkoreConfig {
  product: ProductName
  databaseBinding?: string
  basePath?: string
  tablePrefix?: string
  session: {
    bearer: boolean
    cookie: boolean
    ttlDays: number
    rotateOnRefresh?: boolean
    cookieName?: string
  }
  device: {
    required: boolean
    autoCreateSubject: boolean
  }
  email: {
    enabled: boolean
    storage: EmailStorageMode
    purposes: ChallengePurpose[]
  }
  accounts: {
    enabled: boolean
    passwords: false
    required: boolean
  }
  apiKeys: {
    enabled: boolean
  }
  entitlements: {
    enabled: boolean
  }
  cors: {
    allowedOrigins: string[]
  }
}

export interface NormalizedAnkoreConfig extends AnkoreConfig {
  databaseBinding: string
  basePath: string
  tablePrefix: string
}

export function normalizeConfig(config: AnkoreConfig): NormalizedAnkoreConfig {
  validateConfig(config)

  return {
    ...config,
    databaseBinding: config.databaseBinding ?? 'IDENTITY_DB',
    basePath: config.basePath ?? '/v1/identity',
    tablePrefix: config.tablePrefix ?? 'identity_'
  }
}

export function validateConfig(config: AnkoreConfig): void {
  if (!config.product) throw new Error('Ankore config requires product')
  if (!config.session?.bearer && !config.session?.cookie) {
    throw new Error('Ankore config requires at least one session transport')
  }
  if (!Number.isInteger(config.session.ttlDays) || config.session.ttlDays <= 0) {
    throw new Error('Ankore session.ttlDays must be a positive integer')
  }
  if (config.accounts.passwords !== false) {
    throw new Error('Ankore v1 does not support password auth')
  }
  if (config.email.storage === 'hash' && config.email.purposes.includes('link_account') && config.product === 'mikki') {
    throw new Error('Mikki account-control email linking requires plain email storage or a future encrypted lookup strategy')
  }
  if (config.apiKeys.enabled && !config.accounts.enabled) {
    throw new Error('API keys require accounts to be enabled')
  }
  if (!Array.isArray(config.cors.allowedOrigins) || config.cors.allowedOrigins.length === 0) {
    throw new Error('Ankore config requires at least one allowed CORS origin')
  }
}
