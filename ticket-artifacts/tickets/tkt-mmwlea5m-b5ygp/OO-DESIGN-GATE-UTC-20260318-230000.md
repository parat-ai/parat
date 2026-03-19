# OO Design Gate — tkt-mmwlea5m-b5ygp
# Approved: OO-DESIGN-APPROVED
# Timestamp: 2026-03-18T23:00:00Z

Design Goal:
  Establish the project skeleton — config, folder structure, root layout,
  stub page, and Supabase client module — so all future feature tickets
  have stable import paths and a passing build.

Constraints:
  - Only src/lib/db/client.ts may instantiate SupabaseClient
  - TypeScript strict mode must not be relaxed
  - No custom Tailwind theme values (CSS custom properties only)
  - npx next build must exit 0

Existing Code to Reuse:
  None — green-field project directory

Components:
  - SupabaseClientFactory: Creates and returns typed SupabaseClient instances;
      one factory function for public (anon key) and one for admin (service role)
  - RootLayout: Next.js App Router root layout; loads fonts, imports globals.css
  - StubPage: Temporary landing page confirming the app runs

Interfaces:
  - createSupabaseClient(): SupabaseClient
      Reads NEXT_PUBLIC_SUPABASE_URL + NEXT_PUBLIC_SUPABASE_ANON_KEY from env
  - createSupabaseAdminClient(): SupabaseClient
      Reads NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY from env
      Server-side only — must never be called from client components

Dependencies:
  - src/app/* -> src/lib/db/client.ts (DB access goes through client module only)
  - src/app/* -> src/styles/globals.css (via layout.tsx import)
  - All future lib files -> @/lib/db/client (enforced by architecture)

Call Graph:
  - RootLayout -> globals.css (import)
  - Future API routes -> createSupabaseClient() or createSupabaseAdminClient()
  - createSupabaseAdminClient() -> SUPABASE_SERVICE_ROLE_KEY (server env only)

Data Ownership:
  - SupabaseClient instance owned by call site (new instance per call)
  - Env vars owned by process.env / Next.js runtime

File/Class Layout:
  - src/lib/db/client.ts: createSupabaseClient(), createSupabaseAdminClient()
  - src/app/layout.tsx: RootLayout (default export, RSC)
  - src/app/page.tsx: StubPage (default export, RSC)
  - src/styles/globals.css: Tailwind directives only
  - src/app/(app)/cases/new/: (empty .gitkeep placeholder)
  - src/app/(app)/cases/[id]/brief/: (empty .gitkeep placeholder)
  - src/app/api/{chat,cases,documents,brief/[caseId]}/: (empty .gitkeep)
  - src/components/{layout,chat,brief,upload}/: (empty .gitkeep)
  - src/lib/{ai/providers,ai/prompts,db/repositories,context,legal/providers,storage}/: (empty .gitkeep)
  - src/types/: (empty .gitkeep)
  - supabase/migrations/: (empty .gitkeep)
