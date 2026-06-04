# Quickstart

## Purpose

This is the shortest path from an empty Worker to a bootstrapped Ankore session.

## Minimal working example

Install Ankore:

```bash
npm install ankore
```

Create `src/index.ts`:

```ts
import { createIdentityWorker } from 'ankore/worker'
import config from '../ankore.config.json'

export default createIdentityWorker(config)
```

Create `ankore.config.json`:

```json
{
  "product": "mikki",
  "session": { "bearer": true, "cookie": false },
  "device": { "required": true, "autoCreateSubject": true },
  "email": { "enabled": true, "storage": "plain", "purposes": ["verify_email", "recover", "link_account"] },
  "accounts": { "enabled": true, "passwords": false, "required": false },
  "apiKeys": { "enabled": true },
  "entitlements": { "enabled": true },
  "cors": { "allowedOrigins": ["https://example.com"] }
}
```

Bootstrap a session:

```bash
curl -X POST https://id.example.com/v1/identity/device
```

## Configuration required

Required runtime pieces:

- D1 binding: `IDENTITY_DB`
- Secret: `ANKORE_TOKEN_PEPPER`
- Migration: `migrations/0001_identity_core.sql`
- CORS origins for the consuming product

## Security notes

Generate a long random pepper and store it as a Cloudflare secret. Do not commit it. Do not use wildcard CORS in production.

## Verification command

```bash
npm run examples:check
```

For a full runnable project, see `examples/worker-basic`.

## Known limits

The quickstart uses bearer sessions. Cookie deployment needs product-specific same-site/domain decisions.
