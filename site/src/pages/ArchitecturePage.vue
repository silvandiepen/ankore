<script setup lang="ts">
import { Button } from '@sil/ui'
import { useBemm } from 'bemm'

const bemm = useBemm('ankore-page', { return: 'string' })

const layers = [
  ['Product app', 'Calls Ankore client helpers, stores public subject/device identifiers, and owns the product experience.'],
  ['Ankore Worker', 'Validates requests, issues sessions, handles recovery challenges, and exposes the identity API.'],
  ['D1 identity store', 'Keeps subjects, devices, sessions, accounts, API keys, entitlements, and audit trails.'],
  ['Optional providers', 'Email delivery, billing, analytics, and product-specific APIs attach through explicit configuration.'],
] as const
</script>

<template>
  <main :class="bemm()">
    <section :class="bemm('hero')">
      <p :class="bemm('eyebrow')">Architecture</p>
      <h1>A small identity boundary between product code and account features.</h1>
      <p>
        Ankore is intentionally boring: one Worker package, one database binding, typed client
        helpers, and explicit configuration for origins, secrets, recovery, and rollout.
      </p>
      <Button variant="primary" to="/docs/api">Explore the API</Button>
    </section>
    <section :class="bemm('grid')" aria-label="Architecture layers">
      <article v-for="layer in layers" :key="layer[0]" :class="bemm('card')">
        <h2>{{ layer[0] }}</h2>
        <p>{{ layer[1] }}</p>
      </article>
    </section>
  </main>
</template>

<style lang="scss">
.ankore-page {
  width: min(1120px, calc(100% - 2rem));
  margin: 0 auto;
  padding: calc(var(--space) * 8) 0 var(--spacing);

  &__hero {
    display: grid;
    gap: var(--space-l);
    margin-bottom: var(--spacing);

    h1 {
      max-width: 12ch;
      margin: 0;
      font-size: clamp(3.5rem, 10vw, 8.5rem);
      line-height: .9;
      letter-spacing: 0;
    }

    p {
      max-width: 760px;
      color: color-mix(in srgb, currentColor, transparent 24%);
      font-size: clamp(1.2rem, 2vw, 1.5rem);
    }
  }

  &__eyebrow {
    color: color-mix(in srgb, var(--color-foreground), transparent 34%);
    text-transform: uppercase;
    font-size: .78rem;
    font-weight: 800;
    letter-spacing: .08em;
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: var(--space);
  }

  &__card {
    padding: var(--space-l);
    border: 1px solid color-mix(in srgb, var(--color-foreground), transparent 88%);
    border-radius: 2rem;
    background: color-mix(in srgb, var(--color-background), var(--color-foreground) 4%);

    h2, h3 {
      margin-top: 0;
      letter-spacing: 0;
    }

    p, li {
      color: color-mix(in srgb, currentColor, transparent 24%);
      line-height: 1.65;
    }
  }
}

@media (max-width: 760px) {
  .ankore-page__grid {
    grid-template-columns: 1fr;
  }
}
</style>
