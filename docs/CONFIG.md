# Configuration Reference

## Purpose

Ankore configuration lets each product express identity behavior without forking auth logic.

## Minimal working example

```json
{
  "product": "tiko",
  "basePath": "/v1/identity",
  "databaseBinding": "IDENTITY_DB",
  "session": { "bearer": true, "cookie": false, "ttlDays": 90, "rotateOnRefresh": true },
  "device": { "required": true, "autoCreateSubject": true },
  "email": { "enabled": true, "storage": "hash", "purposes": ["recover"] },
  "accounts": { "enabled": true, "passwords": false, "required": false },
  "apiKeys": { "enabled": false },
  "entitlements": { "enabled": true },
  "cors": { "allowedOrigins": ["https://app.tiko.mt"] }
}
```

## Configuration required

Required keys:

- `product`: product identifier such as `tiko` or `mikki`.
- `session`: at least one of `bearer` or `cookie` must be true.
- `email`: challenge behavior and storage mode.
- `apiKeys`: whether API key routes are enabled.
- `entitlements`: whether entitlement reads are enabled.
- `cors.allowedOrigins`: allowed browser origins.

Optional keys:

- `basePath`: defaults to `/v1/identity`.
- `databaseBinding`: defaults to `IDENTITY_DB`.
- `tablePrefix`: currently documented as `identity_`.
- `session.ttlDays`: defaults to 90.
- `session.rotateOnRefresh`: defaults to true.
- `session.cookieName`: defaults to `ankore_session`.

## Security notes

Tiko should prefer hash-only email storage. Mikki account-control linking currently requires plain email storage until an encrypted lookup strategy exists.

## Verification command

```bash
npm test -- tests/config.test.ts
```

## Known limits

The current SQL migration uses the `identity_` table prefix. Custom table prefixes are policy-level, not yet generated migrations.
