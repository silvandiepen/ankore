# Ankore Full Product TODO

> **For Hermes:** Use `subagent-driven-development` for implementation slices. Keep every product change small, tested, and merged through `development` before promotion to `main`.

**Goal:** Make Ankore a complete usable product: a verified identity package, a clear marketing website, full docs, clean examples, and a repeatable release/adoption path for Tiko and Mikki.

**Current baseline:** `ankore@0.1.0` is published and the initial core package passes unit/contract tests. It is not yet a finished product website/docs/adoption experience.

**Product promise:** Identity continuity for products that must work before account creation: device-first for Tiko, anonymous-first for Mikki, optional accounts for recovery/control.

---

## 0. Definition of done

Ankore is a full product when all of these are true:

- [ ] A new developer can understand *why Ankore exists* from the homepage in under 60 seconds.
- [ ] A new developer can install it, create a D1 database, run migrations, deploy a Worker, and bootstrap a session by following docs only.
- [ ] Tiko and Mikki have documented production-ready configs and smoke-test checklists.
- [ ] The npm package has no missing public exports referenced by docs.
- [ ] Every documented endpoint has request/response examples and error cases.
- [ ] Local package validation, CI, npm dry-run, and release publishing are repeatable.
- [ ] There is a dev/staging website deployment for docs review.
- [ ] The marketing site and docs are versioned with the package.
- [ ] Security-critical behavior is tested: token hashing, single-use challenges, generic recovery responses, CORS, rate limits, audit events, and no raw secrets in storage/logs.
- [ ] Product adoption plans exist for Tiko and Mikki, including rollback paths.

---

## 1. Immediate product gaps

### Functional package gaps

- [x] Config validation exists.
- [x] Crypto helpers exist.
- [x] D1 storage adapter exists.
- [x] Memory storage adapter exists for tests.
- [x] Device/session bootstrap routes exist.
- [x] Email challenge routes exist.
- [x] Account summary route exists.
- [x] API-key route shell exists.
- [x] Entitlement route shell exists.
- [x] Contract tests exist for the current route set.
- [x] Export documented test helper `ankore/testing` or remove that docs claim until implemented.
- [x] Add package `engines` field and verify local/CI Node version expectations.
- [ ] Add explicit public API docs generated from source types or maintained manually.
- [ ] Add rate limiting implementation, not just policy language.
- [ ] Add cookie session support when enabled by config.
- [ ] Add challenge attempt tracking and lockout behavior.
- [ ] Add API key verification endpoint/client helper.
- [ ] Add entitlement mutation/admin story or document read-only source-of-truth expectations.
- [ ] Add migration compatibility checks for every table and index.
- [ ] Add example Wrangler Worker project that can run locally.

### Documentation gaps

- [x] Doctrine exists.
- [x] Feature spec exists.
- [x] Rules exist.
- [x] Initial install guide exists.
- [x] Tiko/Mikki integration notes exist.
- [ ] Homepage-level “why Ankore” narrative.
- [ ] Installation guide with exact Wrangler/D1 commands from empty project to deployed Worker.
- [ ] Configuration reference for every config key.
- [ ] Endpoint reference for every route.
- [ ] Client SDK reference.
- [ ] Storage schema reference.
- [ ] Security model page.
- [ ] Product integration cookbook for Tiko.
- [ ] Product integration cookbook for Mikki.
- [ ] Migration/rollback guide for replacing product-local auth.
- [ ] FAQ: why not Better Auth, why no passwords, why device/anonymous-first.
- [ ] Troubleshooting guide for npm, D1, Wrangler, CORS, email delivery, and GitHub publishing.
- [ ] Release guide for maintainers.

### Marketing/product gaps

- [ ] Decide docs/site stack.
- [ ] Build homepage with hero, problem, doctrine, product fit, diagrams, and quickstart.
- [ ] Build docs navigation and information architecture.
- [ ] Add architecture diagram: product app → Ankore Worker → D1 → optional email provider.
- [ ] Add Tiko/Mikki comparison section.
- [ ] Add code examples that match real exports and tests.
- [ ] Add npm install badge/version and GitHub links.
- [ ] Add copy for “identity is continuity, not login.”
- [ ] Add public roadmap page.
- [ ] Add changelog/release notes page.
- [ ] Add dev deployment workflow for the site.

