import type {
  Case,
  Claim,
  Fact,
  FactConfidence,
  Insurance,
  Message,
  SourceType,
  Thread,
  ThreadType,
} from '@/types/index'

export interface ReviewerFlag {
  type:
    | 'admission_risk'
    | 'inconsistency'
    | 'deadline_risk'
    | 'coverage_risk'
    | 'gap'
    | 'prior_knowledge_risk'
  severity: 'low' | 'medium' | 'high' | 'critical'
  description: string
  recommendedAction: string
}

export interface FactToStore {
  statement: string
  source: 'user_statement' | 'document' | 'inferred'
  confidence: FactConfidence
  thread: ThreadType // 'insurance' routes to case-level insurance thread
  note: string | null
}

export interface ExtractedFact {
  statement: string
  sourceType: SourceType
  sourceRef?: string
  sourceDate?: string
  confidence: FactConfidence
  thread: ThreadType
  note?: string
}
// ExtractedFact is returned by AIProvider.extract() — distinct from FactToStore.
// It carries document metadata (sourceRef, sourceDate) not present in reviewer output.
// Mapped to Fact at storage time in ticket 17.

export interface ReviewerOutput {
  followUpRequired: boolean
  followUpReason: string
  suggestedProbe: string
  factsToStore: FactToStore[]
  flags: ReviewerFlag[]
  phaseComplete: boolean
  phaseCompleteReason: string | null
  openQuestionsToAdd: string[]
  critiqueSummary: string
}

export interface CaseContext {
  case: Case
  insurance: Insurance | null
  claims: Claim[]
  threads: Thread[]
  facts: Fact[]
  sessionSummaries: string[]
  lastCritique: string | null
}

// AIResponse: concrete generic eliminates ReadableStream<any> default.
// Uint8Array is the correct chunk type for Next.js SSE streaming.
export type AIResponse = ReadableStream<Uint8Array>

export interface AIProvider {
  interview(context: CaseContext, message: string, history: Message[]): Promise<AIResponse>
  critique(context: CaseContext, userMessage: string, lastQuestion: string): Promise<ReviewerOutput>
  extract(document: Buffer, mimeType: string): Promise<ExtractedFact[]>
  summarise(content: string, language: string): Promise<string>
}

export interface ILogger {
  info(message: string, data?: Record<string, unknown>): void
  debug(message: string, data?: Record<string, unknown>): void
  warn(message: string, data?: Record<string, unknown>): void
  error(message: string, error?: Error, data?: Record<string, unknown>): void
}
