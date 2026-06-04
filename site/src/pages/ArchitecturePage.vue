<script setup lang="ts">
import { computed } from 'vue'
import { Button, Icon } from '@sil/ui'
import { useBemm } from 'bemm'
import { useI18n } from '../i18n'

type Layer = readonly [string, string]

const bemm = useBemm('ankore-page', { return: 'string' })
const { t, i18n, locale } = useI18n()
const cardIcons = ['misc/fingerprint', 'misc/key', 'ui/link', 'misc/shield-check']

const layers = computed(() => {
  locale.value
  const value = i18n.raw('architecture.layers')
  return Array.isArray(value) ? (value as Layer[]) : []
})
</script>

<template>
  <main :class="bemm()">
    <section :class="bemm('hero')">
      <p :class="bemm('eyebrow')">{{ t('architecture.eyebrow') }}</p>
      <h1>{{ t('architecture.title') }}</h1>
      <p>{{ t('architecture.intro') }}</p>
      <Button variant="primary" to="/docs/api">{{ t('architecture.action') }}</Button>
    </section>
    <section :class="bemm('grid')" :aria-label="t('architecture.aria')">
      <article v-for="(layer, index) in layers" :key="layer[0]" :class="bemm('card')">
        <span :class="bemm('card-icon')" aria-hidden="true"><Icon :name="cardIcons[index % cardIcons.length]" size="medium" /></span>
        <h2>{{ layer[0] }}</h2>
        <p>{{ layer[1] }}</p>
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
