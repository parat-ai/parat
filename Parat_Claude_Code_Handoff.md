# Parat — Claude Code Handoff
*Bring this file into Veriloom alongside the three supporting documents*

---

## What this is

This document is the starting point for building Parat inside Claude Code and Veriloom. It contains everything needed to plan the first sprint, scaffold the project, and build the MVP proof of concept.

## Supporting documents

Bring all four files into your Claude Code session:

| File | Purpose |
|---|---|
| `Parat_Product_Spec_v0.1.md` | Full product spec — data model, interview flow, architecture, tech stack, business model |
| `Parat_Brand_Spec_v0.1.md` | Brand spec — color system, typography, motion, iconography |
| `Parat_System_Prompts_v0.1.md` | Interviewer and reviewer system prompts — the core AI logic |
| `Parat_Claude_Code_Handoff.md` | This file — start here |

---

## The product in one sentence

Parat turns scattered documents, fragmented timelines, and unstructured facts into a structured, source-linked case brief that a lawyer can review immediately — before the first consultation.

---

## MVP definition

The MVP proves one thing: **a user can describe their legal situation conversationally, upload relevant documents, and receive a structured brief they could hand to a lawyer.**

Nothing else matters until this works well.

### MVP scope

**In:**
- Chat-first intake interface
- Interviewer + reviewer dual-model architecture
- Document upload (PDF, Word) with fact extraction
- Insurance track (Phase 1B interview)
- Case brief generation (exportable)
- Session continuity via session summaries
- Lovdata API integration for Norwegian statute lookup
- Norwegian and English language support

**Out:**
- Authentication (mock user for MVP)
- Payments and token billing
- Lawyer seat and data room sharing
- Lawyer marketplace
- Communications integrations
- Mobile app
- Additional case types beyond investor/founder disputes

---

## Tech stack decisions

All decided. Do not revisit for MVP.

```
Frontend:     Next.js + TypeScript
Backend:      Node.js + TypeScript
Database:     PostgreSQL via Supabase (EU West — Dublin)
Auth:         Better Auth (post-MVP — mock for now)
Payments:     Polar.sh (post-MVP — mock for now)
Storage:      Supabase Storage
Hosting:      Vercel (frontend) + Railway (backend)
AI:           Anthropic API (claude-sonnet-4-6)
Legal data:   Lovdata API (Norway)
```

---

## The abstraction principle

This is the most important architectural constraint. Mike's principle: **clean abstractions at every layer so modules can be replaced without touching application logic.**

Every external dependency sits behind an interface. The concrete implementation is swappable.

### Required interfaces — implement these first

```typescript
// AI layer
interface AIProvider {
  interview(context: CaseContext, message: string, history: Message[]): Promise<AIResponse>
  critique(context: CaseContext, userMessage: string, lastQuestion: string): Promise<ReviewerOutput>
  extract(document: Buffer, mimeType: string): Promise<ExtractedFact[]>
  summarise(content: string, language: string): Promise<string>
}

// Legal intelligence
interface LegalIntelligenceProvider {
  jurisdiction: string
  lookup(claimType: ClaimType, keywords: string[]): Promise<StatuteRef[]>
  summarise(ref: StatuteRef, language: string): Promise<string>
}

// Billing (mock for MVP)
interface BillingService {
  deductCredits(userId: string, amount: number): Promise<CreditBalance>
  getBalance(userId: string): Promise<CreditBalance>
}

// Storage
interface StorageProvider {
  upload(file: Buffer, path: string, mimeType: string): Promise<string>
  download(path: string): Promise<Buffer>
  getSignedUrl(path: string, expiresIn: number): Promise<string>
}

// Case type — new case type = new class, zero changes to framework
abstract class CaseType {
  abstract type: CaseTypeEnum
  abstract phase4Questions(): InterviewQuestion[]
  abstract documentTaxonomy(): DocumentClassifier[]
  abstract legalQueryConfig(): LegalQueryConfig
  abstract insuranceRelevant(): boolean
}

class InvestorDisputeCaseType extends CaseType {
  type = CaseTypeEnum.INVESTOR_DISPUTE
  insuranceRelevant() { return true }
  // ... implement abstract methods
}
```

---

## Data model — core entities

Full field definitions in `Parat_Product_Spec_v0.1.md` Section 4. Summary here for scaffolding:

```typescript
interface Case {
  id: string
  title: string
  type: CaseTypeEnum
  status: 'pre-legal' | 'active' | 'settled' | 'closed'
  jurisdiction: string
  plaintiff: Party
  defendant: Party
  exposureAmount: number
  currency: string
  summary: string
  openedAt: Date
  updatedAt: Date
}

interface Insurance {
  id: string
  caseId: string
  policyType: 'D&O' | 'professional_indemnity' | 'management_liability' | 'other'
  insurer?: string
  policyNumber?: string
  coveragePeriodFrom?: Date
  coveragePeriodTo?: Date
  notificationDeadline?: Date  // CRITICAL — flag if imminent
  notificationStatus: 'not-sent' | 'drafted' | 'sent' | 'acknowledged' | 'declined'
  coverageReviewStatus: 'not-assessed' | 'under-review' | 'possible-issues-flagged' | 'insurer-response-received' | 'declined'
  priorKnowledgeAttention: 'none-identified' | 'possible' | 'significant' | 'requires-immediate-legal-review'
  notificationDraft?: string
}

interface Claim {
  id: string
  caseId: string
  title: string
  allegation: string
  ourPosition?: string
  documentationStatus: 'well-supported' | 'partially-supported' | 'incomplete' | 'requires-review'
  amountSought?: number
  lovdataRefs: StatuteRef[]
  status: 'active' | 'withdrawn' | 'disputed' | 'resolved'
}

interface Thread {
  id: string
  claimId: string
  type: 'timeline' | 'evidence' | 'arguments' | 'open_questions'
  aiCritique?: string  // persists between sessions
  updatedAt: Date
}

interface Fact {
  id: string
  threadId: string
  statement: string
  sourceType: 'document' | 'email' | 'verbal' | 'public_record' | 'memory' | 'unknown'
  sourceRef?: string
  sourceDate?: Date
  verified: boolean
  addedBy: 'user' | 'ai_interview' | 'ai_inference'
  confidence: 'confirmed' | 'probable' | 'uncertain'
  notes?: string
  createdAt: Date
}

interface Session {
  id: string
  caseId: string
  startedAt: Date
  modelPrimary: string
  modelReviewer: string
  contextLoaded: string[]
  factsAdded: string[]
  factsUpdated: string[]
  critiqueOutput?: string
  summaryOfSession?: string  // generated at session end
}
```

