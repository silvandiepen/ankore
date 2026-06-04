import { computed, ref } from 'vue'

export type ColorMode = 'system' | 'light' | 'dark'

const storageKey = 'ankore-color-mode'
const mode = ref<ColorMode>(readInitialMode())

function readInitialMode(): ColorMode {
  if (typeof window === 'undefined') return 'system'
  const stored = window.localStorage.getItem(storageKey)
  return stored === 'light' || stored === 'dark' || stored === 'system' ? stored : 'system'
}

function resolvedMode(value: ColorMode): 'light' | 'dark' {
  if (value !== 'system') return value
  if (typeof window === 'undefined') return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function applyMode(value: ColorMode): void {
  if (typeof document === 'undefined') return
  const resolved = resolvedMode(value)
  document.documentElement.setAttribute('data-theme', resolved)
  document.documentElement.setAttribute('data-color-mode', resolved)
  document.documentElement.setAttribute('data-color-preference', value)
}

export function useColorMode() {
  const currentMode = computed(() => mode.value)
  const currentResolvedMode = computed(() => resolvedMode(mode.value))

  function setMode(value: ColorMode): void {
    mode.value = value
    if (typeof window !== 'undefined') window.localStorage.setItem(storageKey, value)
    applyMode(value)
  }

  function cycleMode(): void {
    const modes: ColorMode[] = ['system', 'light', 'dark']
    const index = modes.indexOf(mode.value)
    setMode(modes[(index + 1) % modes.length] ?? 'system')
  }

  applyMode(mode.value)

  if (typeof window !== 'undefined') {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => applyMode(mode.value))
  }

  return { currentMode, currentResolvedMode, setMode, cycleMode }
}
