<script setup lang="ts">
import { Button } from '@sil/ui'
import { useBemm } from 'bemm'

const bemm = useBemm('ankore-home', { return: 'string' })

const proofPoints = [
  { value: '0', label: 'account wall before first use' },
  { value: '1', label: 'small Worker package' },
  { value: 'D1', label: 'portable identity store' },
] as const

const modules = [
  { label: 'Subjects', text: 'Stable user-like identity without requiring a login.' },
  { label: 'Devices', text: 'Bind browsers, apps, and trusted surfaces to a subject.' },
  { label: 'Sessions', text: 'Issue scoped tokens for product APIs and workers.' },
  { label: 'Recovery', text: 'Add email challenges only when the user asks to keep access.' },
  { label: 'API keys', text: 'Create service credentials for integrations and automations.' },
  { label: 'Entitlements', text: 'Attach plan, usage, and feature flags without changing identity.' },
] as const

const journey = [
  'Create anonymous subject and device',
  'Store useful product data immediately',
  'Add recovery email when continuity matters',
  'Attach account, billing, keys, or entitlements later',
] as const

const productsUsingAnkore = [
  { name: 'Tiko', mark: 'Ti', description: 'Device-first continuity for child-facing experiences.' },
  { name: 'Mikki', mark: 'Mi', description: 'Anonymous-first continuity for focused personal tools.' },
] as const
</script>

<template>
  <main :class="bemm()">
    <section :class="[bemm('section'), bemm('hero')]">
      <div :class="bemm('hero-copy')">
        <p :class="bemm('eyebrow')">anchor + encore</p>
        <h1 :class="bemm('title')">Ankore</h1>
        <p :class="bemm('claim')">Identity continuity before accounts.</p>
        <p :class="bemm('lede')">
          A lean Worker module for products that need remembered users, trusted devices,
          recoverable sessions, API keys, and entitlements without forcing sign-up on the
          first useful moment.
        </p>
        <div :class="bemm('actions')">
          <Button variant="primary" to="/docs/quickstart">Start with docs</Button>
          <Button variant="outline" to="/architecture">See architecture</Button>
        </div>
      </div>
      <div :class="bemm('hero-panel')" aria-label="Identity continuity lifecycle">
        <span>anonymous</span>
        <span>device</span>
        <span>session</span>
        <span>recovery</span>
        <span>account</span>
      </div>
    </section>

    <section :class="[bemm('section'), bemm('proof')]" aria-label="Ankore proof points">
      <article v-for="point in proofPoints" :key="point.label" :class="bemm('metric')">
        <strong>{{ point.value }}</strong>
        <span>{{ point.label }}</span>
      </article>
    </section>

    <section :class="[bemm('section'), bemm('split')]" aria-labelledby="problem-title">
      <div :class="bemm('section-heading')">
        <p :class="bemm('eyebrow')">Problem</p>
        <h2 id="problem-title">Most auth systems start with the heaviest question.</h2>
      </div>
      <div :class="bemm('copy-grid')">
        <p>
          Products often need a stable identity before they need an account. A user may need
          to save a draft, keep a device trusted, resume a flow, or recover a link long before
          they care about passwords, billing, teams, or profiles.
        </p>
        <p>
          Ankore separates continuity from account management. The product can begin with an
          anonymous subject and later attach stronger proof, recovery, ownership, and paid
          capabilities without migrating user state into a different model.
        </p>
      </div>
    </section>

    <section :class="[bemm('section'), bemm('modules')]" aria-labelledby="modules-title">
      <div :class="bemm('section-heading')">
        <p :class="bemm('eyebrow')">Surface area</p>
        <h2 id="modules-title">Small pieces that cover the whole identity lifecycle.</h2>
      </div>
      <article v-for="item in modules" :key="item.label" :class="bemm('card')">
        <h3>{{ item.label }}</h3>
        <p>{{ item.text }}</p>
      </article>
    </section>

    <section :class="[bemm('section'), bemm('journey')]" aria-labelledby="journey-title">
      <div>
        <p :class="bemm('eyebrow')">Flow</p>
        <h2 id="journey-title">The upgrade path is explicit.</h2>
        <p>
          Start with a useful anonymous state, then add proof only when the product experience
          asks for it. No auth rewrite. No hidden coupling to a heavyweight provider.
        </p>
        <Button variant="ghost" to="/why">Read why this exists</Button>
      </div>
      <ol>
        <li v-for="step in journey" :key="step">{{ step }}</li>
      </ol>
    </section>

    <section :class="[bemm('section'), bemm('quickstart')]" aria-labelledby="quickstart-title">
      <div>
        <p :class="bemm('eyebrow')">10-minute path</p>
        <h2 id="quickstart-title">Install, bind D1, deploy.</h2>
        <p>
          The package ships Worker handlers, client helpers, migrations, a typed contract test,
          and an example Worker so product teams can adopt it without building auth from zero.
        </p>
        <Button variant="ghost" to="/docs/quickstart">Open quickstart</Button>
      </div>
      <pre><code>npm install ankore

import { createIdentityWorker } from 'ankore/worker'
import config from './ankore.config.json'

