<script setup lang="ts">
import { Button } from '@sil/ui'
import { useBemm } from 'bemm'

const bemm = useBemm('ankore-home', { return: 'string' })

const productsUsingAnkore = [
  { name: 'Tiko', mark: 'Ti', description: 'Device-first continuity for child-facing experiences.' },
  { name: 'Mikki', mark: 'Mi', description: 'Anonymous-first continuity for focused personal tools.' },
] as const

const principles = [
  { label: 'Start anonymous', text: 'Create a subject, device, and session before asking for an email.' },
  { label: 'Upgrade later', text: 'Attach recovery, ownership, billing, API keys, and entitlements when needed.' },
  { label: 'Keep it small', text: 'One Worker package, one D1 store, explicit configuration, typed client helpers.' },
] as const
</script>

<template>
  <main :class="bemm()">
    <section :class="[bemm('section'), bemm('hero')]">
      <p :class="bemm('eyebrow')">anchor + encore</p>
      <h1>Identity continuity before accounts.</h1>
      <p :class="bemm('lede')">
        Ankore gives products a tiny identity core: subject, device, session, optional account,
        recovery, API keys, entitlements, and audit trails. Start useful immediately; add account
        features only when they create value.
      </p>
      <div :class="bemm('actions')">
        <Button variant="primary" to="/docs/quickstart">Install Ankore</Button>
        <Button variant="outline" href="https://github.com/silvandiepen/ankore" external>GitHub</Button>
      </div>
    </section>

    <section :class="[bemm('section'), bemm('principles')]" aria-labelledby="principles-title">
      <div :class="bemm('section-heading')">
        <p :class="bemm('eyebrow')">Why</p>
        <h2 id="principles-title">Login walls break the first useful moment.</h2>
      </div>
      <article v-for="principle in principles" :key="principle.label" :class="bemm('card')">
        <span>{{ principle.label }}</span>
        <p>{{ principle.text }}</p>
      </article>
    </section>

    <section :class="[bemm('section'), bemm('quickstart')]" aria-labelledby="quickstart-title">
      <div>
        <p :class="bemm('eyebrow')">10-minute path</p>
        <h2 id="quickstart-title">One tiny Worker.</h2>
        <p>Install the package, bind D1, set a pepper, deploy the Worker, and call <code>POST /v1/identity/device</code>.</p>
        <Button variant="ghost" to="/docs/quickstart">Read the installation docs</Button>
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

    <section :class="[bemm('section'), bemm('architecture')]" aria-labelledby="architecture-title">
      <p :class="bemm('eyebrow')">Architecture</p>
      <h2 id="architecture-title">Product app → Ankore Worker → D1 → optional email provider.</h2>
      <div :class="bemm('flow')" aria-label="Ankore architecture flow">
        <span>Product app</span>
        <span>Ankore Worker</span>
        <span>D1 identity store</span>
        <span>Email provider</span>
      </div>
    </section>
  </main>
</template>

<style lang="scss">
.ankore-home {
  position: relative;
  padding-top: calc(var(--space) * 6);

  &__section {
    width: min(1120px, calc(100% - 2rem));
    margin: 0 auto;
    padding: var(--spacing) 0;
  }

  &__eyebrow {
    color: color-mix(in srgb, var(--color-foreground), transparent 34%);
    text-transform: uppercase;
    font-size: .78rem;
    font-weight: 700;
    letter-spacing: .08em;
  }

  &__hero {
    min-height: 70vh;
    display: grid;
    align-content: center;
    gap: var(--space-l);

    h1 {
      max-width: 20ch;
      margin: 0;
      font-size: clamp(3rem, 6vw, 8.5rem);
      line-height: .95;
      letter-spacing: 0;
    }
  }

  &__lede {
    max-width: 780px;
    color: color-mix(in srgb, currentColor, transparent 22%);
    font-size: clamp(1.15rem, 2vw, 1.5rem);
  }

  &__actions,
  &__principles,
  &__product-grid {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space);
  }

  &__section-heading {
    flex: 1 1 100%;
    max-width: 720px;
  }

  &__card,
  &__product,
  &__quickstart,
  &__architecture {
    border: 1px solid color-mix(in srgb, var(--color-foreground), transparent 88%);
    border-radius: 2rem;
    background: color-mix(in srgb, var(--color-background), var(--color-foreground) 4%);
    box-shadow: 0 1rem 4rem color-mix(in srgb, var(--color-foreground), transparent 94%);
  }

  &__card {
    flex: 1 1 260px;
    padding: var(--space-l);

    span {
      display: block;
      margin-bottom: var(--space-s);
      color: color-mix(in srgb, var(--color-foreground), transparent 34%);
      font-weight: 800;
    }
  }

  &__quickstart {
    display: grid;
    grid-template-columns: minmax(0, .8fr) minmax(0, 1.2fr);
    gap: var(--space-l);
    padding: var(--space-l);
  }

  &__products {
    display: grid;
    gap: var(--space-l);
  }

  &__product-grid {
    align-items: stretch;
  }

  &__product {
    flex: 1 1 280px;
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

  &__flow {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: .75rem;
    margin-top: var(--space-l);

    span {
      display: grid;
      place-items: center;
      min-height: 6rem;
      border-radius: 1.25rem;
      background: color-mix(in srgb, var(--color-background), var(--color-foreground) 8%);
      text-align: center;
      font-weight: 700;
    }
  }

  &__architecture {
    padding: var(--space-l);
  }
}

@media (max-width: 760px) {
  .ankore-home {
    &__quickstart,
    &__flow {
      grid-template-columns: 1fr;
    }
  }
}
</style>
