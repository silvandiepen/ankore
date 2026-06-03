# Why Ankore

## Purpose

Ankore exists because identity is continuity, not a login screen. Some products need to work immediately on a trusted device; others need anonymous sessions that can later attach to recovery, sync, billing, or account control. Ankore provides a shared subject/device/session/account contract without forcing account-first auth.

## Minimal working example

```ts
import { createIdentityWorker } from 'ankore/worker'
import config from './ankore.config.json'

export default createIdentityWorker(config)
```

A product can then call `POST /v1/identity/device` to create a subject, device, and session before asking for email.

## Configuration required

At minimum, a product chooses its `product` name, session transport, email policy, CORS origins, and D1 binding. The default binding is `IDENTITY_DB` and the default route prefix is `/v1/identity`.

## Security notes

Ankore stores hashes of sessions, device secrets, email challenge tokens, OTP codes, and API keys. Public recovery and challenge routes return generic responses to avoid account enumeration.

## Verification command

```bash
npm run docs:check
npm run check
```

## Known limits

Ankore v0.1.0 is intentionally lean. Rate limiting, challenge lockouts, and production product rollout guides are still being hardened.
