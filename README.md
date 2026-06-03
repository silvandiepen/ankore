# Ankore

**Ankore** is a lean identity continuity module for products that should work before accounts.

The name comes from **anchor** + **encore**:

- **anchor**: stable identity, ownership, recovery, and trust.
- **encore**: return later, resume work, reclaim a device, continue without friction.

> Identity is not logging in. Identity is being able to come back.

Ankore is intentionally not a general-purpose auth platform. It is a small, auditable identity core for products that should work before an account exists.

## Intended consumers

- **Tiko Universe** — device-first identity for child-facing apps. No login wall. Optional caregiver recovery/admin.
- **Mikki** — anonymous-first personal tools. Optional account for sync, recovery, ownership, billing, entitlements, and API keys.

## Shape

Product repos should install and configure Ankore, not implement auth themselves:

```ts
import { createIdentityWorker } from 'ankore/worker'
import config from './ankore.config.json'

export default createIdentityWorker(config)
```

Client packages use the same route contract everywhere:

```ts
import { createAnkoreClient } from 'ankore/client'

const identity = createAnkoreClient({ baseUrl: 'https://id.tiko.mt/v1/identity' })
const session = await identity.bootstrapDevice()
```

## Stable contract

Default base path:

```txt
/v1/identity
```

Default D1 binding:

```txt
IDENTITY_DB
```

Default table prefix:

```txt
identity_
```

## Docs

- [Doctrine](docs/DOCTRINE.md)
- [Feature spec](docs/SPEC.md)
- [Rules](docs/RULES.md)
- [Install guide](docs/INSTALL.md)
- [Tiko integration](docs/TIKO.md)
- [Mikki integration](docs/MIKKI.md)
- [Roadmap](docs/ROADMAP.md)
- [Full product TODO](docs/PRODUCT_TODO.md)

## Current state

`ankore@0.1.0` is published with the initial identity core: config validation, token hashing, D1/memory storage, device/session bootstrap, email challenges, account summary, API-key scaffolding, entitlements scaffolding, and contract tests.

It is not yet a complete product experience. The next work is productization: align public exports with docs, write full usage/API/security documentation, add a runnable Worker example, build the marketing/docs site, harden rate limiting and challenge attempts, and prepare Tiko/Mikki adoption plans. See [Full product TODO](docs/PRODUCT_TODO.md).
