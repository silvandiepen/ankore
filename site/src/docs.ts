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

export interface DocsPage {
  readonly slug: string
  readonly title: string
  readonly description: string
  readonly content: string
}

export const docsPages = [
  { slug: 'why', title: 'Why Ankore', description: 'Identity continuity, not an account wall.', content: why },
  { slug: 'quickstart', title: 'Quickstart', description: 'Install Ankore and boot a Worker in minutes.', content: quickstart },
  { slug: 'config', title: 'Configuration', description: 'Required bindings, secrets, origins, and rollout settings.', content: config },
  { slug: 'api', title: 'API', description: 'HTTP endpoints for subjects, devices, sessions, accounts, keys, and entitlements.', content: api },
  { slug: 'client', title: 'Client usage', description: 'Browser integration for anonymous-first apps.', content: client },
  { slug: 'storage', title: 'Storage', description: 'D1 schema, migrations, retention, and operational notes.', content: storage },
  { slug: 'security', title: 'Security', description: 'Threat model, secret handling, CORS, challenges, and audit trails.', content: security },
  { slug: 'email', title: 'Email', description: 'Challenge delivery, provider hooks, and recovery flows.', content: email },
  { slug: 'release', title: 'Release', description: 'Versioning, packaging, CI checks, and promotion steps.', content: release },
  { slug: 'troubleshooting', title: 'Troubleshooting', description: 'Common integration failures and verification commands.', content: troubleshooting },
] as const satisfies readonly DocsPage[]

export const defaultDocsSlug = 'quickstart'

export function getDocsPage(slug: string): DocsPage | undefined {
  return docsPages.find((page) => page.slug === slug)
}