export default createIdentityWorker(config)</code></pre>
    </section>

    <section class="products-using-ankore" :class="[bemm('section'), bemm('products')]" aria-labelledby="products-title">
      <div :class="bemm('section-heading')">
        <p :class="bemm('eyebrow')">Used by</p>
        <h2 id="products-title">Products using Ankore.</h2>
      </div>
      <div :class="bemm('product-grid')">
        <article v-for="product in productsUsingAnkore" :key="product.name" :class="bemm('product')">
          <div :class="bemm('product-logo')" aria-hidden="true">{{ product.mark }}</div>
          <div>
            <h3>{{ product.name }}</h3>
            <p>{{ product.description }}</p>
          </div>
        </article>
      </div>
    </section>
  </main>
</template>

<style lang="scss">
.ankore-home {
  position: relative;
  padding-top: calc(var(--space) * 6);

  &__section {
    width: min(1180px, calc(100% - 2rem));
    margin: 0 auto;
    padding: var(--spacing) 0;
  }

  &__eyebrow {
    margin: 0 0 var(--space-s);
    color: color-mix(in srgb, var(--color-foreground), transparent 34%);
    text-transform: uppercase;
    font-size: .78rem;
    font-weight: 800;
    letter-spacing: .08em;
  }

  &__hero {
    min-height: 82vh;
    display: grid;
    grid-template-columns: minmax(0, 1.05fr) minmax(280px, .95fr);
    align-items: center;
    gap: var(--space-xl);
  }

  &__title {
    max-width: 7ch !important;
    margin: 0;
    font-size: clamp(4rem, 13vw, 10rem) !important;
    line-height: .86 !important;
    letter-spacing: 0 !important;
  }

  &__claim {
    max-width: 16ch;
    margin: var(--space-m) 0 0;
    font-size: clamp(2rem, 5vw, 5rem);
    line-height: .98;
    font-weight: 850;
  }

  &__lede {
    max-width: 720px;
    color: color-mix(in srgb, currentColor, transparent 22%);
    font-size: clamp(1.15rem, 2vw, 1.45rem);
  }

  &__actions,
  &__proof,
  &__modules,
  &__product-grid {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space);
  }

  &__hero-panel {
    display: grid;
    gap: var(--space);
    padding: var(--space-l);
    border-radius: 2.5rem;
    background: color-mix(in srgb, var(--color-background), var(--color-primary) 12%);
    box-shadow: 0 2rem 7rem color-mix(in srgb, var(--color-foreground), transparent 90%);

    span {
      display: flex;
      align-items: center;
      justify-content: space-between;
      min-height: 4.75rem;
      padding: 0 var(--space-l);
      border-radius: 999px;
      background: color-mix(in srgb, var(--color-background), var(--color-foreground) 7%);
      font-size: clamp(1.25rem, 3vw, 2.4rem);
      font-weight: 850;

      &::after {
        content: '→';
        color: color-mix(in srgb, currentColor, transparent 45%);
      }

      &:last-child::after {
        content: '✓';
      }
    }
  }

  &__section-heading {
    flex: 1 1 100%;
    max-width: 820px;

    h2 {
      margin: 0;
      max-width: 16ch;
      font-size: clamp(2.4rem, 6vw, 5.8rem);
      line-height: .98;
      letter-spacing: 0;
    }
  }

  &__metric,
  &__card,
  &__product,
  &__journey,
  &__quickstart {
    border: 1px solid color-mix(in srgb, var(--color-foreground), transparent 88%);
    border-radius: 2rem;
    background: color-mix(in srgb, var(--color-background), var(--color-foreground) 4%);
    box-shadow: 0 1rem 4rem color-mix(in srgb, var(--color-foreground), transparent 94%);
  }

  &__metric {
    flex: 1 1 220px;
    display: grid;
    gap: .35rem;
    padding: var(--space-l);

    strong {
      font-size: clamp(3rem, 7vw, 6rem);
      line-height: .9;
    }
  }

  &__split {
    display: grid;
    grid-template-columns: minmax(0, .9fr) minmax(0, 1.1fr);
    gap: var(--space-xl);
    align-items: start;
  }

  &__copy-grid {
    display: grid;
    gap: var(--space-l);
    color: color-mix(in srgb, currentColor, transparent 18%);
    font-size: clamp(1.1rem, 2vw, 1.35rem);
  }

  &__card {
    flex: 1 1 300px;
    padding: var(--space-l);

    h3 {
      margin-top: 0;
      font-size: 1.45rem;
      letter-spacing: 0;
    }

    p {
      color: color-mix(in srgb, currentColor, transparent 28%);
    }
  }

  &__journey,
  &__quickstart {
    display: grid;
    grid-template-columns: minmax(0, .9fr) minmax(0, 1.1fr);
    gap: var(--space-l);
    padding: var(--space-l);
  }

  &__journey {
    ol {
      display: grid;
      gap: var(--space);
      margin: 0;
      padding-left: 1.4rem;
      font-size: clamp(1.15rem, 2vw, 1.45rem);
      font-weight: 750;
    }

    li::marker {
      color: var(--color-primary);
    }
  }

  &__products {
    display: grid;
    gap: var(--space-l);
  }

  &__product {
    flex: 1 1 320px;
    display: flex;
    gap: var(--space);
    align-items: center;
    padding: var(--space-l);
  }

  &__product-logo {
    display: grid;
    flex: 0 0 auto;
    place-items: center;
    width: 4rem;
    height: 4rem;
    border-radius: 1.25rem;
    background: var(--color-primary);
    color: var(--color-primary-text);
    font-weight: 900;
  }
}

@media (max-width: 860px) {
  .ankore-home {
    &__hero,
    &__split,
    &__journey,
    &__quickstart {
      grid-template-columns: 1fr;
    }
  }
}
</style>
