import why from '../../docs/WHY.md?raw'
import quickstart from '../../docs/QUICKSTART.md?raw'
import config from '../../docs/CONFIG.md?raw'
import api from '../../docs/API.md?raw'
import client from '../../docs/CLIENT.md?raw'
import storage from '../../docs/STORAGE.md?raw'
import security from '../../docs/SECURITY.md?raw'
import email from '../../docs/EMAIL.md?raw'
import release from '../../docs/RELEASE.md?raw'
import troubleshooting from '../../docs/TROUBLESHOOTING.md?raw'
import { lezuI18n } from './i18n'

export interface DocsPage {
  readonly slug: string
  readonly title: string
  readonly description: string
  readonly content: string
}

const docsContent = {
  why,
  quickstart,
  config,
  api,
  client,
  storage,
  security,
  email,
  release,
  troubleshooting,
} as const

export type DocsSlug = keyof typeof docsContent

export const docsSlugs = Object.keys(docsContent) as DocsSlug[]

export const docsPages = docsSlugs.map((slug) => getDocsPage(slug)) as DocsPage[]

export const defaultDocsSlug = 'quickstart'

export function getDocsPage(slug: string): DocsPage | undefined {
  if (!isDocsSlug(slug)) return undefined

  return {
    slug,
    title: lezuI18n.t(`docs.${slug}.title`),
    description: lezuI18n.t(`docs.${slug}.description`),
    content: docsContent[slug],
  }
}

function isDocsSlug(slug: string): slug is DocsSlug {
  return slug in docsContent
}
