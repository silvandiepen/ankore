import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const root = new URL('..', import.meta.url).pathname
const siteRoot = join(root, 'site')

const requiredFiles = [
  'src/App.vue',
  'src/router.ts',
  'src/docs.ts',
  'src/env.d.ts',
  'src/pages/HomePage.vue',
  'src/pages/DocsLayout.vue',
  'src/pages/DocPage.vue',
]

const requiredRoutes = [
  '/docs',
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
  if (!home.includes('max-width: 20ch')) failures.push('HomePage hero h1 max-width must be 20ch')
  if (!home.includes('font-size: clamp(3rem, 6vw, 8.5rem)')) failures.push('HomePage hero h1 font-size must match requested clamp')
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
