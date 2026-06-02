# Ankore Rules

## Security rules

1. Store only hashes of bearer tokens, session tokens, magic-link tokens, OTP codes, API keys, and device secrets.
2. Use a server-side pepper secret for token hashes.
3. Use constant-time comparison for secret verification where runtime support permits.
4. Public email/recovery requests must return generic success responses.
5. Magic links and OTP challenges are single-use.
6. Expired challenges and sessions must not validate.
7. Session validation must update last-seen metadata without extending TTL unless an explicit refresh endpoint is used.
8. Refresh/rotation must invalidate the old token when configured to rotate.
9. Cookies must be HttpOnly, Secure in HTTPS, SameSite=Lax by default, and scoped narrowly.
10. CORS allowlists come from config; no wildcard in production configs.
11. Rate limits are mandatory for email challenge creation and secret verification attempts.
12. Audit events are append-only and contain no raw secrets.
13. API keys are returned raw exactly once.
14. No passwords in v1.
15. No login walls in consuming products by default.

## Architecture rules

1. Product code provides config; Ankore owns logic.
2. The default database binding is `IDENTITY_DB`.
3. Tables use the `identity_` prefix.
4. Routes are mounted under `/v1/identity` by default.
5. Tiko and Mikki must run the same contract test suite with different config fixtures.
6. Product-specific differences must be represented as policy config, not forks.
7. D1 is the storage target for v1.
8. Cloudflare Workers is the runtime target for v1.
9. Keep dependencies minimal and auditable.
10. Do not build generic auth features before a product needs them.

## Naming rules

Use neutral identity language:

- `subject`, not always `user`
- `device`, not always `browser`
- `session`, not always `login`
- `challenge`, not always `magic link`
- `account`, only for optional control/recovery
- `entitlement`, for product-granted rights

## Product rules

### Tiko

- No account needed for app use.
- Device bootstrap is required.
- Email storage may be hash-only.
- Parent/admin control is optional and recoverable by magic link/OTP.
- Child-facing UI must not expose auth machinery as a first step.

### Mikki

- Anonymous work is valid ownership.
- Account enables control/recovery/billing/API keys.
- Cookie sessions are allowed for account web UI.
- Bearer sessions are allowed for APIs/native clients.
- API keys and entitlements are first-class optional modules.
