export type SubjectKind = 'anonymous' | 'device' | 'account' | 'service'
export type SessionTransport = 'bearer' | 'cookie'
export type EmailChallengePurpose = 'verify_email' | 'recover' | 'link_account' | 'admin_login'

export interface IdentitySubject {
  id: string
  product: string
  kind: SubjectKind
  createdAt: string
  updatedAt: string
  disabledAt: string | null
  metadata: Record<string, unknown>
}

export interface IdentityDevice {
  id: string
  subjectId: string
  product: string
  secretHash: string
  label: string | null
  userAgentHash: string | null
  createdAt: string
  lastSeenAt: string | null
  revokedAt: string | null
  metadata: Record<string, unknown>
}

export interface IdentitySession {
  id: string
  subjectId: string
  deviceId: string | null
  product: string
  transport: SessionTransport
  tokenHash: string
  createdAt: string
  expiresAt: string
  lastSeenAt: string | null
  revokedAt: string | null
  metadata: Record<string, unknown>
}

export interface IdentityAccount {
  id: string
  subjectId: string
  product: string
  emailHash: string | null
  emailPlain: string | null
  emailVerifiedAt: string | null
  createdAt: string
  updatedAt: string
  disabledAt: string | null
  metadata: Record<string, unknown>
}

export interface EmailChallenge {
  id: string
  subjectId: string | null
  accountId: string | null
  product: string
  purpose: EmailChallengePurpose
  emailHash: string
  emailPlain: string | null
  tokenHash: string | null
  otpHash: string | null
  createdAt: string
  expiresAt: string
  consumedAt: string | null
  attemptCount: number
  metadata: Record<string, unknown>
}

export interface IdentityApiKey {
  id: string
  subjectId: string
  product: string
  name: string
  keyHash: string
  keyPrefix: string
  scopes: string[]
  createdAt: string
  expiresAt: string | null
  lastUsedAt: string | null
  revokedAt: string | null
}

export interface IdentityEntitlement {
  id: string
  subjectId: string
  product: string
  key: string
  value: Record<string, unknown>
  source: string
  createdAt: string
  expiresAt: string | null
  revokedAt: string | null
}

export interface AuditEvent {
  id: string
  subjectId: string | null
  actorSubjectId: string | null
  product: string
  type: string
  createdAt: string
  ipHash: string | null
  userAgentHash: string | null
  metadata: Record<string, unknown>
}
