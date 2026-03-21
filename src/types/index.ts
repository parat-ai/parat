// Union types — match DB schema CHECK constraints exactly

export type CaseTypeEnum = 'INVESTOR_DISPUTE'

export type CaseStatus = 'pre-legal' | 'active' | 'settled' | 'closed'

export type ThreadType =
  | 'timeline'
  | 'evidence'
  | 'arguments'
  | 'open_questions'
  | 'insurance'
// 'insurance' threads: caseId set, claimId null (see Thread interface)

export type NotificationStatus =
  | 'not-sent'
  | 'drafted'
  | 'sent'
  | 'acknowledged'
  | 'declined'

export type CoverageReviewStatus =
  | 'not-assessed'
  | 'under-review'
  | 'possible-issues-flagged'
  | 'insurer-response-received'
  | 'declined'

export type PriorKnowledgeAttention =
  | 'none-identified'
  | 'possible'
  | 'significant'
  | 'requires-immediate-legal-review'

export type DocumentationStatus =
  | 'well-supported'
  | 'partially-supported'
  | 'incomplete'
  | 'requires-review'

export type ClaimStatus = 'active' | 'withdrawn' | 'disputed' | 'resolved'

export type SourceType =
  | 'document'
  | 'email'
  | 'verbal'
  | 'public_record'
  | 'memory'
  | 'unknown'

export type FactConfidence = 'confirmed' | 'probable' | 'uncertain'

export type AddedBy = 'user' | 'ai_interview' | 'ai_inference'

// Entity interfaces — all fields camelCase

export interface Case {
  id: string
  title: string
  type: CaseTypeEnum
  status: CaseStatus
  jurisdiction: string
  plaintiffName: string | null
  plaintiffType: string | null
  defendantName: string | null
  defendantType: string | null
  exposureAmount: number | null
  currency: string
  summary: string | null
  openedAt: Date
  updatedAt: Date
  mockUserId: string
}

export interface Insurance {
  id: string
  caseId: string
  policyType: 'D&O' | 'professional_indemnity' | 'management_liability' | 'other' | null
  insurer: string | null
  policyNumber: string | null
  coveragePeriodFrom: Date | null
  coveragePeriodTo: Date | null
  notificationDeadline: Date | null
  notificationStatus: NotificationStatus
  coverageReviewStatus: CoverageReviewStatus
  priorKnowledgeAttention: PriorKnowledgeAttention
  notificationDraft: string | null
  createdAt: Date
  updatedAt: Date
}

export interface Claim {
  id: string
  caseId: string
  title: string
  allegation: string
  ourPosition: string | null
  documentationStatus: DocumentationStatus
  amountSought: number | null
  status: ClaimStatus
  lovdataRefs: StatuteRef[]
  createdAt: Date
  updatedAt: Date
}

export interface Thread {
  id: string
  claimId: string | null // null when type === 'insurance'
  caseId: string | null  // non-null only when type === 'insurance'
  type: ThreadType
  aiCritique: string | null
  createdAt: Date
  updatedAt: Date
  // Invariant: exactly one of (claimId, caseId) is non-null — enforced by DB CHECK constraint
}

export interface Fact {
  id: string
  threadId: string
  statement: string
  sourceType: SourceType
  sourceRef: string | null
  sourceDate: string | null
  verified: boolean
  addedBy: AddedBy
  confidence: FactConfidence
  notes: string | null
  createdAt: Date
}

export interface Session {
  id: string
  caseId: string
  startedAt: Date
  endedAt: Date | null
  modelPrimary: string
  modelReviewer: string
  contextLoaded: string[]
  factsAdded: string[]
  factsUpdated: string[]
  critiqueOutput: string | null
  summaryOfSession: string | null
}

export interface StatuteRef {
  citation: string
  summary: string
  url: string
  jurisdiction: string
}

export interface Party {
  name: string
  type: string
}

export interface Message {
  role: 'user' | 'assistant'
  content: string
}
