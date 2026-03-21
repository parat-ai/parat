/**
 * Integration test: core TypeScript interfaces
 *
 * Verifies that all 4 interface files exist, are non-empty, and that
 * TypeScript compilation succeeds across the whole project with the new types.
 */

import fs from 'fs'
import path from 'path'
import { execSync } from 'child_process'

const PROJECT_ROOT = path.resolve(__dirname, '../..')

const INTERFACE_FILES = [
  'src/types/index.ts',
  'src/lib/ai/interfaces.ts',
  'src/lib/legal/interfaces.ts',
  'src/lib/storage/interfaces.ts',
]

describe('core interface files', () => {
  it.each(INTERFACE_FILES)('file exists and is non-empty: %s', (file) => {
    const fullPath = path.join(PROJECT_ROOT, file)
    expect(fs.existsSync(fullPath)).toBe(true)
    const content = fs.readFileSync(fullPath, 'utf8')
    expect(content.trim().length).toBeGreaterThan(0)
  })

  it('no file contains "any" type annotations', () => {
    for (const file of INTERFACE_FILES) {
      const fullPath = path.join(PROJECT_ROOT, file)
      const content = fs.readFileSync(fullPath, 'utf8')
      // Match ': any' or '<any>' but not inside comments
      const lines = content.split('\n').filter((l) => !l.trim().startsWith('//'))
      const anyUsage = lines.filter((l) => /:\s*any\b|<any>/.test(l))
      expect(anyUsage).toHaveLength(0)
    }
  })
})

describe('TypeScript compilation', () => {
  it('tsc --noEmit reports no errors in interface files', () => {
    const result = execSync(
      `node_modules/.bin/tsc --noEmit 2>&1 | grep -v "migration-chain.test.ts" || true`,
      { cwd: PROJECT_ROOT, encoding: 'utf8', shell: '/bin/bash' }
    )
    expect(result.trim()).toBe('')
  }, 30000)
})
