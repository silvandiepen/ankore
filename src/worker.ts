import { normalizeConfig, type AnkoreConfig, type NormalizedAnkoreConfig } from './config.js'
import { hashSecret, randomToken } from './crypto.js'
import { D1IdentityStore, type D1DatabaseLike } from './storage/d1.js'
import { MemoryIdentityStore } from './storage/memory.js'
import type { IdentityStore } from './storage/store.js'
import type { EmailChallengePurpose, IdentityAccount, IdentitySession, IdentitySubject, SessionTransport } from './types.js'

export interface AnkoreWorkerEnv {
  IDENTITY_DB?: unknown
  ANKORE_TOKEN_PEPPER?: string
  [key: string]: unknown
}

export interface AnkoreWorkerHandler {
  fetch(request: Request, env?: AnkoreWorkerEnv): Promise<Response>
}

export interface EmailMessage {
  to: string
  token: string
  otp: string
  purpose: EmailChallengePurpose
}

export interface IdentityWorkerDependencies {
  store?: IdentityStore
  now?: () => Date
  tokenPepper?: string
  sendEmail?: (message: EmailMessage) => Promise<void>
}

interface AuthContext {
  session: IdentitySession
  subject: IdentitySubject
  account: IdentityAccount | null
}

const GENERIC_EMAIL_RESPONSE = { ok: true, message: 'If this email can be used, a message has been sent.' }

export function createIdentityWorker(config: AnkoreConfig, deps: IdentityWorkerDependencies = {}): AnkoreWorkerHandler {
  const normalized = normalizeConfig(config)
  const fallbackStore = deps.store ?? new MemoryIdentityStore()
  const now = deps.now ?? (() => new Date())

  return {
    async fetch(request: Request, env: AnkoreWorkerEnv = {}): Promise<Response> {
      const originResult = handleCorsPreflight(request, normalized)
      if (originResult) return originResult

      const url = new URL(request.url)
      if (!url.pathname.startsWith(normalized.basePath)) {
        return new Response('Not found', { status: 404 })
      }

      const store = deps.store ?? getStoreFromEnv(env, normalized) ?? fallbackStore
      const pepper = deps.tokenPepper ?? env.ANKORE_TOKEN_PEPPER
      if (!pepper) return json({ error: 'missing_token_pepper' }, 500, normalized, request)

      const relative = normalizeRoute(url.pathname.slice(normalized.basePath.length))

      try {
        if (request.method === 'POST' && relative === '/device') {
          return withCors(await bootstrapDevice(request, store, normalized, pepper, now()), normalized, request)
        }

        if (request.method === 'GET' && relative === '/session') {
          const auth = await requireSession(request, store, normalized, pepper, now())
          if (!auth) return json({ error: 'invalid_session' }, 401, normalized, request)
          return json(await sessionBody(auth, store), 200, normalized, request)
        }

        if (request.method === 'POST' && relative === '/session/refresh') {
          const auth = await requireSession(request, store, normalized, pepper, now())
          if (!auth) return json({ error: 'invalid_session' }, 401, normalized, request)
          if (normalized.session.rotateOnRefresh !== false) await store.revokeSession(auth.session.id, now().toISOString())
          const token = randomToken('ank_')
          const session = await makeSession(normalized, auth.subject.id, auth.session.deviceId, auth.session.transport, token, pepper, now())
          await store.createSession(session)
          await audit(store, normalized, 'session.refresh', auth.subject.id, now())
          return json({ ...(await sessionBody({ ...auth, session }, store)), session: publicSession(session, token) }, 200, normalized, request)
        }

        if (request.method === 'POST' && relative === '/logout') {
          const auth = await requireSession(request, store, normalized, pepper, now())
          if (!auth) return json({ error: 'invalid_session' }, 401, normalized, request)
          await store.revokeSession(auth.session.id, now().toISOString())
          await audit(store, normalized, 'session.logout', auth.subject.id, now())
          return withCors(new Response(null, { status: 204 }), normalized, request)
        }

        if (request.method === 'POST' && relative === '/email/challenge') {
          return withCors(await createEmailChallenge(request, store, normalized, pepper, now(), deps.sendEmail), normalized, request)
        }

        if (request.method === 'POST' && relative === '/email/verify') {
          return withCors(await verifyEmailChallenge(request, store, normalized, pepper, now()), normalized, request)
        }

        if (request.method === 'GET' && relative === '/account') {
          const auth = await requireSession(request, store, normalized, pepper, now())
          if (!auth) return json({ error: 'invalid_session' }, 401, normalized, request)
          return json({ account: auth.account ? publicAccount(auth.account) : null }, 200, normalized, request)
        }

        if (relative.startsWith('/api-keys')) {
          return withCors(await handleApiKeys(request, relative, store, normalized, pepper, now()), normalized, request)
        }

        if (request.method === 'GET' && relative === '/entitlements') {
          const auth = await requireSession(request, store, normalized, pepper, now())
          if (!auth) return json({ error: 'invalid_session' }, 401, normalized, request)
          const entitlements = await store.listEntitlementsBySubject(auth.subject.id)
          return json({ entitlements: entitlements.map(entitlement => ({ key: entitlement.key, value: entitlement.value, source: entitlement.source, expiresAt: entitlement.expiresAt })) }, 200, normalized, request)
        }

        if (request.method === 'GET' && relative === '/profile') {
          const auth = await requireSession(request, store, normalized, pepper, now())
          if (!auth) return json({ error: 'invalid_session' }, 401, normalized, request)
          return json({ profile: auth.subject.metadata }, 200, normalized, request)
        }

        if (request.method === 'PUT' && relative === '/profile') {
          const auth = await requireSession(request, store, normalized, pepper, now())
          if (!auth) return json({ error: 'invalid_session' }, 401, normalized, request)
          const body = await readJson<{ profile?: Record<string, unknown> }>(request)
          if (!body.profile || typeof body.profile !== 'object') return json({ error: 'invalid_profile' }, 400, normalized, request)
          const merged = { ...auth.subject.metadata, ...body.profile }
          await store.updateSubjectMetadata(auth.subject.id, merged, now().toISOString())
          await audit(store, normalized, 'profile.update', auth.subject.id, now())
          return json({ profile: merged }, 200, normalized, request)
        }

        return json({ error: 'not_found' }, 404, normalized, request)
      } catch (error) {
        const message = error instanceof Error ? error.message : 'unknown_error'
        return json({ error: 'unexpected_error', message }, 500, normalized, request)
      }
    }
  }
}

