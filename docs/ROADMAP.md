# Ankore Roadmap

## Phase 0 — Repo and doctrine

- Repository scaffold
- Doctrine/spec/rules/install docs
- Tiko and Mikki config fixtures
- TypeScript config types and validation tests

## Phase 1 — Core primitives

- Random token generation
- Hashing with pepper
- Constant-time comparison helper
- JSON response/error helpers
- CORS policy helper
- Config validation

## Phase 2 — D1 storage

- Initial migrations
- D1 repository interfaces
- Subject/device/session CRUD
- Challenge CRUD
- Audit event insertions

## Phase 3 — Device/session bootstrap

- `POST /device`
- `GET /session`
- `POST /session/refresh`
- `POST /logout`
- Bearer transport
- Contract tests

## Phase 4 — Email challenges

- `POST /email/challenge`
- `POST /email/verify`
- hash-only email mode
- plain-email account mode
- generic responses
- single-use verification
- rate limiting

## Phase 5 — Accounts

- optional account linking
- account summary
- unlink/update email policy
- caregiver/admin support for Tiko
- account-control support for Mikki

## Phase 6 — API keys and entitlements

- API key creation/list/revoke/verify
- hashed key storage
- entitlement reads
- Mikki Pro/API key migration path

## Phase 7 — Product adoption

- Install in Tiko identity worker
- Install in Mikki Accounts
- Retire Chikki product-local password auth
- Delete replaced product-local auth logic after validation

## Deferred

- OAuth/social login
- Password auth
- Organization/team hierarchy
- Full admin dashboard
- Better Auth internal engine spike
