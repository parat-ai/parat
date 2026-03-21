# OO Design Gate — tkt-mmwlgg1a-1fi6g (v3, approved)

## Design Goal
Define all TypeScript interfaces, union types, and shared entity types.
Exact signatures per handoff doc. ReadableStream<Uint8Array> eliminates
generic any. Insurance-track facts persist to case-level Thread rows
(schema backed by amendment ticket tkt-mmx72te6-d23ho).

## Constraints
- No `any` types (including generic defaults)
- All union types exhaustive
- Method signatures match handoff doc exactly
- npx tsc --noEmit must exit 0

## Schema Extension (backed by tkt-mmx72te6-d23ho)
Thread.claim_id nullable, Thread.case_id added, CHECK exactly one set,
ThreadType gains 'insurance'. All existing rows remain valid.

## Components
- EntityTypes: persisted entity interfaces and union types
- AIProviderContract: AIProvider with exact handoff signatures
- LegalIntelligenceContract: LegalIntelligenceProvider with ClaimType
- StorageContract: StorageProvider with exact handoff signatures
- LoggerContract: ILogger

## Interfaces

### src/types/index.ts
ThreadType = 'timeline' | 'evidence' | 'arguments' | 'open_questions' | 'insurance'
Thread { claimId: string | null; caseId: string | null; ... }
  // invariant: exactly one non-null — enforced by DB CHECK + repo layer
Case, Insurance, Claim, Fact, Session, StatuteRef, Party, Message
All other union types per DB schema

### src/lib/ai/interfaces.ts
FactToStore { statement, source, confidence, thread: ThreadType, note }
ExtractedFact { statement, sourceType, sourceRef?, sourceDate?, confidence, thread: ThreadType, note? }
ReviewerOutput { followUpRequired, followUpReason, suggestedProbe,
  factsToStore: FactToStore[], flags: ReviewerFlag[], phaseComplete,
  phaseCompleteReason, openQuestionsToAdd, critiqueSummary }
CaseContext { case, insurance, claims, threads, facts, sessionSummaries, lastCritique }
type AIResponse = ReadableStream<Uint8Array>
AIProvider:
  interview(context, message, history): Promise<AIResponse>
  critique(context, userMessage, lastQuestion): Promise<ReviewerOutput>
  extract(document: Buffer, mimeType: string): Promise<ExtractedFact[]>
  summarise(content: string, language: string): Promise<string>
ILogger { info, debug, warn, error }

### src/lib/legal/interfaces.ts
type ClaimType = CaseTypeEnum  // alias — same values, distinct semantics
LegalIntelligenceProvider:
  jurisdiction: string
  lookup(claimType: ClaimType, keywords: string[]): Promise<StatuteRef[]>
  summarise(ref: StatuteRef, language: string): Promise<string>

### src/lib/storage/interfaces.ts
StorageProvider:
  upload(file: Buffer, path: string, mimeType: string): Promise<string>
  download(path: string): Promise<Buffer>
  getSignedUrl(path: string, expiresIn: number): Promise<string>

## Dependencies
- src/types/index.ts → (no imports)
- src/lib/ai/interfaces.ts → src/types/index.ts
- src/lib/legal/interfaces.ts → src/types/index.ts
- src/lib/storage/interfaces.ts → (no imports)

## Data Ownership
- All value types — no runtime ownership
- CaseContext assembled by context/builder.ts, passed by value to AI calls
- Thread FK invariant enforced by DB CHECK (tkt-mmx72te6-d23ho) and repos

## File/Class Layout
- src/types/index.ts
- src/lib/ai/interfaces.ts
- src/lib/legal/interfaces.ts
- src/lib/storage/interfaces.ts
