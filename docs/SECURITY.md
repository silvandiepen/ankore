# Security Model

## Purpose

This page states what Ankore v0.1.0 protects and what it does not claim yet.

## Minimal working example

```ts
const worker = createIdentityWorker(config)
```

Run it with `ANKORE_TOKEN_PEPPER` set and a D1 binding available.

## Configuration required

- A strong `ANKORE_TOKEN_PEPPER` secret.
- Explicit CORS allowlist.
- Product-specific email storage choice.
- Session transport and TTL choices.

## Security notes

Guarantees currently tested or represented in code:

- no passwords in v1
- bearer session tokens are hashed before storage
- API keys are hashed and raw keys are returned once
- email challenge token and OTP are hashed
- public challenge creation returns a generic response
- refresh can revoke the old session
- CORS preflight rejects disallowed origins
- audit events are written for core state changes

## Verification command

```bash
npm run check
```

## Known limits

Still to harden:

- storage-backed rate limits
- challenge attempt lockout behavior
- stricter audit redaction tests
- cleanup strategy for expired sessions/challenges
- full threat model review before product-wide adoption
