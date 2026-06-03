# Release Process

## Purpose

Releases should prove Ankore as installed software, not just as source code.

## Minimal working example

```bash
npm run check
npm publish --dry-run --access public
```

Publishing is intended to run through GitHub Actions using npm provenance.

## Configuration required

Repository secret:

- `NPM_TOKEN`: npm automation token with publish rights for `ankore`.

GitHub workflow:

- `.github/workflows/publish.yml`

## Security notes

Do not commit `.env`, npm tokens, GitHub tokens, D1 credentials, or Cloudflare API tokens. Prefer npm automation tokens for CI when the account has 2FA.

## Verification command

```bash
npm run check
npm publish --dry-run --access public
```

## Known limits

The current VPS environment may not have npm auth. Real publishing depends on repo-level `NPM_TOKEN`.