---

## AI call sequence — implement exactly

Per user message:

```
1. User sends message
2. Build context block from DB (Case + Insurance + Claims + Threads + Facts + last 3 Sessions)
3. Call REVIEWER:
   - Input: context block + user message + last interviewer question
   - Output: ReviewerOutput JSON (see system prompt)
   - Parse output
4. Store new facts from reviewer.facts_to_store
5. Store new open questions from reviewer.open_questions_to_add
6. Update thread.ai_critique with reviewer.critique_summary
7. If any flag.severity === 'critical':
   - Prepend to interviewer prompt: "REVIEWER FLAG (critical): {flag.description}. Action: {flag.recommended_action}"
8. Call INTERVIEWER:
   - Input: context block + reviewer instructions + last 6 messages of conversation history only
   - Stream response to user
9. On session end:
   - Call reviewer one final time for session summary
   - Store summaryOfSession on Session
   - Update ai_critique on all active threads
```

**Token/cost control:** Only last 6 messages of raw conversation passed to interviewer. Everything older lives in the context block. This is mandatory — do not pass full history.

---

## The context block

Build this before every AI call. See `Parat_System_Prompts_v0.1.md` for the exact format. Key rule: **load only what is needed for the current session.** If working on Claim A, do not load Claim B's threads and facts.

---

## Lovdata integration

API is live and free. Norwegian legal corpus — statutes, regulations, case law.

Integration pattern:
```
1. Claim created with type = INVESTOR_DISPUTE and jurisdiction = Norway
2. LLM generates search query: "aksjeloven styreansvar insolvens" etc.
3. Query hits Lovdata API
4. API returns statute references and excerpts
5. LLM summarises in plain language in user's language
6. Store: citation string + summary only (not full text)
7. Render in brief as Section 8 with live link to lovdata.no source
```

Reach out to Lovdata for a partnership conversation before launch — they are government-owned, open to founders, and explicitly welcome commercial use. This is a priority pre-launch action.

---

## First sprint — suggested scope

**Goal:** working end-to-end proof of concept. User types, AI interviews, brief is generated.

### Sprint 1 tickets (suggested)

1. **Project scaffold** — Next.js + TypeScript, folder structure, environment config, Supabase connection
2. **Database schema** — create tables for Case, Insurance, Claim, Thread, Fact, Session
3. **Context block builder** — function that assembles the context object from DB for a given case
4. **AIProvider interface + AnthropicProvider implementation** — interviewer and reviewer calls wired up
5. **Chat UI** — simple, clean chat interface. User message → interviewer response. No auth, mock user.
6. **Reviewer integration** — reviewer runs after each user message, output parsed, facts stored
7. **Document upload** — PDF and Word upload, extraction via Claude vision, facts stored as ai_inference
8. **Session management** — session created on chat open, summary generated on session end
9. **Brief generation** — renders Case + Claims + Timeline + Evidence + Open Questions as a clean document
10. **Lovdata lookup** — triggered when Claim is created, statute refs stored and rendered in brief

### Definition of done for Sprint 1

A user can:
- Start a new investor dispute case
- Have a structured intake conversation with the AI
- Upload a PDF document and see facts extracted from it
- See a case brief generated from the conversation and documents
- See relevant Norwegian statutes in the brief

That is the MVP loop. Everything else is future work.

---

## What to hand Mike

If Mike reviews before development starts, the conversation is short:

1. Review the `CaseType` abstract class — agree on the pattern before Sprint 1
2. Review the `AIProvider` interface — confirm the call sequence
3. Review the database schema — confirm Supabase setup and EU region
4. Confirm Railway vs Fly.io for backend hosting

If Mike is not available, proceed with Sprint 1 using the interfaces as defined. Flag the `CaseType` and `AIProvider` patterns for his review before Sprint 2.

---

## Pre-launch actions (outside the build)

These happen in parallel with development:

- [ ] Register parat.ai
- [ ] Contact Lovdata — partnership conversation
- [ ] GDPR lawyer — draft DPA and terms of service
- [ ] Set up Polar.sh account — define product structure
- [ ] Set up Apple Developer account ($99/year) — required for Apple Sign In
- [ ] Pilot conversation with your girlfriend's firm — validate the brief output with a real lawyer

---

## Files to bring into this Claude Code session

```
Parat_Product_Spec_v0.1.md
Parat_Brand_Spec_v0.1.md
Parat_System_Prompts_v0.1.md
Parat_Claude_Code_Handoff.md   ← this file
```

Read all four before writing the first line of code.

---

*Parat — Claude Code Handoff v0.1 — March 2026*