async function bootstrapDevice(request: Request, store: IdentityStore, config: NormalizedAnkoreConfig, pepper: string, at: Date): Promise<Response> {
  const body = await readJson<{ device?: { id?: string; secret?: string } }>(request)
  const existingDeviceId = typeof body.device?.id === 'string' ? body.device.id : null
  const existingDeviceSecret = typeof body.device?.secret === 'string' ? body.device.secret : null

  if (existingDeviceId && existingDeviceSecret) {
    const existingDevice = await store.getDevice(existingDeviceId)
    const secretHash = await hashSecret(existingDeviceSecret, { pepper, product: config.product, purpose: 'device' })
    if (existingDevice && !existingDevice.revokedAt && existingDevice.product === config.product && existingDevice.secretHash === secretHash) {
      const subject = await store.getSubject(existingDevice.subjectId)
      if (subject && !subject.disabledAt) {
        const sessionToken = randomToken('ank_')
        const session = await makeSession(config, subject.id, existingDevice.id, 'bearer', sessionToken, pepper, at)
        await store.touchDevice(existingDevice.id, at.toISOString())
        await store.createSession(session)
        await audit(store, config, 'device.resume', subject.id, at)
        return Response.json({ subject: publicSubject(subject), device: { id: existingDevice.id, secret: existingDeviceSecret }, session: publicSession(session, sessionToken) }, { status: 200 })
      }
    }
  }

  const token = randomToken('ank_')
  const deviceSecret = randomToken('ank_dev_')
  const subject: IdentitySubject = {
    id: id('sub'),
    product: config.product,
    kind: 'anonymous',
    createdAt: at.toISOString(),
    updatedAt: at.toISOString(),
    disabledAt: null,
    metadata: {}
  }
  const deviceId = id('dev')
  const device = {
    id: deviceId,
    subjectId: subject.id,
    product: config.product,
    secretHash: await hashSecret(deviceSecret, { pepper, product: config.product, purpose: 'device' }),
    label: null,
    userAgentHash: null,
    createdAt: at.toISOString(),
    lastSeenAt: at.toISOString(),
    revokedAt: null,
    metadata: {}
  }
  const session = await makeSession(config, subject.id, device.id, 'bearer', token, pepper, at)

  await store.createSubject(subject)
  await store.createDevice(device)
  await store.createSession(session)
  await audit(store, config, 'device.bootstrap', subject.id, at)

  return Response.json({ subject: publicSubject(subject), device: { id: device.id, secret: deviceSecret }, session: publicSession(session, token) }, { status: 201 })
}

