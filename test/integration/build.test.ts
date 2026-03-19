import { execSync } from 'child_process'
import path from 'path'

const PROJECT_ROOT = path.resolve(__dirname, '../..')

describe('Next.js build', () => {
  it('exits 0 with no TypeScript errors', () => {
    expect(() => {
      execSync('npx next build', {
        cwd: PROJECT_ROOT,
        encoding: 'utf8',
        stdio: 'pipe',
      })
    }).not.toThrow()
  }, 120000)
})
