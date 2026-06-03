import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const root = new URL('..', import.meta.url).pathname
const siteRoot = join(root, 'site')

const requiredFiles = [
  'src/App.vue',
  'src/router.ts',
  'src/docs.ts',
  'src/env.d.ts',
  'public/_redirects',
  'public/ankore-logo.svg',
  'src/components/AnkoreLogo.vue',
  'src/pages/HomePage.vue',
  'src/pages/WhyPage.vue',
  'src/pages/ArchitecturePage.vue',
  'src/pages/IntegrationsPage.vue',
  'src/pages/DocsLayout.vue',
  'src/pages/DocPage.vue',
]

const requiredRoutes = [
  '/why',
  '/architecture',
  '/integrations',
  '/docs',
  '/docs/why',
  '/docs/quickstart',
  '/docs/config',
  '/docs/api',
  '/docs/client',
  '/docs/storage',
  '/docs/security',
  '/docs/email',
  '/docs/release',
  '/docs/troubleshooting',
]

const forbiddenMarketingPhrases = [
  'built for Sil products',
  'Sil products one small identity core',
  'gives Tiko, Mikki',
  'other Sil products',
]

const failures = []

for (const file of requiredFiles) {
  if (!existsSync(join(siteRoot, file))) failures.push(`Missing site/${file}`)
}

const routerPath = join(siteRoot, 'src/router.ts')
if (existsSync(routerPath)) {
  const router = readFileSync(routerPath, 'utf8')
  for (const route of requiredRoutes) {
    if (!router.includes(route)) failures.push(`Router missing ${route}`)
  }
  if (!router.includes('scrollBehavior')) failures.push('Router missing scrollBehavior')
}

const siteSourceFiles = requiredFiles
  .filter((file) => file.endsWith('.vue') || file.endsWith('.ts'))
  .map((file) => join(siteRoot, file))
  .filter(existsSync)

for (const file of siteSourceFiles) {
  const content = readFileSync(file, 'utf8')
  for (const phrase of forbiddenMarketingPhrases) {
    if (content.includes(phrase)) failures.push(`${file.replace(root + '/', '')} contains forbidden marketing phrase: ${phrase}`)
  }
  if (file.endsWith('.vue') && content.includes('<style scoped')) failures.push(`${file.replace(root + '/', '')} uses scoped styles`)
}

const homePath = join(siteRoot, 'src/pages/HomePage.vue')
if (existsSync(homePath)) {
  const home = readFileSync(homePath, 'utf8')
  if (!home.includes('useBemm(')) failures.push('HomePage must use bemm')
  if (!home.includes('products-using-ankore')) failures.push('HomePage missing products-using-ankore section')
  if (!home.includes('max-width: 7ch')) failures.push('HomePage hero h1 max-width must be visibly narrow')
  if (!home.includes('font-size: clamp(4rem, 13vw, 10rem)')) failures.push('HomePage hero h1 font-size must be visibly oversized')
  if (!home.includes('<AnkoreLogo')) failures.push('HomePage missing Ankore logo in hero')
  for (const phrase of ['Most auth systems start with the heaviest question', 'Small pieces that cover the whole identity lifecycle', 'The upgrade path is explicit']) {
    if (!home.includes(phrase)) failures.push(`HomePage missing richer content phrase: ${phrase}`)
  }
}

const redirectsPath = join(siteRoot, 'public/_redirects')
if (existsSync(redirectsPath)) {
  const redirects = readFileSync(redirectsPath, 'utf8')
  if (!redirects.includes('/* /index.html 200')) failures.push('site/public/_redirects missing SPA fallback')
}

const docsLayoutPath = join(siteRoot, 'src/pages/DocsLayout.vue')
if (existsSync(docsLayoutPath) && !readFileSync(docsLayoutPath, 'utf8').includes('useBemm(')) {
  failures.push('DocsLayout must use bemm')
}

if (failures.length) {
  console.error(failures.map((failure) => `- ${failure}`).join('\n'))
  process.exit(1)
}

console.log('Ankore site check passed')
