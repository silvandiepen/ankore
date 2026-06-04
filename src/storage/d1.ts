import type { IdentityStore } from './store.js'
import type {
  AuditEvent,
  EmailChallenge,
  IdentityAccount,
  IdentityApiKey,
  IdentityDevice,
  IdentityEntitlement,
  IdentitySession,
  IdentitySubject
} from '../types.js'

export interface D1DatabaseLike {
  prepare(sql: string): D1PreparedStatementLike
}

export interface D1PreparedStatementLike {
  bind(...values: unknown[]): D1PreparedStatementLike
  first<T = unknown>(): Promise<T | null>
  all<T = unknown>(): Promise<{ results: T[] }>
  run(): Promise<unknown>
}

export class D1IdentityStore implements IdentityStore {
  constructor(private readonly db: D1DatabaseLike) {}

  async createSubject(subject: IdentitySubject): Promise<void> {
    await this.db.prepare('INSERT INTO identity_subjects (id, product, kind, created_at, updated_at, disabled_at, metadata_json) VALUES (?, ?, ?, ?, ?, ?, ?)')
      .bind(subject.id, subject.product, subject.kind, subject.createdAt, subject.updatedAt, subject.disabledAt, JSON.stringify(subject.metadata)).run()
  }

  async getSubject(id: string): Promise<IdentitySubject | null> {
    return mapSubject(await this.db.prepare('SELECT * FROM identity_subjects WHERE id = ?').bind(id).first<Row>())
  }
  async updateSubjectMetadata(subjectId: string, metadata: Record<string, unknown>, updatedAt: string): Promise<void> {
    await this.db.prepare('UPDATE identity_subjects SET metadata_json = ?, updated_at = ? WHERE id = ?').bind(JSON.stringify(metadata), updatedAt, subjectId).run()
  }