async function requireSession(request: Request, store: IdentityStore, config: NormalizedAnkoreConfig, pepper: string, at: Date): Promise<AuthContext | null> {
  const token = getBearerToken(request) ?? getCookieToken(request, config)
  if (!token) return null
  const tokenHash = await hashSecret(token, { pepper, product: config.product, purpose: 'session' })
  const session = await store.getSessionByHash(tokenHash)
  if (!session || session.revokedAt || session.product !== config.product) return null
  if (new Date(session.expiresAt).getTime() <= at.getTime()) return null
  const subject = await store.getSubject(session.subjectId)
  if (!subject || subject.disabledAt) return null
  await store.touchSession(session.id, at.toISOString())
  if (session.deviceId) await store.touchDevice(session.deviceId, at.toISOString())
  return { session, subject, account: await store.getAccountBySubject(subject.id) }
}

async function createEmailChallenge(request: Request, store: IdentityStore, config: NormalizedAnkoreConfig, pepper: string, at: Date, sendEmail?: (message: EmailMessage) => Promise<void>): Promise<Response> {
  if (!config.email.enabled) return Response.json({ error: 'not_found' }, { status: 404 })
  const body = await readJson<{ email?: string; purpose?: EmailChallengePurpose }>(request)
  const email = normalizeEmail(body.email)
  const purpose = body.purpose ?? 'verify_email'
  if (!email || !config.email.purposes.includes(purpose)) return Response.json({ error: 'invalid_email_challenge' }, { status: 400 })
  const auth = await requireSession(request, store, config, pepper, at)
  const emailHash = await hashSecret(email, { pepper, product: config.product, purpose: 'email' })
  const token = randomToken('ank_email_')
  const otp = makeOtp()
  const challenge = {
    id: id('emc'),
    subjectId: auth?.subject.id ?? null,
    accountId: auth?.account?.id ?? null,
    product: config.product,
    purpose,
    emailHash,
    emailPlain: config.email.storage === 'plain' ? email : null,
    tokenHash: await hashSecret(token, { pepper, product: config.product, purpose: 'email-token' }),
    otpHash: await hashSecret(otp, { pepper, product: config.product, purpose: 'email-otp' }),
    createdAt: at.toISOString(),
    expiresAt: new Date(at.getTime() + 15 * 60 * 1000).toISOString(),
    consumedAt: null,
    attemptCount: 0,
    metadata: {}
  }
  await store.createEmailChallenge(challenge)
  await sendEmail?.({ to: email, token, otp, purpose })
  await audit(store, config, 'email.challenge', auth?.subject.id ?? null, at)
  return Response.json(GENERIC_EMAIL_RESPONSE, { status: 202 })
}

async function verifyEmailChallenge(request: Request, store: IdentityStore, config: NormalizedAnkoreConfig, pepper: string, at: Date): Promise<Response> {
  const body = await readJson<{ token?: string; otp?: string }>(request)
  const tokenHash = body.token ? await hashSecret(body.token, { pepper, product: config.product, purpose: 'email-token' }) : null
  const otpHash = body.otp ? await hashSecret(body.otp, { pepper, product: config.product, purpose: 'email-otp' }) : null
  const challenge = tokenHash ? await store.getEmailChallengeByTokenHash(tokenHash) : otpHash ? await store.getEmailChallengeByOtpHash(otpHash) : null
  if (!challenge || challenge.product !== config.product || challenge.consumedAt || new Date(challenge.expiresAt).getTime() <= at.getTime()) {
    return Response.json({ error: 'invalid_or_expired_challenge' }, { status: 400 })
  }

  await store.consumeEmailChallenge(challenge.id, at.toISOString())
  let subject = challenge.subjectId ? await store.getSubject(challenge.subjectId) : null
  if (!subject) {
    subject = { id: id('sub'), product: config.product, kind: 'anonymous', createdAt: at.toISOString(), updatedAt: at.toISOString(), disabledAt: null, metadata: {} }
    await store.createSubject(subject)
  }

  let account = await store.getAccountBySubject(subject.id)
  if (!account) {
    account = {
      id: id('acc'),
      subjectId: subject.id,
      product: config.product,
      emailHash: challenge.emailHash,
      emailPlain: challenge.emailPlain,
      emailVerifiedAt: at.toISOString(),
      createdAt: at.toISOString(),
      updatedAt: at.toISOString(),
      disabledAt: null,
      metadata: {}
    }
    await store.createAccount(account)
  } else {
    await store.verifyAccountEmail(account.id, at.toISOString())
    account = { ...account, emailVerifiedAt: at.toISOString() }
  }

  const sessionToken = randomToken('ank_')
  const session = await makeSession(config, subject.id, null, config.session.cookie ? 'cookie' : 'bearer', sessionToken, pepper, at)
  await store.createSession(session)
  await audit(store, config, 'email.verify', subject.id, at)
  return Response.json({ subject: publicSubject(subject), account: publicAccount(account), session: publicSession(session, sessionToken) }, { status: 200 })
}

