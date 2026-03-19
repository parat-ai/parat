import fs from 'fs'
import path from 'path'

const PROJECT_ROOT = path.resolve(__dirname, '../../..')

const REQUIRED_DIRS = [
  'src/app/(app)/cases/new',
  'src/app/(app)/cases/[id]/brief',
  'src/app/api/chat',
  'src/app/api/cases',
  'src/app/api/documents',
  'src/app/api/brief/[caseId]',
  'src/components/layout',
  'src/components/chat',
  'src/components/brief',
  'src/components/upload',
  'src/lib/ai/providers',
  'src/lib/ai/prompts',
  'src/lib/db/repositories',
  'src/lib/context',
  'src/lib/legal/providers',
  'src/lib/storage',
  'src/types',
  'supabase/migrations',
]

describe('scaffold folder structure', () => {
  it.each(REQUIRED_DIRS)('directory exists: %s', (dir) => {
    const fullPath = path.join(PROJECT_ROOT, dir)
    expect(fs.existsSync(fullPath)).toBe(true)
  })
})