  async createDevice(device: IdentityDevice): Promise<void> {
    await this.db.prepare('INSERT INTO identity_devices (id, subject_id, product, secret_hash, label, user_agent_hash, created_at, last_seen_at, revoked_at, metadata_json) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
      .bind(device.id, device.subjectId, device.product, device.secretHash, device.label, device.userAgentHash, device.createdAt, device.lastSeenAt, device.revokedAt, JSON.stringify(device.metadata)).run()
  }
  async getDevice(id: string): Promise<IdentityDevice | null> { return mapDevice(await this.db.prepare('SELECT * FROM identity_devices WHERE id = ?').bind(id).first<Row>()) }
  async touchDevice(id: string, lastSeenAt: string): Promise<void> { await this.db.prepare('UPDATE identity_devices SET last_seen_at = ? WHERE id = ?').bind(lastSeenAt, id).run() }
  async revokeDevice(id: string, revokedAt: string): Promise<void> { await this.db.prepare('UPDATE identity_devices SET revoked_at = ? WHERE id = ?').bind(revokedAt, id).run() }

  async createSession(session: IdentitySession): Promise<void> {
    await this.db.prepare('INSERT INTO identity_sessions (id, subject_id, device_id, product, transport, token_hash, created_at, expires_at, last_seen_at, revoked_at, metadata_json) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
      .bind(session.id, session.subjectId, session.deviceId, session.product, session.transport, session.tokenHash, session.createdAt, session.expiresAt, session.lastSeenAt, session.revokedAt, JSON.stringify(session.metadata)).run()
  }
  async getSessionByHash(tokenHash: string): Promise<IdentitySession | null> { return mapSession(await this.db.prepare('SELECT * FROM identity_sessions WHERE token_hash = ?').bind(tokenHash).first<Row>()) }
  async touchSession(id: string, lastSeenAt: string): Promise<void> { await this.db.prepare('UPDATE identity_sessions SET last_seen_at = ? WHERE id = ?').bind(lastSeenAt, id).run() }
  async revokeSession(id: string, revokedAt: string): Promise<void> { await this.db.prepare('UPDATE identity_sessions SET revoked_at = ? WHERE id = ?').bind(revokedAt, id).run() }

  async createAccount(account: IdentityAccount): Promise<void> {
    await this.db.prepare('INSERT INTO identity_accounts (id, subject_id, product, email_hash, email_plain, email_verified_at, created_at, updated_at, disabled_at, metadata_json) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
      .bind(account.id, account.subjectId, account.product, account.emailHash, account.emailPlain, account.emailVerifiedAt, account.createdAt, account.updatedAt, account.disabledAt, JSON.stringify(account.metadata)).run()
  }
  async getAccountBySubject(subjectId: string): Promise<IdentityAccount | null> { return mapAccount(await this.db.prepare('SELECT * FROM identity_accounts WHERE subject_id = ? AND disabled_at IS NULL LIMIT 1').bind(subjectId).first<Row>()) }
  async getAccountByEmailHash(product: string, emailHash: string): Promise<IdentityAccount | null> { return mapAccount(await this.db.prepare('SELECT * FROM identity_accounts WHERE product = ? AND email_hash = ? AND disabled_at IS NULL LIMIT 1').bind(product, emailHash).first<Row>()) }
  async verifyAccountEmail(accountId: string, verifiedAt: string): Promise<void> { await this.db.prepare('UPDATE identity_accounts SET email_verified_at = ?, updated_at = ? WHERE id = ?').bind(verifiedAt, verifiedAt, accountId).run() }

  async createEmailChallenge(challenge: EmailChallenge): Promise<void> {
    await this.db.prepare('INSERT INTO identity_email_challenges (id, subject_id, account_id, product, purpose, email_hash, token_hash, otp_hash, created_at, expires_at, consumed_at, attempt_count, metadata_json) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
      .bind(challenge.id, challenge.subjectId, challenge.accountId, challenge.product, challenge.purpose, challenge.emailHash, challenge.tokenHash, challenge.otpHash, challenge.createdAt, challenge.expiresAt, challenge.consumedAt, challenge.attemptCount, JSON.stringify({ ...challenge.metadata, emailPlain: challenge.emailPlain })).run()
  }
  async getEmailChallengeByTokenHash(tokenHash: string): Promise<EmailChallenge | null> { return mapChallenge(await this.db.prepare('SELECT * FROM identity_email_challenges WHERE token_hash = ?').bind(tokenHash).first<Row>()) }
  async getEmailChallengeByOtpHash(otpHash: string): Promise<EmailChallenge | null> { return mapChallenge(await this.db.prepare('SELECT * FROM identity_email_challenges WHERE otp_hash = ?').bind(otpHash).first<Row>()) }
  async consumeEmailChallenge(id: string, consumedAt: string): Promise<void> { await this.db.prepare('UPDATE identity_email_challenges SET consumed_at = ? WHERE id = ?').bind(consumedAt, id).run() }
  async incrementEmailChallengeAttempts(id: string): Promise<void> { await this.db.prepare('UPDATE identity_email_challenges SET attempt_count = attempt_count + 1 WHERE id = ?').bind(id).run() }

  async createApiKey(apiKey: IdentityApiKey): Promise<void> {
    await this.db.prepare('INSERT INTO identity_api_keys (id, subject_id, product, name, key_hash, key_prefix, scopes_json, created_at, expires_at, last_used_at, revoked_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
      .bind(apiKey.id, apiKey.subjectId, apiKey.product, apiKey.name, apiKey.keyHash, apiKey.keyPrefix, JSON.stringify(apiKey.scopes), apiKey.createdAt, apiKey.expiresAt, apiKey.lastUsedAt, apiKey.revokedAt).run()
  }
  async getApiKeyByHash(keyHash: string): Promise<IdentityApiKey | null> { return mapApiKey(await this.db.prepare('SELECT * FROM identity_api_keys WHERE key_hash = ?').bind(keyHash).first<Row>()) }
  async listApiKeysBySubject(subjectId: string): Promise<IdentityApiKey[]> { return mapRows((await this.db.prepare('SELECT * FROM identity_api_keys WHERE subject_id = ? AND revoked_at IS NULL').bind(subjectId).all<Row>()).results, mapApiKey) }
  async revokeApiKey(id: string, subjectId: string, revokedAt: string): Promise<void> { await this.db.prepare('UPDATE identity_api_keys SET revoked_at = ? WHERE id = ? AND subject_id = ?').bind(revokedAt, id, subjectId).run() }
  async touchApiKey(id: string, lastUsedAt: string): Promise<void> { await this.db.prepare('UPDATE identity_api_keys SET last_used_at = ? WHERE id = ?').bind(lastUsedAt, id).run() }

  async listEntitlementsBySubject(subjectId: string): Promise<IdentityEntitlement[]> { return mapRows((await this.db.prepare('SELECT * FROM identity_entitlements WHERE subject_id = ? AND revoked_at IS NULL').bind(subjectId).all<Row>()).results, mapEntitlement) }
  async createEntitlement(entitlement: IdentityEntitlement): Promise<void> {
    await this.db.prepare('INSERT INTO identity_entitlements (id, subject_id, product, key, value_json, source, created_at, expires_at, revoked_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)')
      .bind(entitlement.id, entitlement.subjectId, entitlement.product, entitlement.key, JSON.stringify(entitlement.value), entitlement.source, entitlement.createdAt, entitlement.expiresAt, entitlement.revokedAt).run()
  }

  async createAuditEvent(event: AuditEvent): Promise<void> {
    await this.db.prepare('INSERT INTO identity_audit_events (id, subject_id, actor_subject_id, product, type, created_at, ip_hash, user_agent_hash, metadata_json) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)')
      .bind(event.id, event.subjectId, event.actorSubjectId, event.product, event.type, event.createdAt, event.ipHash, event.userAgentHash, JSON.stringify(event.metadata)).run()
  }
}

type Row = Record<string, unknown>
function str(row: Row, key: string): string { return String(row[key]) }
function nullable(row: Row, key: string): string | null { return row[key] == null ? null : String(row[key]) }
function jsonValue(row: Row, key: string): Record<string, unknown> { return JSON.parse(String(row[key] ?? '{}')) as Record<string, unknown> }
function jsonArray(row: Row, key: string): string[] { return JSON.parse(String(row[key] ?? '[]')) as string[] }
function mapRows<T>(rows: Row[], mapper: (row: Row | null) => T | null): T[] { return rows.map(row => mapper(row)).filter((item): item is T => item !== null) }
function mapSubject(row: Row | null): IdentitySubject | null { return row ? { id: str(row, 'id'), product: str(row, 'product'), kind: str(row, 'kind') as IdentitySubject['kind'], createdAt: str(row, 'created_at'), updatedAt: str(row, 'updated_at'), disabledAt: nullable(row, 'disabled_at'), metadata: jsonValue(row, 'metadata_json') } : null }
function mapDevice(row: Row | null): IdentityDevice | null { return row ? { id: str(row, 'id'), subjectId: str(row, 'subject_id'), product: str(row, 'product'), secretHash: str(row, 'secret_hash'), label: nullable(row, 'label'), userAgentHash: nullable(row, 'user_agent_hash'), createdAt: str(row, 'created_at'), lastSeenAt: nullable(row, 'last_seen_at'), revokedAt: nullable(row, 'revoked_at'), metadata: jsonValue(row, 'metadata_json') } : null }
function mapSession(row: Row | null): IdentitySession | null { return row ? { id: str(row, 'id'), subjectId: str(row, 'subject_id'), deviceId: nullable(row, 'device_id'), product: str(row, 'product'), transport: str(row, 'transport') as IdentitySession['transport'], tokenHash: str(row, 'token_hash'), createdAt: str(row, 'created_at'), expiresAt: str(row, 'expires_at'), lastSeenAt: nullable(row, 'last_seen_at'), revokedAt: nullable(row, 'revoked_at'), metadata: jsonValue(row, 'metadata_json') } : null }
function mapAccount(row: Row | null): IdentityAccount | null { return row ? { id: str(row, 'id'), subjectId: str(row, 'subject_id'), product: str(row, 'product'), emailHash: nullable(row, 'email_hash'), emailPlain: nullable(row, 'email_plain'), emailVerifiedAt: nullable(row, 'email_verified_at'), createdAt: str(row, 'created_at'), updatedAt: str(row, 'updated_at'), disabledAt: nullable(row, 'disabled_at'), metadata: jsonValue(row, 'metadata_json') } : null }
function mapChallenge(row: Row | null): EmailChallenge | null { const metadata = row ? jsonValue(row, 'metadata_json') : {}; return row ? { id: str(row, 'id'), subjectId: nullable(row, 'subject_id'), accountId: nullable(row, 'account_id'), product: str(row, 'product'), purpose: str(row, 'purpose') as EmailChallenge['purpose'], emailHash: str(row, 'email_hash'), emailPlain: typeof metadata.emailPlain === 'string' ? metadata.emailPlain : null, tokenHash: nullable(row, 'token_hash'), otpHash: nullable(row, 'otp_hash'), createdAt: str(row, 'created_at'), expiresAt: str(row, 'expires_at'), consumedAt: nullable(row, 'consumed_at'), attemptCount: Number(row.attempt_count ?? 0), metadata } : null }
function mapApiKey(row: Row | null): IdentityApiKey | null { return row ? { id: str(row, 'id'), subjectId: str(row, 'subject_id'), product: str(row, 'product'), name: str(row, 'name'), keyHash: str(row, 'key_hash'), keyPrefix: str(row, 'key_prefix'), scopes: jsonArray(row, 'scopes_json'), createdAt: str(row, 'created_at'), expiresAt: nullable(row, 'expires_at'), lastUsedAt: nullable(row, 'last_used_at'), revokedAt: nullable(row, 'revoked_at') } : null }
function mapEntitlement(row: Row | null): IdentityEntitlement | null { return row ? { id: str(row, 'id'), subjectId: str(row, 'subject_id'), product: str(row, 'product'), key: str(row, 'key'), value: jsonValue(row, 'value_json'), source: str(row, 'source'), createdAt: str(row, 'created_at'), expiresAt: nullable(row, 'expires_at'), revokedAt: nullable(row, 'revoked_at') } : null }