async function handleApiKeys(request: Request, relative: string, store: IdentityStore, config: NormalizedAnkoreConfig, pepper: string, at: Date): Promise<Response> {
  if (!config.apiKeys.enabled) return Response.json({ error: 'not_found' }, { status: 404 })

  if (request.method === 'POST' && relative === '/api-keys/verify') {
    const body = await readJson<{ key?: string }>(request)
    if (!body.key) return Response.json({ error: 'missing_key' }, { status: 400 })
    const keyHash = await hashSecret(body.key, { pepper, product: config.product, purpose: 'api-key' })
    const apiKey = await store.getApiKeyByHash(keyHash)
    if (!apiKey || apiKey.revokedAt || (apiKey.expiresAt && new Date(apiKey.expiresAt).getTime() <= at.getTime())) return Response.json({ error: 'invalid_api_key' }, { status: 401 })
    const subject = await store.getSubject(apiKey.subjectId)
    if (!subject) return Response.json({ error: 'invalid_api_key' }, { status: 401 })
    await store.touchApiKey(apiKey.id, at.toISOString())
    return Response.json({ subject: publicSubject(subject), scopes: apiKey.scopes }, { status: 200 })
  }

  const auth = await requireSession(request, store, config, pepper, at)
  if (!auth) return Response.json({ error: 'invalid_session' }, { status: 401 })

  if (request.method === 'POST' && relative === '/api-keys') {
    const body = await readJson<{ name?: string; scopes?: string[] }>(request)
    const key = randomToken('ank_key_')
    const apiKey = {
      id: id('key'),
      subjectId: auth.subject.id,
      product: config.product,
      name: body.name || 'API key',
      keyHash: await hashSecret(key, { pepper, product: config.product, purpose: 'api-key' }),
      keyPrefix: key.slice(0, 16),
      scopes: body.scopes ?? [],
      createdAt: at.toISOString(),
      expiresAt: null,
      lastUsedAt: null,
      revokedAt: null
    }
    await store.createApiKey(apiKey)
    return Response.json({ apiKey: { id: apiKey.id, name: apiKey.name, key, keyPrefix: apiKey.keyPrefix, scopes: apiKey.scopes, createdAt: apiKey.createdAt } }, { status: 201 })
  }

  if (request.method === 'GET' && relative === '/api-keys') {
    const apiKeys = await store.listApiKeysBySubject(auth.subject.id)
    return Response.json({ apiKeys: apiKeys.map(apiKey => ({ id: apiKey.id, name: apiKey.name, keyPrefix: apiKey.keyPrefix, scopes: apiKey.scopes, createdAt: apiKey.createdAt, lastUsedAt: apiKey.lastUsedAt, expiresAt: apiKey.expiresAt })) }, { status: 200 })
  }

  if (request.method === 'DELETE' && relative.startsWith('/api-keys/')) {
    await store.revokeApiKey(relative.slice('/api-keys/'.length), auth.subject.id, at.toISOString())
    return new Response(null, { status: 204 })
  }

  return Response.json({ error: 'not_found' }, { status: 404 })
}

