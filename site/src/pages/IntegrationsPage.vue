<script setup lang="ts">
import { computed } from 'vue'
import { Button } from '@sil/ui'
import { useBemm } from 'bemm'
import { useI18n } from '../i18n'

interface IntegrationPath {
  readonly title: string
  readonly items: readonly string[]
}

const bemm = useBemm('ankore-page', { return: 'string' })
const { t, i18n } = useI18n()

const paths = computed(() => {
  const value = i18n.raw('integrations.paths')
  return Array.isArray(value) ? (value as IntegrationPath[]) : []
})
</script>

<template>
  <main :class="bemm()">
    <section :class="bemm('hero')">
      <p :class="bemm('eyebrow')">{{ t('integrations.eyebrow') }}</p>
      <h1>{{ t('integrations.title') }}</h1>
      <p>{{ t('integrations.intro') }}</p>
      <Button variant="primary" to="/docs/client">{{ t('integrations.action') }}</Button>
    </section>
    <section :class="bemm('grid')" :aria-label="t('integrations.aria')">
      <article v-for="path in paths" :key="path.title" :class="bemm('card')">
        <h2>{{ path.title }}</h2>
        <ul>
          <li v-for="item in path.items" :key="item">{{ item }}</li>
        </ul>
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
