<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { PillHeader } from '@sil/ui'
import AnkoreLogo from './components/AnkoreLogo.vue'
import { localeOptions, setAnkoreLocale, useI18n } from './i18n'
import { type ColorMode, useColorMode } from './composables/useColorMode'

const route = useRoute()
const { t, locale } = useI18n()
const { currentMode, setMode } = useColorMode()

const themeModes: ColorMode[] = ['system', 'light', 'dark']

const navItems = computed(() => [
  { label: t('nav.why'), to: '/why' },
  { label: t('nav.architecture'), to: '/architecture' },
  { label: t('nav.integrations'), to: '/integrations' },
  { label: t('nav.docs'), to: '/docs/quickstart' },
])

const currentPath = computed(() => route.path)

const themeIcon = computed(() => {
  if (currentMode.value === 'light') return 'weather/sun-light-mode'
  if (currentMode.value === 'dark') return 'weather/moon'
  return 'weather/light-dark-mode-2'
})

const actions = computed(() => [
  {
    label: locale.value.toUpperCase(),
    icon: 'ui/globe',
    items: localeOptions.map((option) => ({
      label: option.nativeName,
      handler: () => void setAnkoreLocale(option.value),
    })),
  },
  {
    label: t(`header.themes.${currentMode.value}`),
    icon: themeIcon.value,
    items: themeModes.map((mode) => ({
      label: t(`header.themes.${mode}`),
      handler: () => setMode(mode),
    })),
  },
])
</script>

<template>
  <PillHeader
    brand-suffix="Ankore"
    :brand-aria-label="t('header.home')"
    brand-to="/"
    color-mode="auto"
    :nav-items="navItems"
    :actions="actions"
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
