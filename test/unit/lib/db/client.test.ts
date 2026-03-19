import { createSupabaseClient, createSupabaseAdminClient } from '@/lib/db/client'

jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => ({ type: 'mock-supabase-client' })),
}))

const { createClient } = jest.requireMock('@supabase/supabase-js')

describe('createSupabaseClient', () => {
  const originalEnv = process.env

  beforeEach(() => {
    jest.resetAllMocks()
    createClient.mockReturnValue({ type: 'mock-supabase-client' })
    process.env = { ...originalEnv }
  })

  afterAll(() => {
    process.env = originalEnv
  })

  it('returns a SupabaseClient when env vars are present', () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co'
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key'

    const client = createSupabaseClient()

    expect(client).toBeDefined()
    expect(createClient).toHaveBeenCalledWith(
      'https://test.supabase.co',
      'test-anon-key'
    )
  })

  it('throws when NEXT_PUBLIC_SUPABASE_URL is missing', () => {
    delete process.env.NEXT_PUBLIC_SUPABASE_URL
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key'

    expect(() => createSupabaseClient()).toThrow(
      'NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are required'
    )
  })

  it('throws when NEXT_PUBLIC_SUPABASE_ANON_KEY is missing', () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co'
    delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    expect(() => createSupabaseClient()).toThrow(
      'NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are required'
    )
  })

  it('throws when both env vars are missing', () => {
    delete process.env.NEXT_PUBLIC_SUPABASE_URL
    delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    expect(() => createSupabaseClient()).toThrow()
  })
})

describe('createSupabaseAdminClient', () => {
  const originalEnv = process.env

  beforeEach(() => {
    jest.resetAllMocks()
    createClient.mockReturnValue({ type: 'mock-supabase-client' })
    process.env = { ...originalEnv }
  })

  afterAll(() => {
    process.env = originalEnv
  })

  it('returns a SupabaseClient with admin options when env vars are present', () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co'
    process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service-role-key'

    const client = createSupabaseAdminClient()

    expect(client).toBeDefined()
    expect(createClient).toHaveBeenCalledWith(
      'https://test.supabase.co',
      'test-service-role-key',
      { auth: { autoRefreshToken: false, persistSession: false } }
    )
  })

  it('throws when NEXT_PUBLIC_SUPABASE_URL is missing', () => {
    delete process.env.NEXT_PUBLIC_SUPABASE_URL
    process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service-role-key'

    expect(() => createSupabaseAdminClient()).toThrow(
      'NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required'
    )
  })

  it('throws when SUPABASE_SERVICE_ROLE_KEY is missing', () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co'
    delete process.env.SUPABASE_SERVICE_ROLE_KEY

    expect(() => createSupabaseAdminClient()).toThrow(
      'NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required'
    )
  })

  it('disables session persistence (server-side only constraint)', () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co'
    process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service-role-key'

    createSupabaseAdminClient()

    const callArgs = createClient.mock.calls[0]
    expect(callArgs[2].auth.persistSession).toBe(false)
    expect(callArgs[2].auth.autoRefreshToken).toBe(false)
  })
})
