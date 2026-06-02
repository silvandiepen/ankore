# Installing Ankore in Products

## Package install

Target package name:

```bash
npm install ankore
```

For pre-publish or private development installs:

```bash
npm install github:silvandiepen/ankore#development
```

## Publishing

Ankore publishes from GitHub Actions through `.github/workflows/publish.yml`.

Required repository secret:

- `NPM_TOKEN`: npm automation token with publish rights for `ankore`

Important: if the npm account enforces 2FA for publish, use an npm **automation** token. A normal token that still prompts for OTP will work locally with `--otp`, but it will fail in CI because GitHub Actions cannot answer an authenticator prompt.

Manual local publish, when needed:

```bash
npm run check
npm publish --otp=<current-code>
```

## Worker setup

Create a product identity Worker with only config and a tiny entrypoint.

```ts
// workers/identity-api/src/index.ts
import { createIdentityWorker } from 'ankore/worker'
import config from '../ankore.config.json'

export default createIdentityWorker(config)
```

## Required bindings

```toml
[[d1_databases]]
binding = "IDENTITY_DB"
database_name = "<product>-identity"
database_id = "<cloudflare-d1-id>"
```

Required secret:

```txt
ANKORE_TOKEN_PEPPER
```

Optional secrets/integrations:

```txt
ANKORE_EMAIL_SIGNING_SECRET
RESEND_API_KEY
ANKORE_INTERNAL_BEARER
```

## Migrations

Apply Ankore migrations to the product's identity D1 database.

```bash
npx wrangler d1 migrations apply <product-identity-db> --local
npx wrangler d1 migrations apply <product-identity-db> --remote
```

## Client setup

```ts
import { createAnkoreClient } from 'ankore/client'

export const identity = createAnkoreClient({
  baseUrl: 'https://id.example.com/v1/identity',
  storage: localStorage
})
```

## Contract tests

Product repos should import Ankore's test suite and run it against their config fixture.

```ts
import { describeIdentityContract } from 'ankore/testing'
import config from '../ankore.config.json'

describeIdentityContract('product identity', { config })
```

## Migration from product-local auth

1. Add Ankore Worker beside existing auth.
2. Apply migrations to a fresh `IDENTITY_DB`.
3. Add client package and bootstrap anonymous/device session.
4. Route new resources to Ankore `subject.id`.
5. Add optional email recovery/account linking.
6. Switch old auth endpoints to compatibility wrappers if needed.
7. Delete product-local auth only after smoke tests pass.

Do not migrate legacy users by default unless Sil explicitly asks for it.
