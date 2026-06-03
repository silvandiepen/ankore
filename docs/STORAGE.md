# Storage and D1 Schema

## Purpose

Ankore stores identity continuity state in a product-owned Cloudflare D1 database.

## Minimal working example

```bash
npx wrangler d1 migrations apply product-identity --local
npx wrangler d1 migrations apply product-identity --remote
```

Use the migration in `migrations/0001_identity_core.sql`.

## Configuration required

Wrangler binding:

```toml
[[d1_databases]]
binding = "IDENTITY_DB"
database_name = "product-identity"
database_id = "<cloudflare-d1-id>"
```

## Tables

- `identity_subjects`
- `identity_devices`
- `identity_sessions`
- `identity_accounts`
- `identity_email_challenges`
- `identity_api_keys`
- `identity_entitlements`
- `identity_audit_events`

## Security notes

Secret-bearing columns store hashes: `secret_hash`, `token_hash`, `otp_hash`, and `key_hash`. Audit metadata must not contain raw secrets.

## Verification command

```bash
npm run examples:check
```

## Known limits

Migration compatibility checks for future schema versions are not implemented yet.
