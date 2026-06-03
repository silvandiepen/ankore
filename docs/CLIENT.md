# Client Helper Reference

## Purpose

The client helper gives product frontends a small typed wrapper over Ankore routes.

## Minimal working example

```ts
import { createAnkoreClient } from 'ankore/client'

const identity = createAnkoreClient({
  baseUrl: 'https://id.example.com/v1/identity',
  storage: localStorage
})

const session = await identity.bootstrapDevice()
```

## Configuration required

The client needs a `baseUrl` pointing at the deployed identity Worker. Browser products should pass a storage object compatible with `localStorage` if they want the helper to persist sessions.

## Security notes

Treat returned bearer tokens as secrets. Store them only in product-approved browser storage. For high-risk surfaces, prefer short TTLs and refresh rotation.

## Verification command

```bash
npm test -- tests/install.test.ts
```

## Known limits

The v0.1.0 client is intentionally thin. It currently covers core bootstrap/session behavior and will grow as product integrations demand more helpers.
