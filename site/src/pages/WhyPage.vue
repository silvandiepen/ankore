<script setup lang="ts">
import { computed } from 'vue'
import { Button, Icon } from '@sil/ui'
import { useBemm } from 'bemm'
import { useI18n } from '../i18n'

interface Reason {
  readonly title: string
  readonly text: string
}

const bemm = useBemm('ankore-page', { return: 'string' })
const { t, i18n, locale } = useI18n()
const cardIcons = ['misc/fingerprint', 'misc/key', 'ui/link', 'misc/shield-check']

const reasons = computed(() => {
  locale.value
  const value = i18n.raw('why.reasons')
  return Array.isArray(value) ? (value as Reason[]) : []
})
</script>

<template>
  <main :class="bemm()">
    <section :class="bemm('hero')">
      <p :class="bemm('eyebrow')">{{ t('why.eyebrow') }}</p>
      <h1>{{ t('why.title') }}</h1>
      <p>{{ t('why.intro') }}</p>
      <Button variant="primary" to="/docs/why">{{ t('why.action') }}</Button>
    </section>
    <section :class="bemm('grid')" :aria-label="t('why.aria')">
      <article v-for="(reason, index) in reasons" :key="reason.title" :class="bemm('card')">
        <span :class="bemm('card-icon')" aria-hidden="true"><Icon :name="cardIcons[index % cardIcons.length]" size="medium" /></span>
        <h2>{{ reason.title }}</h2>
        <p>{{ reason.text }}</p>
      </article>
    </section>
  </main>
</template>

<style lang="scss">
.ankore-page {
  width: min(1400px, 100%);
  margin: 0 auto;
  padding: calc(var(--space) * 5.5) 0 0;

  &__hero,
  &__grid {
    box-sizing: border-box;
    padding: var(--spacing);
  }

  &__hero {
    position: relative;
    display: grid;
    gap: var(--space-l);
    margin-bottom: var(--spacing);

    h1 {
      max-width: 18ch;
      margin: 0;
      font-size: clamp(3.2rem, 6vw, 7.25rem) !important;
      font-weight: 100;
      line-height: 1.02;
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
    position: relative;
    padding: var(--space-l);
    border: 1px solid color-mix(in srgb, var(--color-foreground), transparent 88%);
    border-radius: 2rem;
    background: color-mix(in srgb, var(--color-background), var(--color-foreground) 4%);

    h2, h3 {
      margin-top: calc(var(--space-l) * 1.6);
      letter-spacing: 0;
    }

    p, li {
      color: color-mix(in srgb, currentColor, transparent 24%);
      line-height: 1.65;
    }
  }

  &__card-icon {
    position: absolute;
    top: var(--space-l);
    left: var(--space-l);
    display: grid;
    place-items: center;
    width: 2.35rem;
    height: 2.35rem;
    border-radius: .85rem;
    background: color-mix(in srgb, var(--color-background), var(--color-foreground) 7%);
    color: color-mix(in srgb, var(--color-foreground), transparent 12%);
  }
}

@media (max-width: 760px) {
  .ankore-page__grid {
    grid-template-columns: 1fr;
  }
}
</style>