---

## 2. Recommended product structure

Keep the package and docs in one repo so docs are versioned with code.

```txt
ankore/
  src/                         # package source
  tests/                       # unit + contract tests
  migrations/                  # D1 schema
  examples/
    worker-basic/              # runnable Wrangler example
    tiko/                      # Tiko config fixture + cookbook snippets
    mikki/                     # Mikki config fixture + cookbook snippets
  docs/                        # source docs and product plans
  site/                        # marketing/docs website app
    src/
      pages/
      components/
      content/
    package.json
    vite.config.ts
```

Preferred site implementation:

- Vue 3 + Vite.
- `@sil/ui` for visual language if this becomes a Sil-branded product site.
- Static output deployable by GitHub Actions.
- Docs content should be Markdown where possible.
- No runtime database or auth needed for the marketing site.

If speed matters more than custom design, use VitePress first and migrate later. If brand polish matters now, use Vue 3 + Vite + `@sil/ui` directly.

---

## 3. Phase plan

## Phase A — Stabilize package reality

**Outcome:** Docs and package exports match. CI proves installed-package usage.

- [x] Run full validation with a writable npm cache: `NPM_CONFIG_CACHE=/tmp/ankore-npm-cache npm run check`.
- [x] Fix or document any local environment cache issue separately from package health.
- [x] Inspect every README/docs code sample and verify each import path exists.
- [x] Either implement `ankore/testing` export or remove the contract-test import example from docs.
- [x] Add `exports` entries for any public testing/config/schema utilities we intentionally support.
- [x] Add tests that import every documented public export from a packed tarball.
- [x] Add `engines.node` to `package.json` once the supported runtime is chosen.
- [ ] Add `npm run docs:check` or equivalent link/sample checker.
- [ ] Commit as `fix: align docs with public package exports`.

## Phase B — Complete package documentation

**Outcome:** A developer can use Ankore without asking us.

Create these docs:

- [ ] `docs/WHY.md` — product philosophy and why account-first auth is wrong here.
- [ ] `docs/QUICKSTART.md` — 10-minute path from install to first session.
- [ ] `docs/CONFIG.md` — complete config reference.
- [ ] `docs/API.md` — endpoint reference.
- [ ] `docs/CLIENT.md` — client helper reference.
- [ ] `docs/STORAGE.md` — D1 schema and migration guide.
- [ ] `docs/SECURITY.md` — threat model and guarantees.
- [ ] `docs/EMAIL.md` — email challenge providers and templates.
- [ ] `docs/RELEASE.md` — npm/GitHub publishing process.
- [ ] `docs/TROUBLESHOOTING.md` — common failures and fixes.

Each doc must include:

- [ ] Purpose.
- [ ] Minimal working example.
- [ ] Configuration required.
- [ ] Security notes.
- [ ] Verification command.
- [ ] Known limits.

## Phase C — Build runnable examples

**Outcome:** Examples prove the docs.

- [ ] Create `examples/worker-basic` with Wrangler config, local D1 binding, migration command, and minimal Worker entrypoint.
- [ ] Add `examples/worker-basic/README.md` with exact local run commands.
- [ ] Add a smoke test that starts the Worker locally or directly invokes the Worker and calls `/v1/identity/device` then `/v1/identity/session`.
- [ ] Expand `examples/tiko` with Tiko-specific explanation and validated config.
- [ ] Expand `examples/mikki` with Mikki-specific explanation and validated config.
- [ ] Add `npm run examples:check`.

## Phase D — Build marketing website

**Outcome:** There is a polished product website, not just repo docs.

Pages:

- [ ] Home — positioning, hero, install snippet, product promise.
- [ ] Why — identity continuity doctrine.
- [ ] Quickstart — shortest working path.
- [ ] Docs — full docs navigation.
- [ ] API Reference — route docs.
- [ ] Tiko — device-first integration story.
- [ ] Mikki — anonymous-first/account-control integration story.
- [ ] Security — guarantees and non-goals.
- [ ] Roadmap — public product status.

Homepage sections:

- [ ] Hero: “Identity continuity for products that work before accounts.”
- [ ] Problem: login walls break child-facing and disposable-tool flows.
- [ ] Solution: subject/device/session/account primitives.
- [ ] Tiko/Mikki cards.
- [ ] Code quickstart.
- [ ] Architecture diagram.
- [ ] Security guarantees.
- [ ] CTA: install package / read docs / view GitHub.

