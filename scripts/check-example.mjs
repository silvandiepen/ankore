import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const root = new URL('..', import.meta.url).pathname
const files = [
  'examples/worker-basic/package.json',
  'examples/worker-basic/wrangler.toml',
  'examples/worker-basic/ankore.config.json',
  'examples/worker-basic/src/index.ts',
  'examples/worker-basic/README.md',
  'migrations/0001_identity_core.sql'
]
const failures = files.filter(file => !existsSync(join(root, file))).map(file => `Missing ${file}`)
const entry = existsSync(join(root, 'examples/worker-basic/src/index.ts')) ? readFileSync(join(root, 'examples/worker-basic/src/index.ts'), 'utf8') : ''
if (!entry.includes("createIdentityWorker")) failures.push('example Worker does not create an Ankore Worker')
const config = existsSync(join(root, 'examples/worker-basic/ankore.config.json')) ? JSON.parse(readFileSync(join(root, 'examples/worker-basic/ankore.config.json'), 'utf8')) : null
if (config?.basePath !== '/v1/identity') failures.push('example config must use /v1/identity')
if (!config?.session?.bearer) failures.push('example config must enable bearer sessions')
if (!config?.device?.autoCreateSubject) failures.push('example config must auto-create subjects for device bootstrap')
if (config?.accounts?.passwords !== false) failures.push('example config must explicitly disable password auth')
if (!config?.accounts?.enabled) failures.push('example config must enable accounts because API keys are enabled')
if (failures.length) {
  console.error(failures.map(failure => `- ${failure}`).join('\n'))
  process.exit(1)
}
console.log('Ankore example check passed')
