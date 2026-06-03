# Release Process

## Purpose

Releases should prove Ankore as installed software, not just as source code.

## Minimal working example

```bash
npm run check
npm publish --dry-run --access public
```

Publishing runs through GitHub Actions using semantic-release and npm provenance. Every push to `main` analyzes conventional commits since the last `v*` tag, chooses the next semver version, publishes to npm, creates a GitHub release, updates `CHANGELOG.md`, and commits the release metadata back to `main` with `[skip ci]`.

## Configuration required

Repository secret:

- `NPM_TOKEN`: npm automation token with publish rights for `ankore`.

GitHub workflow:

- `.github/workflows/publish.yml`

Required commit style for automatic versioning:

- `fix: ...` publishes a patch release.
- `feat: ...` publishes a minor release.
- `feat!: ...` or a `BREAKING CHANGE:` footer publishes a major release.
- `docs:`, `chore:`, `test:`, and other non-release commits do not publish by default.

The baseline tag for the first automated release is `v0.1.0`, matching the currently published npm package. Do not manually edit `package.json` versions for future releases; semantic-release owns npm versioning from `main`.

## Security notes

Do not commit `.env`, npm tokens, GitHub tokens, D1 credentials, or Cloudflare API tokens. Prefer npm automation tokens for CI when the account has 2FA.

## Verification command

```bash
npm run check
npm publish --dry-run --access public
```

## Known limits

The current VPS environment may not have npm auth. Real publishing depends on repo-level `NPM_TOKEN`.
