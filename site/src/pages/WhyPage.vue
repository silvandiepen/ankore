<script setup lang="ts">
import { Button } from '@sil/ui'
import { useBemm } from 'bemm'

const bemm = useBemm('ankore-page', { return: 'string' })

const reasons = [
  {
    title: 'Continuity is not the same as account management',
    text: 'A product often needs to remember a person or device before it needs a profile. Ankore keeps that first identity primitive small and portable.',
  },
  {
    title: 'Recovery should be an upgrade, not a gate',
    text: 'Email challenges, account links, and ownership proofs are added when a user wants durability. The first session can stay lightweight.',
  },
  {
    title: 'Product state should survive auth changes',
    text: 'Anonymous usage, recovered access, and account-backed access all point at the same subject instead of forcing data migration between auth modes.',
  },
  {
    title: 'The boundary should be inspectable',
    text: 'A small Worker + D1 module is easier to audit than a broad auth platform. The product decides which capabilities to enable.',
  },
] as const
</script>

<template>
  <main :class="bemm()">
    <section :class="bemm('hero')">
      <p :class="bemm('eyebrow')">Why Ankore</p>
      <h1>Stop asking for accounts before value exists.</h1>
      <p>
        Ankore exists for products where “remember me” matters before “sign me up”. It gives
        teams a stable subject model first, then lets stronger proof attach over time.
      </p>
      <Button variant="primary" to="/docs/why">Read the full rationale</Button>
    </section>
    <section :class="bemm('grid')" aria-label="Reasons">
      <article v-for="reason in reasons" :key="reason.title" :class="bemm('card')">
        <h2>{{ reason.title }}</h2>
        <p>{{ reason.text }}</p>
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
