<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { Button } from '@sil/ui'
import { useBemm } from 'bemm'
import { docsSlugs, getDocsPage } from '../docs'
import { useI18n } from '../i18n'

const bemm = useBemm('ankore-docs', { return: 'string' })
const route = useRoute()
const { t, locale } = useI18n()
const sidebarOpen = ref(false)

const currentSlug = computed(() => String(route.params.slug ?? ''))
const translatedDocsPages = computed(() => {
  locale.value
  return docsSlugs.map((slug) => getDocsPage(slug)).filter((page) => page !== undefined)
})

function closeSidebar(): void {
  sidebarOpen.value = false
}
</script>

<template>
  <main :class="bemm()">
    <aside :class="[bemm('sidebar'), sidebarOpen ? 'ankore-docs__sidebar--open' : '']">
      <RouterLink to="/" :class="bemm('back')" @click="closeSidebar">← {{ t('common.backToOverview') }}</RouterLink>
      <nav :class="bemm('nav')" :aria-label="t('common.documentation')">
        <RouterLink
          v-for="page in translatedDocsPages"
          :key="page.slug"
          :to="`/docs/${page.slug}`"
          :class="[bemm('link'), currentSlug === page.slug ? 'ankore-docs__link--active' : '']"
          @click="closeSidebar"
        >
          <span>{{ page.title }}</span>
          <small>{{ page.description }}</small>
        </RouterLink>
      </nav>
    </aside>

    <section :class="bemm('content')">
      <Button variant="outline" :class="bemm('toggle')" @click="sidebarOpen = !sidebarOpen">{{ t('common.docsMenu') }}</Button>
      <RouterView />
    </section>
  </main>
</template>

<style lang="scss">
.ankore-docs {
  display: grid;
  grid-template-columns: minmax(240px, 320px) minmax(0, 1fr);
  gap: var(--space-xl);
  width: min(1180px, calc(100% - 2rem));
  margin: 0 auto;
  padding: calc(var(--space) * 7) 0 var(--spacing);

  &__sidebar {
    align-self: start;
    position: sticky;
    top: 7rem;
    display: grid;
    gap: var(--space);
  }

  &__back {
    color: color-mix(in srgb, var(--color-foreground), transparent 24%);
    text-decoration: none;
    font-weight: 700;
  }

  &__nav {
    display: grid;
    gap: .4rem;
  }

  &__link {
    display: grid;
    gap: .25rem;
    padding: .85rem 1rem;
    border-radius: 1rem;
    color: var(--color-foreground);
    text-decoration: none;

    small {
      color: color-mix(in srgb, currentColor, transparent 45%);
      line-height: 1.35;
    }

    &--active {
      background: color-mix(in srgb, var(--color-background), var(--color-foreground) 8%);
    }
  }

  &__content {
    min-width: 0;
  }

  &__toggle {
    display: none !important;
    margin-bottom: var(--space);
  }
}

@media (max-width: 860px) {
  .ankore-docs {
    grid-template-columns: 1fr;

    &__sidebar {
      position: static;
      display: none;

      &--open {
        display: grid;
      }
    }

    &__toggle {
      display: inline-flex !important;
    }
  }
}
</style>
