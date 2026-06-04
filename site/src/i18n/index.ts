import { ref } from 'vue'
import { createI18n, fromObject, setDefaultI18n } from 'lezu-i18n'
import { createLezuI18nVue, useI18n } from 'lezu-i18n/vue'
import en from './locales/en.json'
import fr from './locales/fr.json'
import hy from './locales/hy.json'
import mt from './locales/mt.json'
import nl from './locales/nl.json'

const projectId = 'project_4b0733d4-21b6-499a-ad2a-ba1eb4d6f1bb'
const baseUrl = 'https://api.lezu.app'

interface LocaleOption {
  readonly label: string
  readonly nativeName: string
  readonly code: string
  readonly value: string
}

interface LezuLocaleResponse {
  readonly data?: {
    readonly locales?: Array<{
      readonly code?: string
      readonly name?: string
      readonly enabled?: boolean
    }>
  }
}

const nativeLocaleNames: Record<string, string> = {
  en: 'English',
  nl: 'Nederlands',
  fr: 'Français',
  mt: 'Malti',
  hy: 'Հայերեն',
}

const messages: Record<string, Record<string, unknown>> = { en, fr, hy, mt, nl }
const localLocaleCodes = Object.keys(messages)
const supportedLocales = new Set<string>(localLocaleCodes)
const storageKey = 'ankore-locale'

function toLocaleOption(code: string, label?: string): LocaleOption {
  const nativeName = nativeLocaleNames[code] ?? label ?? code.toUpperCase()
  return { label: label ?? nativeName, nativeName, code, value: code }
}

const fallbackLocaleOptions = localLocaleCodes.map((code) => toLocaleOption(code))
export const localeOptions = ref<LocaleOption[]>(fallbackLocaleOptions)

function normalizeLocale(locale: string | null | undefined): string {
  const baseLocale = locale?.split('-')[0]
  return supportedLocales.has(baseLocale ?? '') ? (baseLocale as string) : 'en'
}

function detectLocale(): string {
  if (typeof window === 'undefined') return 'en'
  const stored = normalizeLocale(window.localStorage.getItem(storageKey))
  if (stored !== 'en') return stored
  return normalizeLocale(window.navigator.language)
}

const detectedLocale = detectLocale()

export const lezuI18n = createI18n({
  locale: detectedLocale,
  fallbackLocale: 'en',
  messages: { [detectedLocale]: messages[detectedLocale] ?? messages.en },
  loaders: { messages: fromObject(messages) },
  remote: {
    enabled: true,
    projectId,
    environment: 'production',
    baseUrl,
    sourcePriority: ['remote', 'local'],
  },
})

setDefaultI18n(lezuI18n)
lezuI18n.loadRemoteBundle(detectedLocale).catch(() => {})

export async function loadLezuLocales(): Promise<void> {
  if (typeof fetch === 'undefined') return
  try {
    const response = await fetch(`${baseUrl}/v1/i18n/projects/${projectId}/locales`, {
      headers: { Accept: 'application/json' },
    })
    if (!response.ok) return
    const body = (await response.json()) as LezuLocaleResponse
    const nextOptions = (body.data?.locales ?? [])
      .filter((locale) => locale.enabled !== false && typeof locale.code === 'string')
      .map((locale) => {
        const code = locale.code as string
        supportedLocales.add(code)
        return toLocaleOption(code, locale.name)
      })
    if (nextOptions.length > 0) localeOptions.value = nextOptions
  } catch {
    // Public locale metadata is progressive enhancement; local fallbacks keep the site usable.
  }
}

void loadLezuLocales()

export async function setAnkoreLocale(locale: string): Promise<void> {
  const nextLocale = normalizeLocale(locale)
  if (typeof window !== 'undefined') window.localStorage.setItem(storageKey, nextLocale)
  await lezuI18n.setLocale(nextLocale)
  lezuI18n.loadRemoteBundle(nextLocale).catch(() => {})
}

export const i18nPlugin = createLezuI18nVue(lezuI18n)
export { useI18n }
