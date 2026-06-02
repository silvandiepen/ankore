# Ankore — Agent Guidelines

Ankore is Sil's shared identity continuity module for products such as Tiko and Mikki.

## Non-negotiables

- Work from `development` as the shared integration branch.
- Keep `main` release-only. Promote through PRs; do not deploy production directly.
- Use focused conventional commits.
- Do not commit secrets, real `.env` files, private keys, certificates, or API tokens.
- Do not add password auth unless Sil explicitly reverses the doctrine.
- Do not make account creation a front-door requirement.
- Do not expose user/email existence in public recovery responses.
- Store tokens, codes, API keys, and device secrets as hashes only.
- Keep Ankore lean: no OAuth/social/general auth-provider framework until a consuming product actually needs it.
- Better Auth may be used as a reference for patterns, not as an architectural dependency by default.
- Product repos configure Ankore; they should not fork auth logic.

## Product doctrine summary

- **Tiko:** device-first, child-facing, no login wall, no passwords, email may be stored as a hash only, accounts are optional caregiver/admin control.
- **Mikki:** anonymous-first disposable tools, optional account for recovery/control/billing/API keys, account is not a first-value gate.

## Validation before handoff

Run:

```bash
npm run check
```

If a change touches migrations, also validate with local D1/wrangler once the Worker scaffold exists.