async function makeSession(config: NormalizedAnkoreConfig, subjectId: string, deviceId: string | null, transport: SessionTransport, token: string, pepper: string, at: Date): Promise<IdentitySession> {
  return {
    id: id('ses'),
    subjectId,
    deviceId,
    product: config.product,
    transport,
    tokenHash: await hashSecret(token, { pepper, product: config.product, purpose: 'session' }),
    createdAt: at.toISOString(),
    expiresAt: new Date(at.getTime() + config.session.ttlDays * 24 * 60 * 60 * 1000).toISOString(),
    lastSeenAt: at.toISOString(),
    revokedAt: null,
    metadata: {}
  } satisfies IdentitySession & { tokenHash: string }
}
function getStoreFromEnv(env: AnkoreWorkerEnv, config: NormalizedAnkoreConfig): IdentityStore | null {
  const db = env[config.databaseBinding]
  return isD1DatabaseLike(db) ? new D1IdentityStore(db) : null
}

function isD1DatabaseLike(value: unknown): value is D1DatabaseLike {
  return typeof value === 'object' && value !== null && typeof (value as { prepare?: unknown }).prepare === 'function'
}

function makeOtp(): string { return String(Math.floor(100000 + Math.random() * 900000)) }
function normalizeRoute(route: string): string { return route === '' ? '/' : route }
function id(prefix: string): string { return `${prefix}_${crypto.randomUUID().replace(/-/g, '')}` }
function normalizeEmail(email: unknown): string | null { return typeof email === 'string' && email.includes('@') ? email.trim().toLowerCase() : null }
function getBearerToken(request: Request): string | null {
  const header = request.headers.get('Authorization')
  return header?.startsWith('Bearer ') ? header.slice('Bearer '.length) : null
}
function getCookieToken(request: Request, config: NormalizedAnkoreConfig): string | null {
  const name = config.session.cookieName ?? 'ankore_session'
  const cookie = request.headers.get('Cookie')
  return cookie?.split(';').map(part => part.trim()).find(part => part.startsWith(`${name}=`))?.slice(name.length + 1) ?? null
}
async function readJson<T>(request: Request): Promise<T> { return await request.json().catch(() => ({})) as T }
function publicSubject(subject: IdentitySubject) { return { id: subject.id, kind: subject.kind, product: subject.product } }
function publicSession(session: IdentitySession, token: string) { return { id: session.id, token, transport: session.transport, expiresAt: session.expiresAt } }
function publicAccount(account: IdentityAccount) { return { id: account.id, subjectId: account.subjectId, emailVerified: Boolean(account.emailVerifiedAt), email: account.emailPlain } }
async function sessionBody(auth: AuthContext, store: IdentityStore) {
  return { subject: publicSubject(auth.subject), device: auth.session.deviceId ? { id: auth.session.deviceId } : null, account: auth.account ? publicAccount(auth.account) : null, entitlements: await store.listEntitlementsBySubject(auth.subject.id) }
}
async function audit(store: IdentityStore, config: NormalizedAnkoreConfig, type: string, subjectId: string | null, at: Date): Promise<void> {
  await store.createAuditEvent({ id: id('aud'), subjectId, actorSubjectId: null, product: config.product, type, createdAt: at.toISOString(), ipHash: null, userAgentHash: null, metadata: {} })
}
function handleCorsPreflight(request: Request, config: NormalizedAnkoreConfig): Response | null {
  if (request.method !== 'OPTIONS') return null
  const origin = request.headers.get('Origin')
  if (!origin || !isOriginAllowed(origin, config.cors.allowedOrigins)) return new Response(null, { status: 403 })
  return new Response(null, { status: 204, headers: corsHeaders(origin) })
}
function withCors(response: Response, config: NormalizedAnkoreConfig, request: Request): Response {
  const origin = request.headers.get('Origin')
  if (origin && isOriginAllowed(origin, config.cors.allowedOrigins)) response.headers.set('Access-Control-Allow-Origin', origin)
  return response
}
function json(body: unknown, status: number, config: NormalizedAnkoreConfig, request: Request): Response {
  return withCors(Response.json(body, { status }), config, request)
}
function corsHeaders(origin: string): HeadersInit {
  return { 'Access-Control-Allow-Origin': origin, 'Access-Control-Allow-Methods': 'GET,POST,DELETE,OPTIONS', 'Access-Control-Allow-Headers': 'Authorization,Content-Type', 'Access-Control-Allow-Credentials': 'true' }
}
function isOriginAllowed(origin: string, allowed: string[]): boolean {
  return allowed.some(pattern => pattern === origin || (pattern.includes('*') && wildcardOrigin(pattern, origin)))
}
function wildcardOrigin(pattern: string, origin: string): boolean {
  const escaped = pattern.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '[^.]+')
  return new RegExp(`^${escaped}$`).test(origin)
}


