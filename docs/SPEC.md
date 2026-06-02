# Ankore Feature Specification

## Product contract

Ankore exposes a stable identity API and client contract that can be installed into Tiko and Mikki with configuration only.

Default route prefix:

```txt
/v1/identity
```

Default database binding:

```txt
IDENTITY_DB
```

Default table prefix:

```txt
identity_
```

## Core entities

### Subject

The root identity anchor.

A subject may represent:

- an anonymous tool owner
- a Tiko device user
- a caregiver/admin
- an account owner
- an API actor

Fields:

- `id`
- `product`
- `kind`: `anonymous | device | account | service`
- `created_at`
- `updated_at`
- `disabled_at`
- `metadata_json`

### Device

A known client install/browser/native app.

Fields:

- `id`
- `subject_id`
- `product`
- `secret_hash`
- `label`
- `user_agent_hash`
- `created_at`
- `last_seen_at`
- `revoked_at`
- `metadata_json`

### Session

A bearer or cookie credential that represents a subject/device.

Fields:

- `id`
- `subject_id`
- `device_id`
- `product`
- `transport`: `bearer | cookie`
- `token_hash`
- `created_at`
- `expires_at`
- `last_seen_at`
- `revoked_at`
- `metadata_json`

### Account

An optional control/recovery identity.

Fields:

- `id`
- `subject_id`
- `product`
- `email_hash`
- `email_ciphertext` or `email_plain` when policy allows plain storage
- `email_verified_at`
- `created_at`
- `updated_at`
- `disabled_at`
- `metadata_json`

### Email challenge

A single-use recovery/link/verification challenge.

Fields:

- `id`
- `subject_id`
- `account_id`
- `product`
- `purpose`: `verify_email | recover | link_account | admin_login`
- `email_hash`
- `token_hash`
- `otp_hash`
- `created_at`
- `expires_at`
- `consumed_at`
- `attempt_count`
- `metadata_json`

### API key

A long-lived machine credential, mainly for Mikki.

Fields:

- `id`
- `subject_id`
- `product`
- `name`
- `key_hash`
- `key_prefix`
- `scopes_json`
- `created_at`
- `expires_at`
- `last_used_at`
- `revoked_at`

### Entitlement

A product-granted right or capability.

Fields:

- `id`
- `subject_id`
- `product`
- `key`
- `value_json`
- `source`
- `created_at`
- `expires_at`
- `revoked_at`

### Audit event

Append-only security/product event.

Fields:

- `id`
- `subject_id`
- `actor_subject_id`
- `product`
- `type`
- `created_at`
- `ip_hash`
- `user_agent_hash`
- `metadata_json`

## Routes

### Device/session

```txt
POST   /v1/identity/device
GET    /v1/identity/session
POST   /v1/identity/session/refresh
POST   /v1/identity/logout
GET    /v1/identity/devices
DELETE /v1/identity/devices/:id
```

### Email/account

```txt
POST /v1/identity/email/challenge
POST /v1/identity/email/verify
GET  /v1/identity/account
POST /v1/identity/account/link-email
POST /v1/identity/account/unlink-email
```

### API keys

```txt
POST   /v1/identity/api-keys
GET    /v1/identity/api-keys
DELETE /v1/identity/api-keys/:id
POST   /v1/identity/api-keys/verify
```

### Entitlements

```txt
GET /v1/identity/entitlements
```

Admin/server-side entitlement mutation should be added only after the first consuming product needs it.

## Required flows

### Anonymous/device bootstrap

1. Client calls `POST /device` without credentials.
2. Ankore creates a subject if needed.
3. Ankore creates a device and session.
4. Client stores the returned session bundle.
5. Product can now create user-owned resources under `subject.id`.

### Existing session check

1. Client sends bearer token or cookie.
2. Ankore hashes the token and looks up active session.
3. Expired/revoked sessions fail.
4. Valid response returns subject/device/account/entitlements summary.

### Email challenge

1. Client requests challenge with email and purpose.
2. Response is always generic.
3. Ankore stores hashed token/code and sends email via configured sender.
4. Verification consumes the challenge once.
5. Verification can link email, recover subject, create session, or mark account verified depending on purpose.

### API key creation

1. Authenticated subject requests key.
2. Ankore creates random key and stores hash only.
3. Raw key is returned once.
4. Later verification returns subject and scopes.

## Product config fixtures

### Tiko

```json
{
  "product": "tiko",
  "databaseBinding": "IDENTITY_DB",
  "basePath": "/v1/identity",
  "tablePrefix": "identity_",
  "session": { "bearer": true, "cookie": false, "ttlDays": 180, "rotateOnRefresh": true },
  "device": { "required": true, "autoCreateSubject": true },
  "email": { "enabled": true, "storage": "hash", "purposes": ["verify_email", "recover", "admin_login"] },
  "accounts": { "enabled": true, "passwords": false, "required": false },
  "apiKeys": { "enabled": false },
  "entitlements": { "enabled": true },
  "cors": { "allowedOrigins": ["https://*.tikoapps.org", "https://tiko.mt", "https://admin.tikoapps.org"] }
}
```

### Mikki

```json
{
  "product": "mikki",
  "databaseBinding": "IDENTITY_DB",
  "basePath": "/v1/identity",
  "tablePrefix": "identity_",
  "session": { "bearer": true, "cookie": true, "ttlDays": 30, "rotateOnRefresh": true },
  "device": { "required": false, "autoCreateSubject": true },
  "email": { "enabled": true, "storage": "plain", "purposes": ["verify_email", "recover", "link_account"] },
  "accounts": { "enabled": true, "passwords": false, "required": false },
  "apiKeys": { "enabled": true },
  "entitlements": { "enabled": true },
  "cors": { "allowedOrigins": ["https://*.mikki.tools", "https://mikki.tools"] }
}
```

## Acceptance criteria for v1

- Same package can run Tiko and Mikki config fixtures.
- Same contract tests pass for both fixtures.
- D1 migrations create all required tables.
- Device bootstrap works without account.
- Session validation works for bearer sessions.
- Cookie session support works when enabled.
- Email challenge is generic, single-use, expiring, and token-hashed.
- Tiko hash-only email mode never persists raw email.
- Mikki plain-email mode supports account lookup/control.
- API keys are disabled by config for Tiko and enabled for Mikki.
- API key secrets are hash-only and returned once.
- No password support is present.
