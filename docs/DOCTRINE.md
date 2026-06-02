# Ankore Doctrine

## One sentence

Ankore is a continuity layer: it lets a person, device, or tool return safely without forcing account-first login.

## Name

**Ankore = anchor + encore.**

- Anchor: a durable identity root.
- Encore: the ability to come back and continue.

## Core belief

Identity is continuity, not login.

Ankore should answer:

- Who/what owns this resource right now?
- Can this device continue safely?
- Can this person recover access later?
- Can an account claim/control the right things without becoming a front-door wall?

It should not start by asking:

- Which password provider do we use?
- Which OAuth providers do we support?
- How do we make every user register first?

## Product fit

### Tiko

Tiko is child-facing and device-first.

- Apps open and work immediately.
- A device/session can exist without email.
- Children do not need accounts.
- Caregivers/admins may attach email for recovery/control.
- No passwords.
- Public recovery responses are generic.
- Email storage may be hash-only.

### Mikki

Mikki is anonymous-first and account-as-control.

- The first useful action should work without account setup.
- Disposable tool ownership can start as anonymous.
- Optional accounts provide recovery, sync, ownership, billing, entitlements, and API keys.
- Product-local auth forks should converge into Ankore.
- No password requirement by default.

## Scope

Ankore owns:

- schema
- migrations
- route contract
- token generation/hashing rules
- session validation
- device bootstrap
- email challenge verification
- account linking
- API keys
- entitlements
- audit events
- product policy config validation
- contract tests

Product repos own:

- config
- deployment bindings/secrets
- email copy/templates if needed
- product-specific authorization decisions beyond Ankore entitlements
- UI/UX around identity flows

## Explicit non-goals for v1

- Password login
- OAuth/social login
- SSO/SAML
- Multi-tenant enterprise org trees
- Full admin dashboard
- General plugin framework
- Shared database between products
- Migrating legacy users by default
- Exposing Better Auth routes/schema directly

## Better Auth stance

Better Auth is useful as a reference for patterns: session rotation, token hashing, magic-link behavior, cookie policy, rate limiting, and adapter boundaries.

Ankore should not depend on Better Auth unless a future spike proves that doing so keeps Ankore's external contract smaller, safer, and easier to audit.

The product contract must remain Ankore's contract.
