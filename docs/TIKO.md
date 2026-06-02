# Tiko Integration

## Goal

Replace product-local Tiko identity logic with Ankore while preserving Tiko's child-facing doctrine.

## Tiko rules

- Apps work immediately.
- No passwords.
- No login wall.
- Device bootstrap is required.
- Email is optional and may be hash-only.
- Account/control is for caregiver/admin recovery, not child app access.
- Recovery responses are generic.

## Config

Use `examples/tiko/ankore.config.json` as the starting fixture.

## Expected Worker

```ts
import { createIdentityWorker } from '@sil/ankore/worker'
import config from './ankore.config.json'

export default createIdentityWorker(config)
```

## Route target

Preferred Tiko identity origin:

```txt
https://id.tiko.mt/v1/identity
```

When routed through API gateway, preserve the same path contract:

```txt
/v1/identity/*
```

## Migration plan

1. Add Ankore as a package dependency.
2. Replace `workers/identity-api` internals with the Ankore factory.
3. Keep current route paths stable through aliases during cutover if needed.
4. Run Tiko config contract tests.
5. Smoke:
   - `POST /device`
   - `GET /session`
   - `POST /email/challenge`
   - `POST /email/verify`
   - `POST /logout`
6. Verify no raw email persists in hash-only mode.
7. Verify admin/parent identity still works through email challenge.

## Do not

- Introduce Better Auth directly.
- Add passwords.
- Require parent/admin setup before child app use.
- Expose whether an email/handle exists.
- Treat old Supabase users/data as a default migration constraint.
