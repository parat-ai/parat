# OO Design Gate — tkt-mmwlfujf-9ee1i

**Approved:** OO-DESIGN-APPROVED
**Timestamp:** 2026-03-18T00:00:00Z

## Design Goal
Create 6 sequential Supabase/PostgreSQL migration files defining the full
Parat data model with FK integrity, CHECK constraints on all enum-like
text columns, indexes, and a shared updated_at trigger.

## Constraints
- Supabase (PostgreSQL) hosted in EU West (Dublin) — region is immutable
- Migration files must apply in order (001 → 006) without error
- Column names must exactly match snake_case TypeScript field names (ticket 4)
- No deviation from the column specs in the ticket instructions
- gen_random_uuid() for all PKs (requires pgcrypto / uuid-ossp or pg 13+)

## Existing Code to Reuse
- None — supabase/migrations/ does not yet exist

## Components
- 001_create_cases.sql: Root entity; defines set_updated_at() trigger function applied to all tables with updated_at; creates cases table + index on mock_user_id
- 002_create_insurance.sql: insurance table with FK → cases.id, unique index on case_id (one insurance per case)
- 003_create_claims.sql: claims table with FK → cases.id, index on case_id
- 004_create_threads.sql: threads table with FK → claims.id, index on claim_id
- 005_create_facts.sql: facts table with FK → threads.id, index on thread_id
- 006_create_sessions.sql: sessions table with FK → cases.id, index on case_id

## Interfaces
- set_updated_at(): PostgreSQL trigger function — sets NEW.updated_at = now() before each row update; defined once in 001, reused across all tables

## Dependencies
- 002 → 001 (insurance.case_id FK → cases.id)
- 003 → 001 (claims.case_id FK → cases.id)
- 004 → 003 (threads.claim_id FK → claims.id)
- 005 → 004 (facts.thread_id FK → threads.id)
- 006 → 001 (sessions.case_id FK → cases.id)

## Call Graph
- supabase db push → applies 001 → 002 → 003 → 004 → 005 → 006 in order
- Each table's UPDATE → set_updated_at() trigger → NEW.updated_at = now()

## Data Ownership
- cases: top-level aggregate root; all other entities reference it directly or transitively; ON DELETE CASCADE propagates to all dependents
- insurance: owned by cases (1:1, unique index enforces)
- claims: owned by cases (1:N)
- threads: owned by claims (1:N)
- facts: owned by threads (1:N)
- sessions: owned by cases (1:N)

## File/Class Layout
- supabase/migrations/001_create_cases.sql
- supabase/migrations/002_create_insurance.sql
- supabase/migrations/003_create_claims.sql
- supabase/migrations/004_create_threads.sql
- supabase/migrations/005_create_facts.sql
- supabase/migrations/006_create_sessions.sql
