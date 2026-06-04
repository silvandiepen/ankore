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

export class MemoryIdentityStore implements IdentityStore {
  subjects = new Map<string, IdentitySubject>()
  devices = new Map<string, IdentityDevice>()
  sessions = new Map<string, IdentitySession>()
  accounts = new Map<string, IdentityAccount>()
  emailChallenges = new Map<string, EmailChallenge>()
  apiKeys = new Map<string, IdentityApiKey>()
  entitlements = new Map<string, IdentityEntitlement>()
  auditEvents = new Map<string, AuditEvent>()

  async createSubject(subject: IdentitySubject): Promise<void> { this.subjects.set(subject.id, subject) }
  async getSubject(id: string): Promise<IdentitySubject | null> { return this.subjects.get(id) ?? null }
  async updateSubjectMetadata(subjectId: string, metadata: Record<string, unknown>, updatedAt: string): Promise<void> {
    const subject = this.subjects.get(subjectId)
    if (subject) this.subjects.set(subjectId, { ...subject, metadata, updatedAt })
  }

  async createDevice(device: IdentityDevice): Promise<void> { this.devices.set(device.id, device) }
  async getDevice(id: string): Promise<IdentityDevice | null> { return this.devices.get(id) ?? null }
  async touchDevice(id: string, lastSeenAt: string): Promise<void> {
    const device = this.devices.get(id)
    if (device) this.devices.set(id, { ...device, lastSeenAt })
  }
  async revokeDevice(id: string, revokedAt: string): Promise<void> {
    const device = this.devices.get(id)
    if (device) this.devices.set(id, { ...device, revokedAt })
  }

  async createSession(session: IdentitySession): Promise<void> { this.sessions.set(session.id, session) }
  async getSessionByHash(tokenHash: string): Promise<IdentitySession | null> {
    return Array.from(this.sessions.values()).find(session => session.tokenHash === tokenHash) ?? null
  }
  async touchSession(id: string, lastSeenAt: string): Promise<void> {
    const session = this.sessions.get(id)
    if (session) this.sessions.set(id, { ...session, lastSeenAt })
  }
  async revokeSession(id: string, revokedAt: string): Promise<void> {
    const session = this.sessions.get(id)
    if (session) this.sessions.set(id, { ...session, revokedAt })
  }

  async createAccount(account: IdentityAccount): Promise<void> { this.accounts.set(account.id, account) }
  async getAccountBySubject(subjectId: string): Promise<IdentityAccount | null> {
    return Array.from(this.accounts.values()).find(account => account.subjectId === subjectId && !account.disabledAt) ?? null
  }
  async getAccountByEmailHash(product: string, emailHash: string): Promise<IdentityAccount | null> {
    return Array.from(this.accounts.values()).find(account => account.product === product && account.emailHash === emailHash && !account.disabledAt) ?? null
  }
  async verifyAccountEmail(accountId: string, verifiedAt: string): Promise<void> {
    const account = this.accounts.get(accountId)
    if (account) this.accounts.set(accountId, { ...account, emailVerifiedAt: verifiedAt, updatedAt: verifiedAt })
  }

  async createEmailChallenge(challenge: EmailChallenge): Promise<void> { this.emailChallenges.set(challenge.id, challenge) }
  async getEmailChallengeByTokenHash(tokenHash: string): Promise<EmailChallenge | null> {
    return Array.from(this.emailChallenges.values()).find(challenge => challenge.tokenHash === tokenHash) ?? null
  }
  async getEmailChallengeByOtpHash(otpHash: string): Promise<EmailChallenge | null> {
    return Array.from(this.emailChallenges.values()).find(challenge => challenge.otpHash === otpHash) ?? null
  }
  async consumeEmailChallenge(id: string, consumedAt: string): Promise<void> {
    const challenge = this.emailChallenges.get(id)
    if (challenge) this.emailChallenges.set(id, { ...challenge, consumedAt })
  }
  async incrementEmailChallengeAttempts(id: string): Promise<void> {
    const challenge = this.emailChallenges.get(id)
    if (challenge) this.emailChallenges.set(id, { ...challenge, attemptCount: challenge.attemptCount + 1 })
  }

  async createApiKey(apiKey: IdentityApiKey): Promise<void> { this.apiKeys.set(apiKey.id, apiKey) }
  async getApiKeyByHash(keyHash: string): Promise<IdentityApiKey | null> {
    return Array.from(this.apiKeys.values()).find(apiKey => apiKey.keyHash === keyHash) ?? null
  }
  async listApiKeysBySubject(subjectId: string): Promise<IdentityApiKey[]> {
    return Array.from(this.apiKeys.values()).filter(apiKey => apiKey.subjectId === subjectId && !apiKey.revokedAt)
  }
  async revokeApiKey(id: string, subjectId: string, revokedAt: string): Promise<void> {
    const apiKey = this.apiKeys.get(id)
    if (apiKey?.subjectId === subjectId) this.apiKeys.set(id, { ...apiKey, revokedAt })
  }
  async touchApiKey(id: string, lastUsedAt: string): Promise<void> {
    const apiKey = this.apiKeys.get(id)
    if (apiKey) this.apiKeys.set(id, { ...apiKey, lastUsedAt })
  }

  async listEntitlementsBySubject(subjectId: string): Promise<IdentityEntitlement[]> {
    return Array.from(this.entitlements.values()).filter(entitlement => entitlement.subjectId === subjectId && !entitlement.revokedAt)
  }
  async createEntitlement(entitlement: IdentityEntitlement): Promise<void> { this.entitlements.set(entitlement.id, entitlement) }

  async createAuditEvent(event: AuditEvent): Promise<void> { this.auditEvents.set(event.id, event) }
}
