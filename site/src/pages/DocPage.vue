<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { Markdown } from '@sil/ui'
import { useBemm } from 'bemm'
import { defaultDocsSlug, getDocsPage } from '../docs'
import { useI18n } from '../i18n'

const props = defineProps<{
  slug?: string
}>()

const bemm = useBemm('ankore-doc-page', { return: 'string' })
const route = useRoute()
const { t, locale } = useI18n()

const page = computed(() => {
  locale.value
  const slug = props.slug ?? String(route.params.slug ?? defaultDocsSlug)
  return getDocsPage(slug) ?? getDocsPage(defaultDocsSlug)
})
</script>

<template>
  <article v-if="page" :class="bemm()">
    <header :class="bemm('header')">
      <p :class="bemm('eyebrow')">{{ t('common.documentation') }}</p>
      <h1>{{ page.title }}</h1>
      <p>{{ page.description }}</p>
    </header>
    <Markdown :class="bemm('body')" :content="page.content" />
  </article>
</template>

<style lang="scss">
.ankore-doc-page {
  max-width: 920px;

  &__header {
    margin-bottom: var(--space-xl);

    h1 {
      max-width: 18ch;
      margin: 0;
      font-size: clamp(3.2rem, 6vw, 7.25rem) !important;
      font-weight: 100;
      line-height: 1.02;
      letter-spacing: 0;
    }

    p:last-child {
      max-width: 680px;
      color: color-mix(in srgb, currentColor, transparent 28%);
      font-size: 1.2rem;
    }
  }

  &__eyebrow {
    color: color-mix(in srgb, var(--color-foreground), transparent 34%);
    text-transform: uppercase;
    font-size: .78rem;
    font-weight: 700;
    letter-spacing: .08em;
  }

  &__body {
    line-height: 1.75;

    h2, h3 {
      margin-top: var(--space-xl);
      letter-spacing: 0;
    }

    pre {
      overflow: auto;
      padding: var(--space-l);
      border-radius: 1.25rem;
      background: color-mix(in srgb, var(--color-background), var(--color-foreground) 12%);
      color: var(--color-foreground);
    }

    code {
      font-size: .92em;
    }

    a:not(.button) {
      color: color-mix(in srgb, var(--color-foreground), transparent 8%);
    }
  }
}
</style>
