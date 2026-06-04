import { createI18n, fromObject, setDefaultI18n } from 'lezu-i18n'
import { createLezuI18nVue, useI18n } from 'lezu-i18n/vue'
import en from './locales/en.json'
import fr from './locales/fr.json'
import hy from './locales/hy.json'
import mt from './locales/mt.json'
import nl from './locales/nl.json'

export const localeOptions = [
  { label: 'English', nativeName: 'English', code: 'en', value: 'en' },
  { label: 'Nederlands', nativeName: 'Nederlands', code: 'nl', value: 'nl' },
  { label: 'Français', nativeName: 'Français', code: 'fr', value: 'fr' },
  { label: 'Malti', nativeName: 'Malti', code: 'mt', value: 'mt' },
  { label: 'Հայերեն', nativeName: 'Հայերեն', code: 'hy', value: 'hy' },
] as const

type SupportedLocale = (typeof localeOptions)[number]['code']

const messages: Record<SupportedLocale, Record<string, unknown>> = { en, fr, hy, mt, nl }
const supportedLocales = new Set<string>(localeOptions.map((option) => option.code))
const storageKey = 'ankore-locale'

function normalizeLocale(locale: string | null | undefined): SupportedLocale {
  const baseLocale = locale?.split('-')[0]
  return supportedLocales.has(baseLocale ?? '') ? (baseLocale as SupportedLocale) : 'en'
}

function detectLocale(): SupportedLocale {
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
    projectId: 'project_4b0733d4-21b6-499a-ad2a-ba1eb4d6f1bb',
    environment: 'production',
    baseUrl: 'https://api.lezu.app',
    sourcePriority: ['remote', 'local'],
  },
})

setDefaultI18n(lezuI18n)
lezuI18n.loadRemoteBundle(detectedLocale).catch(() => {})

export async function setAnkoreLocale(locale: string): Promise<void> {
  const nextLocale = normalizeLocale(locale)
  if (typeof window !== 'undefined') window.localStorage.setItem(storageKey, nextLocale)
  await lezuI18n.setLocale(nextLocale)
  lezuI18n.loadRemoteBundle(nextLocale).catch(() => {})
}

export const i18nPlugin = createLezuI18nVue(lezuI18n)
export { useI18n }
