# Mikki Integration

## Goal

Converge Mikki Accounts and product-local auth into Ankore without losing Mikki's anonymous-first tool doctrine.

## Mikki rules

- First useful action works anonymously.
- Account is for control: recovery, sync, ownership, billing, API keys, entitlements.
- No password requirement by default.
- Cookie sessions are allowed for account web UI.
- Bearer sessions are allowed for APIs/native clients.
- Product-local auth forks should be retired gradually.

## Config

Use `examples/mikki/ankore.config.json` as the starting fixture.

## Migration plan

1. Add Ankore Worker for Mikki Accounts.
2. Keep Mikki's account UI but point session/account calls to Ankore routes.
3. Convert magic-link verification to single-use challenge storage.
4. Convert Pro/API key logic to Ankore API keys and entitlements.
5. Let disposable products store ownership by Ankore `subject.id`.
6. Replace Chikki's legacy email/password auth with Ankore anonymous/account linking.
7. Remove product-local auth once each product's smoke tests pass.

## Compatibility notes

Current Mikki Accounts uses `mikki_session` cookie and 30-day session max age. Ankore should support this through cookie config rather than hardcoded product logic.

Current Chikki has legacy password auth. Do not copy that into Ankore.

## Do not

- Make account setup the first step for disposable tools.
- Keep replayable stateless magic tokens as the target behavior.
- Fork Ankore per Mikki product.
- Add dashboard-heavy features unless Sil's workflow needs them.
