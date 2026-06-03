# API Reference

## Purpose

The Ankore API is the shared route contract for product Workers and clients.

## Minimal working example

```bash
curl -X POST https://id.example.com/v1/identity/device
```

Response:

```json
{
  "subject": { "id": "sub_...", "kind": "anonymous", "product": "mikki" },
  "device": { "id": "dev_...", "secret": "ank_dev_..." },
  "session": { "id": "ses_...", "token": "ank_...", "transport": "bearer", "expiresAt": "..." }
}
```

## Configuration required

All endpoints live under `basePath`, default `/v1/identity`, and require `ANKORE_TOKEN_PEPPER` at runtime.

## Endpoints

- `POST /device`: create anonymous subject, device, and bearer session.
- `GET /session`: validate current bearer/cookie session.
- `POST /session/refresh`: rotate or refresh the current session.
- `POST /logout`: revoke the current session.
- `POST /email/challenge`: create a generic email challenge response.
- `POST /email/verify`: consume a token or OTP and link/create account state.
- `GET /account`: return account summary for current session.
- `POST /api-keys`: create an API key when enabled.
- `GET /api-keys`: list key metadata for current subject.
- `DELETE /api-keys/:id`: revoke a key.
- `POST /api-keys/verify`: verify a raw key and return subject/scopes.
- `GET /entitlements`: list entitlements for current subject.

## Security notes

Raw API keys, sessions, email challenge tokens, OTPs, and device secrets are returned only at creation/verification boundaries. Storage uses hashes.

## Verification command

```bash
npm test -- tests/worker-contract.test.ts
```

## Known limits

Endpoint docs are hand-maintained for v0.1.0. A generated OpenAPI document is not present yet.
