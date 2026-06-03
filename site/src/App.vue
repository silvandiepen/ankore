<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { PillHeader } from '@sil/ui'

const route = useRoute()

const navItems = [
  { label: 'Home', to: '/', exact: true },
  { label: 'Docs', to: '/docs/quickstart' },
  { label: 'API', to: '/docs/api' },
  { label: 'Security', to: '/docs/security' },
]

const currentPath = computed(() => route.path)
</script>

<template>
  <PillHeader
    brand-suffix="Ankore"
    brand-aria-label="Ankore home"
    brand-to="/"
    color-mode="dark"
    :nav-items="navItems"
    :current-path="currentPath"
  >
    <template #brand-mark>
      <span class="ankore-brand-mark" aria-hidden="true">A</span>
    </template>
  </PillHeader>

  <RouterView />
</template>
