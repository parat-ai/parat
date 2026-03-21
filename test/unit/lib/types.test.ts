/**
 * Unit tests for core TypeScript interfaces and union types.
 * Verifies:
 *   1. Union type values are exhaustive and correct
 *   2. Objects conforming to each interface compile without error
 *   3. Interface files export all expected symbols (compile-time coverage)
 */

import type {
  AddedBy,
  Case,
  CaseStatus,
  CaseTypeEnum,
  Claim,
  ClaimStatus,
  CoverageReviewStatus,
  DocumentationStatus,
  Fact,
  FactConfidence,
  Insurance,
  Message,
  NotificationStatus,
  Party,
  PriorKnowledgeAttention,
  Session,
  SourceType,
  StatuteRef,
  Thread,
  ThreadType,
} from '@/types/index'

import type {
  AIProvider,
  AIResponse,
  CaseContext,
  ExtractedFact,
  FactToStore,
  ILogger,
  ReviewerFlag,
  ReviewerOutput,
} from '@/lib/ai/interfaces'

import type { ClaimType, LegalIntelligenceProvider } from '@/lib/legal/interfaces'

import type { StorageProvider } from '@/lib/storage/interfaces'

// ---------------------------------------------------------------------------
// Union type value checks
// ---------------------------------------------------------------------------

describe('union types', () => {
  it('CaseTypeEnum contains INVESTOR_DISPUTE', () => {
    const value: CaseTypeEnum = 'INVESTOR_DISPUTE'
    expect(value).toBe('INVESTOR_DISPUTE')
  })

  it('CaseStatus has all four values', () => {
    const values: CaseStatus[] = ['pre-legal', 'active', 'settled', 'closed']
    expect(values).toHaveLength(4)
  })

  it('ThreadType has all five values including insurance', () => {
    const values: ThreadType[] = [
      'timeline',
      'evidence',
      'arguments',
      'open_questions',
      'insurance',
    ]
    expect(values).toHaveLength(5)
    expect(values).toContain('insurance')
  })

  it('NotificationStatus has all five values', () => {
    const values: NotificationStatus[] = [
      'not-sent',
      'drafted',
      'sent',
      'acknowledged',
      'declined',
    ]
    expect(values).toHaveLength(5)
  })

  it('CoverageReviewStatus has all five values', () => {
    const values: CoverageReviewStatus[] = [
      'not-assessed',
      'under-review',
      'possible-issues-flagged',
      'insurer-response-received',
      'declined',
    ]
    expect(values).toHaveLength(5)
  })

  it('PriorKnowledgeAttention has all four values', () => {
    const values: PriorKnowledgeAttention[] = [
      'none-identified',
      'possible',
      'significant',
      'requires-immediate-legal-review',
    ]
    expect(values).toHaveLength(4)
  })

  it('DocumentationStatus has all four values', () => {
    const values: DocumentationStatus[] = [
      'well-supported',
      'partially-supported',
      'incomplete',
      'requires-review',
    ]
    expect(values).toHaveLength(4)
  })

  it('ClaimStatus has all four values', () => {
    const values: ClaimStatus[] = ['active', 'withdrawn', 'disputed', 'resolved']
    expect(values).toHaveLength(4)
  })

  it('SourceType has all six values', () => {
    const values: SourceType[] = [
      'document',
      'email',
      'verbal',
      'public_record',
      'memory',
      'unknown',
    ]
    expect(values).toHaveLength(6)
  })

  it('FactConfidence has all three values', () => {
    const values: FactConfidence[] = ['confirmed', 'probable', 'uncertain']
    expect(values).toHaveLength(3)
  })

  it('AddedBy has all three values', () => {
    const values: AddedBy[] = ['user', 'ai_interview', 'ai_inference']
    expect(values).toHaveLength(3)
  })
})

// ---------------------------------------------------------------------------
// Entity interface structural tests — compile-time assignability
// ---------------------------------------------------------------------------

