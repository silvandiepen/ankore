<script setup lang="ts">
import { Button } from '@sil/ui'
import { useBemm } from 'bemm'
import AnkoreLogo from '../components/AnkoreLogo.vue'

const bemm = useBemm('ankore-home', { return: 'string' })

const proofPoints = [
  { value: '0', label: 'account wall before first use' },
  { value: '1', label: 'small Worker package' },
  { value: 'D1', label: 'portable identity store' },
] as const

const lifecycle = [
  { label: 'Anonymous subject', text: 'Start saving product state before sign-up.' },
  { label: 'Trusted device', text: 'Remember the browser or native app safely.' },
  { label: 'Recoverable session', text: 'Issue scoped tokens and rotate them cleanly.' },
  { label: 'Optional account', text: 'Attach email, billing, teams, or API keys later.' },
] as const

const modules = [
  { label: 'Subjects', text: 'Stable user-like identity without requiring a login.' },
  { label: 'Devices', text: 'Bind browsers, apps, and trusted surfaces to a subject.' },
  { label: 'Sessions', text: 'Issue scoped tokens for product APIs and workers.' },
  { label: 'Recovery', text: 'Add email challenges only when the user asks to keep access.' },
  { label: 'API keys', text: 'Create service credentials for integrations and automations.' },
  { label: 'Entitlements', text: 'Attach plan, usage, and feature flags without changing identity.' },
] as const

