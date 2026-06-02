import { mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { execFileSync as run } from 'node:child_process'

describe('package install surface', () => {
  it('packs and installs with public exports available', () => {
    const root = process.cwd()
    const temp = mkdtempSync(join(tmpdir(), 'ankore-install-'))
    const env = { ...process.env, npm_config_cache: join(temp, '.npm-cache') }
    try {
      const packed = run('npm', ['pack', '--silent'], { cwd: root, encoding: 'utf8', env }).trim().split('\n').at(-1)!
      run('npm', ['init', '-y'], { cwd: temp, stdio: 'ignore', env })
      run('npm', ['install', join(root, packed)], { cwd: temp, stdio: 'ignore', env })
      writeFileSync(join(temp, 'check.mjs'), `
        import { normalizeConfig } from '@sil/ankore'
        import { createIdentityWorker } from '@sil/ankore/worker'
        import { createAnkoreClient } from '@sil/ankore/client'
        if (typeof normalizeConfig !== 'function') throw new Error('missing normalizeConfig')
        if (typeof createIdentityWorker !== 'function') throw new Error('missing worker')
        if (typeof createAnkoreClient !== 'function') throw new Error('missing client')
      `)
      run('node', ['check.mjs'], { cwd: temp, stdio: 'inherit', env })
      expect(packed).toMatch(/^sil-ankore-/)
    } finally {
      rmSync(temp, { recursive: true, force: true })
    }
  })
})