Technical tasks:

- [ ] Add `site/package.json` or root workspace scripts.
- [ ] Add Vue 3 + Vite site.
- [ ] Add `@sil/ui` only if design scope includes Sil visual system now.
- [ ] Add static Markdown ingestion or VitePress-style docs routing.
- [ ] Add responsive navigation.
- [ ] Add dark/light theme.
- [ ] Add `npm run site:build`.
- [ ] Add CI check for site build.
- [ ] Add deploy workflow for dev docs site.

## Phase E — Security and correctness hardening

**Outcome:** Ankore can be trusted as auth infrastructure.

- [ ] Implement rate limiting with storage-backed counters or documented host-provided adapter.
- [ ] Add tests for rate-limit bypass attempts.
- [ ] Add tests proving raw tokens/API keys/challenge secrets are never stored.
- [ ] Add generic response tests for email challenge creation.
- [ ] Add audit-event redaction tests.
- [ ] Add CORS allowlist tests for allowed and denied origins.
- [ ] Add session refresh rotation tests.
- [ ] Add expired session/challenge cleanup strategy.
- [ ] Add D1 transaction/concurrency notes for single-use challenge consumption.
- [ ] Add security review checklist before each release.

## Phase F — Product adoption readiness

**Outcome:** Tiko and Mikki can adopt Ankore safely.

Tiko:

- [ ] Confirm latest Tiko Universe auth routes and data ownership model.
- [ ] Map Tiko device identity fields to Ankore subject/device/session fields.
- [ ] Write Tiko integration PR plan.
- [ ] Add Tiko smoke tests against Ankore config.
- [ ] Document caregiver/admin account recovery flow.
- [ ] Document no-raw-email guarantee and pepper rotation stance.

Mikki:

- [ ] Confirm latest Mikki auth/account flows.
- [ ] Map Mikki anonymous tool ownership to Ankore subject/session fields.
- [ ] Write Mikki integration PR plan.
- [ ] Add Mikki smoke tests against Ankore config.
- [ ] Document account-control/billing/API-key flow.
- [ ] Document retirement path for legacy product-local auth.

Both:

- [ ] Add rollback plan.
- [ ] Add staging deployment plan.
- [ ] Add production deployment checklist.
- [ ] Add data migration/non-migration decision record.

## Phase G — Release operations

**Outcome:** Publishing is boring.

- [ ] Add npm automation token as GitHub secret `NPM_TOKEN`.
- [ ] Verify publish workflow via dry release or manual dispatch when version changes.
- [ ] Add release checklist.
- [ ] Add changelog policy.
- [ ] Add semantic versioning policy.
- [ ] Add provenance verification notes.
- [ ] Add `npm audit --production` or equivalent dependency audit check.
- [ ] Add GitHub branch protection for `main` if permissions allow.

---

## 4. Suggested implementation order

1. Add complete docs pages: `WHY`, `QUICKSTART`, `CONFIG`, `API`, `CLIENT`, `SECURITY`.
2. Add `npm run docs:check` or equivalent link/sample checker.
3. Add runnable Worker example and smoke tests.
4. Add marketing/docs site skeleton.
5. Move existing docs into site navigation.
6. Add site build to CI.
7. Harden rate limiting/challenge attempts/CORS tests.
8. Create Tiko adoption PR plan.
9. Create Mikki adoption PR plan.
10. Add release/changelog automation and verify `NPM_TOKEN` publishing.

---

## 5. Non-goals for v0.1 productization

- [ ] No passwords.
- [ ] No generic OAuth provider framework.
- [ ] No organization/team admin dashboard.
- [ ] No migration of legacy product users unless explicitly approved.
- [ ] No production deployment outside GitHub Actions unless Sil explicitly asks.

---

## 6. Acceptance checklist for the next PR

The next implementation PR after this TODO should include:

- [ ] A corrected README that no longer describes Ankore as only a scaffold.
- [ ] A docs index with clear install/quickstart/API paths.
- [x] Either implemented or removed `ankore/testing` docs.
- [ ] A runnable example or explicit task branch for it.
- [ ] Full validation output in the PR body.
