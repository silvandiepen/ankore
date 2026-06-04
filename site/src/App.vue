<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { PillHeader } from '@sil/ui'
import AnkoreLogo from './components/AnkoreLogo.vue'

const route = useRoute()

const navItems = [
  { label: 'Home', to: '/', exact: true },
  { label: 'Why', to: '/why' },
  { label: 'Architecture', to: '/architecture' },
  { label: 'Integrations', to: '/integrations' },
  { label: 'Docs', to: '/docs/quickstart' },
]

const currentPath = computed(() => route.path)
</script>

<template>
  <PillHeader
    brand-suffix="Ankore"
    brand-aria-label="Ankore home"
    brand-to="/"
    color-mode="auto"
    :nav-items="navItems"
    :current-path="currentPath"
  >
    <template #brand-mark>
      <span class="ankore-brand-mark" aria-hidden="true">
        <AnkoreLogo />
      </span>
    </template>
  </PillHeader>

  <RouterView />
</template>
