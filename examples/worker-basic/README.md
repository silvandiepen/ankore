# Ankore Worker Basic Example

This example is the smallest Cloudflare Worker that exposes Ankore.

## Run locally

```bash
npm install
npx wrangler d1 migrations apply ankore-worker-basic --local --migrations-dir ../../migrations
npx wrangler secret put ANKORE_TOKEN_PEPPER
npm run dev
```

Then bootstrap a session:

```bash
curl -X POST http://127.0.0.1:8787/v1/identity/device
```

## Deploy

Replace the placeholder D1 `database_id` in `wrangler.toml`, apply the remote migration, set `ANKORE_TOKEN_PEPPER`, then deploy through GitHub Actions or Wrangler if explicitly approved.
