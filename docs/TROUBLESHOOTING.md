# Troubleshooting

## Purpose

Common failures and quick fixes for adopting Ankore.

## Minimal working example

If the Worker returns `missing_token_pepper`, set the Cloudflare secret:

```bash
npx wrangler secret put ANKORE_TOKEN_PEPPER
```

## Configuration required

Check that the Worker has:

- `IDENTITY_DB` D1 binding
- `ANKORE_TOKEN_PEPPER` secret
- migrations applied
- CORS origin configured
- base URL matching `/v1/identity`

## Security notes

Never debug by logging raw bearer tokens, API keys, OTPs, or magic-link tokens. Log identifiers and hash prefixes only when absolutely necessary.

## Verification command

```bash
curl -i -X POST https://id.example.com/v1/identity/device
```

Expected success is HTTP `201` with subject/device/session JSON.

## Known limits

Wrangler and Cloudflare Pages tooling require Node 22+. If local Node is stale, run validation with:

```bash
npx -y -p node@22.22.3 -p npm@10.9.4 npm run check
```
