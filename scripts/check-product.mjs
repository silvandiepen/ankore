import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const root = new URL('..', import.meta.url).pathname
const requiredDocs = [
  'docs/WHY.md',
  'docs/QUICKSTART.md',
  'docs/CONFIG.md',
  'docs/API.md',
  'docs/CLIENT.md',
  'docs/STORAGE.md',
  'docs/SECURITY.md',
  'docs/EMAIL.md',
  'docs/RELEASE.md',
  'docs/TROUBLESHOOTING.md',
]

const requiredFiles = [
  ...requiredDocs,
  'examples/worker-basic/package.json',
  'examples/worker-basic/wrangler.toml',
  'examples/worker-basic/src/index.ts',
  'examples/worker-basic/README.md',
  'site/package.json',
  'site/vite.config.ts',
  'site/src/main.ts',
  'site/src/App.vue',
]

const requiredDocPhrases = [
  'Purpose',
  'Minimal working example',
  'Configuration required',
  'Security notes',
  'Verification command',
  'Known limits',
]

const failures = []

for (const file of requiredFiles) {
  if (!existsSync(join(root, file))) failures.push(`Missing ${file}`)
}

for (const file of requiredDocs) {
  const path = join(root, file)
  if (!existsSync(path)) continue
  const content = readFileSync(path, 'utf8')
  for (const phrase of requiredDocPhrases) {
    if (!content.includes(phrase)) failures.push(`${file} missing section: ${phrase}`)
  }
}

const packageJson = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'))
for (const script of ['docs:check', 'examples:check', 'site:check', 'site:typecheck', 'site:build', 'release']) {
  if (!packageJson.scripts?.[script]) failures.push(`package.json missing script ${script}`)
}

if (failures.length) {
  console.error(failures.map(failure => `- ${failure}`).join('\n'))
  process.exit(1)
}

console.log('Ankore product surface check passed')