const principles = [
  'No passwords by default',
  'No account creation front door',
  'No public user enumeration',
  'Only hashes for tokens, codes, and secrets',
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
        <h6 :class="bemm('eyebrow')">anchor + encore</h6>
        <h1 :class="bemm('title')">Identity continuity before accounts.</h1>
        <p :class="bemm('lede')">
          Ankore is a lean Worker module for products that need remembered users,
          trusted devices, recoverable sessions, API keys, and entitlements without
          forcing sign-up at the first useful moment.
        </p>
        <div :class="bemm('actions')">
          <Button variant="primary" to="/docs/quickstart">Start with docs</Button>
          <Button variant="outline" to="/architecture">See architecture</Button>
        </div>
      </div>

      <aside :class="bemm('hero-card')" aria-label="Identity continuity lifecycle">
        <div :class="bemm('hero-card-header')">
          <span :class="bemm('logo-shell')"><AnkoreLogo /></span>
          <div>
            <strong>Ankore</strong>
            <span>small identity core</span>
          </div>
        </div>
        <ol :class="bemm('timeline')">
          <li v-for="item in lifecycle" :key="item.label">
            <strong>{{ item.label }}</strong>
            <span>{{ item.text }}</span>
          </li>
        </ol>
      </aside>
    </section>

    <section :class="[bemm('section'), bemm('proof')]" aria-label="Ankore proof points">
      <article v-for="point in proofPoints" :key="point.label" :class="bemm('metric')">
        <strong>{{ point.value }}</strong>
        <span>{{ point.label }}</span>
      </article>
    </section>

    <section :class="[bemm('section'), bemm('intro')]" aria-labelledby="problem-title">
      <div :class="bemm('section-heading')">
        <h6 :class="bemm('eyebrow')">Problem</h6>
        <h2 id="problem-title">Most auth systems start with the heaviest question.</h2>
      </div>
      <div :class="bemm('copy-stack')">
        <p>
          Products often need a stable identity before they need an account. A user may need
          to save a draft, keep a device trusted, resume a flow, or recover a link long before
          they care about passwords, billing, teams, or profiles.
        </p>
        <p>
          Ankore separates continuity from account management. Begin with an anonymous subject,
          then attach stronger proof, recovery, ownership, and paid capabilities when the
          product experience actually asks for them.
        </p>
      </div>
    </section>

    <section :class="[bemm('section'), bemm('modules')]" aria-labelledby="modules-title">
      <div :class="bemm('section-heading')">
        <h6 :class="bemm('eyebrow')">Surface area</h6>
        <h2 id="modules-title">Small pieces for the full identity lifecycle.</h2>
      </div>
      <div :class="bemm('card-grid')">
        <article v-for="item in modules" :key="item.label" :class="bemm('card')">
          <span :class="bemm('card-dot')" aria-hidden="true" />
          <h3>{{ item.label }}</h3>
          <p>{{ item.text }}</p>
        </article>
      </div>
    </section>

    <section :class="[bemm('section'), bemm('feature-band')]" aria-labelledby="flow-title">
      <div :class="bemm('band-copy')">
        <h6 :class="bemm('eyebrow')">Flow</h6>
        <h2 id="flow-title">The upgrade path stays explicit.</h2>
        <p>
          Start with useful anonymous state, then add proof only when the experience asks for it.
          No auth rewrite. No hidden coupling to a heavyweight provider.
        </p>
        <Button variant="ghost" to="/why">Read why this exists</Button>
      </div>
      <div :class="bemm('principles')">
        <span v-for="principle in principles" :key="principle">{{ principle }}</span>
      </div>
    </section>

    <section :class="[bemm('section'), bemm('quickstart')]" aria-labelledby="quickstart-title">
      <div :class="bemm('quickstart-copy')">
        <h6 :class="bemm('eyebrow')">10-minute path</h6>
        <h2 id="quickstart-title">Install, bind D1, deploy.</h2>
        <p>
          The package ships Worker handlers, client helpers, migrations, a typed contract test,
          and example Workers so product teams can adopt it without building auth from zero.
        </p>
        <Button variant="outline" to="/docs/quickstart">Open quickstart</Button>
      </div>
      <pre><code>npm install ankore

import { createIdentityWorker } from 'ankore/worker'
import config from './ankore.config.json'

export default createIdentityWorker(config)</code></pre>
    </section>

    <section :class="[bemm('section'), bemm('products')]" aria-labelledby="products-title">
      <div :class="bemm('section-heading')">
        <h6 :class="bemm('eyebrow')">Used by</h6>
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
  padding-top: calc(var(--space) * 5.5);
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: 0 0 auto;
    height: 32rem;
    pointer-events: none;
    background: color-mix(in srgb, var(--color-background), var(--color-foreground) 3%);
    mask-image: linear-gradient(to bottom, black, transparent);
  }

  &__section {
    position: relative;
    width: min(1120px, calc(100% - 2rem));
    margin: 0 auto;
    padding: calc(var(--space-xl) * 1.75) 0;
  }

  &__eyebrow {
    margin: 0 0 var(--space-s);
    color: color-mix(in srgb, var(--color-foreground), transparent 28%);
    text-transform: uppercase;
    font-size: .75rem;
    font-weight: 800;
    letter-spacing: .08em;
  }

  &__hero {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(320px, .68fr);
    align-items: center;
    gap: calc(var(--space-xl) * 1.35);
    min-height: min(760px, calc(100vh - 5rem));
    padding-top: calc(var(--space-xl) * 2.2);
  }

  &__hero-copy {
    max-width: 720px;
  }

  &__title,
  &__section-heading h2,
  &__band-copy h2,
  &__quickstart-copy h2 {
    margin: 0;
    letter-spacing: 0 !important;
    line-height: 1.02;
  }

  &__title {
    max-width: 18ch;
    font-size: clamp(3.2rem, 6vw, 7.25rem) !important;
    font-weight: 100;
  }

  &__lede {
    max-width: 640px;
    margin: var(--space-l) 0 0;
    color: color-mix(in srgb, currentColor, transparent 22%);
    font-size: clamp(1.05rem, 1.8vw, 1.32rem);
    line-height: 1.55;
  }

  &__actions {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-s);
    margin-top: var(--space-l);
  }

  &__hero-card,
  &__metric,
  &__card,
  &__feature-band,
  &__quickstart,
  &__product {
    border: 1px solid color-mix(in srgb, var(--color-foreground), transparent 90%);
    background: color-mix(in srgb, var(--color-background), var(--color-foreground) 3%);
    box-shadow: 0 1.25rem 4rem color-mix(in srgb, var(--color-foreground), transparent 95%);
  }

  &__hero-card {
    align-self: stretch;
    display: grid;
    align-content: start;
    gap: var(--space-l);
    padding: var(--space-l);
    border-radius: 2rem;
    background: color-mix(in srgb, var(--color-background), var(--color-foreground) 6%);
  }

  &__hero-card-header {
    display: flex;
    align-items: center;
    gap: var(--space);

    strong,
    span {
      display: block;
    }

    strong {
      font-size: 1.15rem;
    }

    span {
      color: color-mix(in srgb, currentColor, transparent 38%);
      font-size: .9rem;
    }
  }

  &__logo-shell {
    display: grid;
    place-items: center;
    width: 4rem;
    height: 4rem;
    border-radius: 1.35rem;
    background: color-mix(in srgb, var(--color-background), var(--color-foreground) 8%);
    color: color-mix(in srgb, var(--color-foreground), transparent 12%);

    .ankore-logo {
      width: 2.15rem;
      height: 2.45rem;
    }
  }

  &__timeline {
    display: grid;
    gap: var(--space-s);
    margin: 0;
    padding: 0;
    list-style: none;

    li {
      position: relative;
      display: grid;
      gap: .25rem;
      padding: var(--space) var(--space) var(--space) calc(var(--space-l) + .15rem);
      border-radius: 1.25rem;
      background: color-mix(in srgb, var(--color-background), var(--color-foreground) 4%);

      &::before {
        content: '';
        position: absolute;
        left: var(--space);
        top: 1.25rem;
        width: .6rem;
        height: .6rem;
        border-radius: 999px;
        background: color-mix(in srgb, var(--color-foreground), transparent 10%);
        box-shadow: 0 0 0 .35rem color-mix(in srgb, var(--color-background), var(--color-foreground) 12%);
      }
    }

    strong {
      font-size: .98rem;
    }

    span {
      color: color-mix(in srgb, currentColor, transparent 36%);
      font-size: .9rem;
      line-height: 1.45;
    }
  }

  &__proof {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--space);
    padding-top: 0;
  }

  &__metric {
    display: grid;
    gap: .35rem;
    padding: var(--space-l);
    border-radius: 1.5rem;

    strong {
      color: color-mix(in srgb, var(--color-foreground), transparent 14%);
      font-size: clamp(2.3rem, 5vw, 4.5rem);
      line-height: .9;
    }

    span {
      color: color-mix(in srgb, currentColor, transparent 34%);
      font-size: .95rem;
    }
  }

  &__intro {
    display: grid;
    grid-template-columns: minmax(0, .9fr) minmax(0, 1.1fr);
    gap: calc(var(--space-xl) * 1.25);
    align-items: start;
  }

  &__section-heading {
    max-width: 760px;

    h2 {
      max-width: 14ch;
      font-size: clamp(2rem, 5vw, 4.25rem);
      font-weight: 820;
    }
  }

  &__copy-stack {
    display: grid;
    gap: var(--space-l);
    color: color-mix(in srgb, currentColor, transparent 20%);
    font-size: clamp(1rem, 1.7vw, 1.22rem);
    line-height: 1.65;

    p {
      margin: 0;
    }
  }

  &__modules {
    display: grid;
    gap: var(--space-l);
  }

  &__card-grid,
  &__product-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--space);
  }

  &__card {
    position: relative;
    min-height: 13rem;
    padding: var(--space-l);
    border-radius: 1.5rem;

    h3 {
      margin: calc(var(--space-l) * 1.55) 0 var(--space-s);
      font-size: 1.2rem;
      letter-spacing: 0;
    }

    p {
      margin: 0;
      color: color-mix(in srgb, currentColor, transparent 34%);
      line-height: 1.55;
    }
  }

  &__card-dot {
    position: absolute;
    top: var(--space-l);
    left: var(--space-l);
    width: 2.4rem;
    height: 2.4rem;
    border-radius: .9rem;
    background: color-mix(in srgb, var(--color-background), var(--color-foreground) 7%);

    &::after {
      content: '';
      position: absolute;
      inset: .78rem;
      border-radius: 999px;
      background: color-mix(in srgb, var(--color-foreground), transparent 18%);
    }
  }

  &__feature-band,
  &__quickstart {
    display: grid;
    grid-template-columns: minmax(0, .9fr) minmax(0, 1.1fr);
    gap: var(--space-l);
    padding: var(--space-l);
    border-radius: 2rem;
  }

  &__feature-band {
    background: color-mix(in srgb, var(--color-background), var(--color-foreground) 4%);
  }

  &__band-copy,
  &__quickstart-copy {
    p {
      color: color-mix(in srgb, currentColor, transparent 28%);
      line-height: 1.6;
    }

    h2 {
      font-size: clamp(1.9rem, 4vw, 3.6rem);
    }
  }

  &__principles {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: var(--space-s);
    align-content: start;

    span {
      display: flex;
      align-items: center;
      min-height: 5rem;
      padding: var(--space);
      border-radius: 1.25rem;
      background: color-mix(in srgb, var(--color-background), var(--color-foreground) 5%);
      color: color-mix(in srgb, currentColor, transparent 14%);
      font-weight: 750;
    }
  }

  &__quickstart {
    align-items: stretch;
  }

  pre {
    margin: 0;
    min-height: 100%;
    border: 1px solid color-mix(in srgb, var(--color-foreground), transparent 90%);
    background: color-mix(in srgb, var(--color-background), var(--color-foreground) 8%);
  }

  &__products {
    display: grid;
    gap: var(--space-l);
  }

  &__product-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  &__product {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: var(--space);
    align-items: start;
    min-height: 10rem;
    padding: var(--space-l);
    border: 1px solid color-mix(in srgb, var(--color-foreground), transparent 90%);
    border-radius: 1.5rem;
    background: color-mix(in srgb, var(--color-background), var(--color-foreground) 5%);

    h3 {
      margin: 0 0 var(--space-xs);
      font-size: 1.2rem;
    }

    p {
      margin: 0;
      color: color-mix(in srgb, currentColor, transparent 34%);
      line-height: 1.55;
    }
  }

  &__product-logo {
    display: grid;
    place-items: center;
    width: 3rem;
    height: 3rem;
    border-radius: 1rem;
    background: color-mix(in srgb, var(--color-foreground), transparent 12%);
    color: var(--color-background);
    font-weight: 850;
    letter-spacing: -.03em;
  }

  @media (max-width: 900px) {
    &__hero,
    &__feature-band,
    &__quickstart {
      grid-template-columns: 1fr;
    }

    &__section {
      padding: var(--space-xl) 0;
    }

    &__card-grid,
    &__product-grid {
      grid-template-columns: 1fr;
    }

    &__title {
      max-width: 100%;
    }
  }

  @media (max-width: 640px) {
    padding-top: calc(var(--space) * 3.5);

    &__section {
      width: min(100% - 1rem, 1120px);
    }

    &__proof,
    &__principles {
      grid-template-columns: 1fr;
    }

    &__feature-band,
    &__quickstart,
    &__hero-card,
    &__card,
    &__product {
      border-radius: 1.25rem;
      padding: var(--space);
    }

    &__timeline li {
      grid-template-columns: 1fr;
    }
  }
}
</style>