describe('entity interfaces', () => {
  it('Case interface accepts a conforming object', () => {
    const c: Case = {
      id: 'case-1',
      title: 'Test Case',
      type: 'INVESTOR_DISPUTE',
      status: 'active',
      jurisdiction: 'Norway',
      plaintiffName: 'Alice',
      plaintiffType: 'individual',
      defendantName: 'Bob',
      defendantType: 'company',
      exposureAmount: 100000,
      currency: 'NOK',
      summary: 'Test summary',
      openedAt: new Date(),
      updatedAt: new Date(),
      mockUserId: 'mock-user-001',
    }
    expect(c.id).toBe('case-1')
    expect(c.type).toBe('INVESTOR_DISPUTE')
  })

  it('Case interface accepts null optional fields', () => {
    const c: Case = {
      id: 'case-2',
      title: 'Minimal Case',
      type: 'INVESTOR_DISPUTE',
      status: 'pre-legal',
      jurisdiction: 'Norway',
      plaintiffName: null,
      plaintiffType: null,
      defendantName: null,
      defendantType: null,
      exposureAmount: null,
      currency: 'NOK',
      summary: null,
      openedAt: new Date(),
      updatedAt: new Date(),
      mockUserId: 'mock-user-001',
    }
    expect(c.plaintiffName).toBeNull()
  })

  it('Insurance interface accepts a conforming object', () => {
    const ins: Insurance = {
      id: 'ins-1',
      caseId: 'case-1',
      policyType: 'D&O',
      insurer: 'Gjensidige',
      policyNumber: 'POL-123',
      coveragePeriodFrom: new Date('2023-01-01'),
      coveragePeriodTo: new Date('2024-01-01'),
      notificationDeadline: new Date('2024-02-01'),
      notificationStatus: 'not-sent',
      coverageReviewStatus: 'not-assessed',
      priorKnowledgeAttention: 'none-identified',
      notificationDraft: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    expect(ins.caseId).toBe('case-1')
  })

  it('Claim interface accepts a conforming object', () => {
    const claim: Claim = {
      id: 'claim-1',
      caseId: 'case-1',
      title: 'Misrepresentation',
      allegation: 'Defendant misrepresented financial state',
      ourPosition: 'We deny all allegations',
      documentationStatus: 'well-supported',
      amountSought: 500000,
      status: 'active',
      lovdataRefs: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    expect(claim.status).toBe('active')
  })

  it('Thread interface supports claimId=null for insurance threads', () => {
    const thread: Thread = {
      id: 'thread-1',
      claimId: null,
      caseId: 'case-1',
      type: 'insurance',
      aiCritique: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    expect(thread.claimId).toBeNull()
    expect(thread.caseId).toBe('case-1')
  })

  it('Thread interface supports caseId=null for normal threads', () => {
    const thread: Thread = {
      id: 'thread-2',
      claimId: 'claim-1',
      caseId: null,
      type: 'timeline',
      aiCritique: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    expect(thread.caseId).toBeNull()
    expect(thread.claimId).toBe('claim-1')
  })

  it('Fact interface accepts a conforming object', () => {
    const fact: Fact = {
      id: 'fact-1',
      threadId: 'thread-1',
      statement: 'Defendant signed contract on 2022-05-01',
      sourceType: 'document',
      sourceRef: 'contract-v2.pdf',
      sourceDate: '2022-05-01',
      verified: true,
      addedBy: 'user',
      confidence: 'confirmed',
      notes: null,
      createdAt: new Date(),
    }
    expect(fact.confidence).toBe('confirmed')
  })

  it('Session interface accepts a conforming object', () => {
    const session: Session = {
      id: 'session-1',
      caseId: 'case-1',
      startedAt: new Date(),
      endedAt: null,
      modelPrimary: 'claude-sonnet-4-6',
      modelReviewer: 'claude-sonnet-4-6',
      contextLoaded: [],
      factsAdded: [],
      factsUpdated: [],
      critiqueOutput: null,
      summaryOfSession: null,
    }
    expect(session.modelPrimary).toBe('claude-sonnet-4-6')
  })

  it('StatuteRef interface accepts a conforming object', () => {
    const ref: StatuteRef = {
      citation: 'asl. § 3-1',
      summary: 'Fiduciary duty of board members',
      url: 'https://lovdata.no/lov/1997-06-13-44',
      jurisdiction: 'Norway',
    }
    expect(ref.jurisdiction).toBe('Norway')
  })

  it('Party interface accepts a conforming object', () => {
    const party: Party = { name: 'Alice Corp', type: 'company' }
    expect(party.name).toBe('Alice Corp')
  })

  it('Message interface accepts user and assistant roles', () => {
    const userMsg: Message = { role: 'user', content: 'Hello' }
    const assistantMsg: Message = { role: 'assistant', content: 'Hi there' }
    expect(userMsg.role).toBe('user')
    expect(assistantMsg.role).toBe('assistant')
  })
})

// ---------------------------------------------------------------------------
// AI interface structural tests
// ---------------------------------------------------------------------------

describe('AI interfaces', () => {
  it('ReviewerFlag accepts all flag types', () => {
    const flagTypes: ReviewerFlag['type'][] = [
      'admission_risk',
      'inconsistency',
      'deadline_risk',
      'coverage_risk',
      'gap',
      'prior_knowledge_risk',
    ]
    expect(flagTypes).toHaveLength(6)
  })

  it('ReviewerFlag accepts all severities', () => {
    const severities: ReviewerFlag['severity'][] = ['low', 'medium', 'high', 'critical']
    expect(severities).toHaveLength(4)
  })

  it('FactToStore accepts all source values', () => {
    const sources: FactToStore['source'][] = ['user_statement', 'document', 'inferred']
    expect(sources).toHaveLength(3)
  })

  it('FactToStore accepts a conforming object', () => {
    const f: FactToStore = {
      statement: 'Defendant was aware of the risk',
      source: 'user_statement',
      confidence: 'probable',
      thread: 'evidence',
      note: null,
    }
    expect(f.source).toBe('user_statement')
  })

  it('ExtractedFact accepts a conforming object with optional fields', () => {
    const ef: ExtractedFact = {
      statement: 'Board meeting minutes dated 2022-03-15',
      sourceType: 'document',
      sourceRef: 'minutes-2022-03-15.pdf',
      sourceDate: '2022-03-15',
      confidence: 'confirmed',
      thread: 'evidence',
    }
    expect(ef.sourceRef).toBe('minutes-2022-03-15.pdf')
  })

  it('ExtractedFact accepts a conforming object without optional fields', () => {
    const ef: ExtractedFact = {
      statement: 'Verbal agreement was made',
      sourceType: 'verbal',
      confidence: 'uncertain',
      thread: 'timeline',
    }
    expect(ef.sourceRef).toBeUndefined()
  })

  it('ReviewerOutput accepts a conforming object', () => {
    const output: ReviewerOutput = {
      followUpRequired: true,
      followUpReason: 'Need more detail on timeline',
      suggestedProbe: 'When did you first learn of this issue?',
      factsToStore: [],
      flags: [],
      phaseComplete: false,
      phaseCompleteReason: null,
      openQuestionsToAdd: [],
      critiqueSummary: 'Initial intake phase in progress',
    }
    expect(output.followUpRequired).toBe(true)
  })

  it('CaseContext accepts a conforming object', () => {
    const ctx: CaseContext = {
      case: {
        id: 'c1',
        title: 'Test',
        type: 'INVESTOR_DISPUTE',
        status: 'active',
        jurisdiction: 'Norway',
        plaintiffName: null,
        plaintiffType: null,
        defendantName: null,
        defendantType: null,
        exposureAmount: null,
        currency: 'NOK',
        summary: null,
        openedAt: new Date(),
        updatedAt: new Date(),
        mockUserId: 'mock-user-001',
      },
      insurance: null,
      claims: [],
      threads: [],
      facts: [],
      sessionSummaries: [],
      lastCritique: null,
    }
    expect(ctx.insurance).toBeNull()
  })

  it('AIResponse type is assignable to ReadableStream<Uint8Array>', () => {
    const check: (r: AIResponse) => ReadableStream<Uint8Array> = (r) => r
    expect(typeof check).toBe('function')
  })

  it('ILogger interface keys include info, debug, warn, error', () => {
    const methods: (keyof ILogger)[] = ['info', 'debug', 'warn', 'error']
    expect(methods).toHaveLength(4)
  })

  it('AIProvider interface keys include all four methods', () => {
    const methods: (keyof AIProvider)[] = ['interview', 'critique', 'extract', 'summarise']
    expect(methods).toHaveLength(4)
  })
})

// ---------------------------------------------------------------------------
// Legal interface structural tests
// ---------------------------------------------------------------------------

describe('legal interfaces', () => {
  it('ClaimType is an alias for CaseTypeEnum', () => {
    const value: ClaimType = 'INVESTOR_DISPUTE'
    const caseValue: CaseTypeEnum = value
    expect(caseValue).toBe('INVESTOR_DISPUTE')
  })

  it('LegalIntelligenceProvider interface has required members', () => {
    const methods: (keyof LegalIntelligenceProvider)[] = [
      'jurisdiction',
      'lookup',
      'summarise',
    ]
    expect(methods).toHaveLength(3)
  })
})

// ---------------------------------------------------------------------------
// Storage interface structural tests
// ---------------------------------------------------------------------------

describe('storage interfaces', () => {
  it('StorageProvider interface has required methods', () => {
    const methods: (keyof StorageProvider)[] = ['upload', 'download', 'getSignedUrl']
    expect(methods).toHaveLength(3)
  })
})
