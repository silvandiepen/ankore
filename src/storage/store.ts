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

export interface IdentityStore {
  createSubject(subject: IdentitySubject): Promise<void>
  getSubject(id: string): Promise<IdentitySubject | null>
  updateSubjectMetadata(subjectId: string, metadata: Record<string, unknown>, updatedAt: string): Promise<void>

  createDevice(device: IdentityDevice): Promise<void>
  getDevice(id: string): Promise<IdentityDevice | null>
  touchDevice(id: string, lastSeenAt: string): Promise<void>
  revokeDevice(id: string, revokedAt: string): Promise<void>

  createSession(session: IdentitySession): Promise<void>
  getSessionByHash(tokenHash: string): Promise<IdentitySession | null>
  touchSession(id: string, lastSeenAt: string): Promise<void>
  revokeSession(id: string, revokedAt: string): Promise<void>

  createAccount(account: IdentityAccount): Promise<void>
  getAccountBySubject(subjectId: string): Promise<IdentityAccount | null>
  getAccountByEmailHash(product: string, emailHash: string): Promise<IdentityAccount | null>
  verifyAccountEmail(accountId: string, verifiedAt: string): Promise<void>

  reassignDevices(fromSubjectId: string, toSubjectId: string): Promise<void>
  disableSubject(subjectId: string, disabledAt: string): Promise<void>

  createEmailChallenge(challenge: EmailChallenge): Promise<void>
  getEmailChallengeByTokenHash(tokenHash: string): Promise<EmailChallenge | null>
  getEmailChallengeByOtpHash(otpHash: string): Promise<EmailChallenge | null>
  consumeEmailChallenge(id: string, consumedAt: string): Promise<void>
  incrementEmailChallengeAttempts(id: string): Promise<void>

  createApiKey(apiKey: IdentityApiKey): Promise<void>
  getApiKeyByHash(keyHash: string): Promise<IdentityApiKey | null>
  listApiKeysBySubject(subjectId: string): Promise<IdentityApiKey[]>
  revokeApiKey(id: string, subjectId: string, revokedAt: string): Promise<void>
  touchApiKey(id: string, lastUsedAt: string): Promise<void>

  listEntitlementsBySubject(subjectId: string): Promise<IdentityEntitlement[]>
  createEntitlement(entitlement: IdentityEntitlement): Promise<void>

  createAuditEvent(event: AuditEvent): Promise<void>
}
