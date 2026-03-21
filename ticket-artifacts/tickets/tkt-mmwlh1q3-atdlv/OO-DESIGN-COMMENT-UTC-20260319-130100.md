OO-DESIGN-APPROVED:

OO Design Scaffold — tkt-mmwlh1q3-atdlv (v2)

Design Goal:
  Implement the interviewer system prompt as a typed TypeScript module with
  a pure builder function. The prompt is phase-aware and conditionally injects
  reviewer flag instructions. The module is the sole owner of all interviewer
  prompt content, phase definitions, and the InterviewPhase type.
  No AI calls happen here; this module only produces strings.

Constraints:
  - Pure functions only — no classes, no state, no side effects
  - No imports from any project module — fully self-contained
  - buildInterviewerSystemPrompt must be a pure function (same inputs → same output)
  - Reviewer flag injection is additive only — never replaces phase content
  - Norwegian language instruction appended when language === 'no', never embedded
    in individual phase strings (keeps phases language-neutral)

Existing Code to Reuse:
  None — self-contained module, no project dependencies

Components:
  - PhaseRegistry: constant Record<InterviewPhase, string> — maps each of the
      8 phases to its instruction block (goal, question list, completion criteria,
      handoff instruction) per Parat_System_Prompts_v0.1.md:
      orientation, insurance, timeline, parties, claims, position, evidence, exposure
  - PersonaBlock: constant string — interviewer persona, behavioural rules,
      what the interviewer never says, output format for fact storage
  - LanguageBlock: pure function — returns Norwegian instruction when
      language === 'no', empty string when language === 'en'
  - ReviewerInjectionBlock: pure function — returns formatted REVIEWER FLAG
      prefix when reviewerInstructions is provided, empty string otherwise
  - PromptAssembler: buildInterviewerSystemPrompt — assembles final prompt
      from PersonaBlock + ReviewerInjectionBlock + PhaseRegistry[phase] + LanguageBlock

Interfaces:
  // Defined and exported from this module — owned here
  type InterviewPhase =
    | 'orientation'
    | 'insurance'
    | 'timeline'
    | 'parties'
    | 'claims'
    | 'position'
    | 'evidence'
    | 'exposure'

  interface InterviewerPromptOptions {
    language: 'no' | 'en'
    currentPhase: InterviewPhase
    reviewerInstructions?: string
  }

  function buildInterviewerSystemPrompt(
    options: InterviewerPromptOptions
  ): string

  // Internal (not exported):
  function buildLanguageBlock(language: 'no' | 'en'): string
  function buildReviewerInjection(instructions?: string): string
  const PHASE_BLOCKS: Record<InterviewPhase, string>  // all 8 phases
  const PERSONA_BLOCK: string

Dependencies:
  - src/lib/ai/prompts/interviewer.ts → (no project imports)
  - src/lib/ai/providers/anthropic.ts (ticket 7) → interviewer.ts

Call Graph:
  AnthropicProvider.interview() → buildInterviewerSystemPrompt(options)
    → buildReviewerInjection(options.reviewerInstructions)
    → PHASE_BLOCKS[options.currentPhase]  // one of 8 entries
    → buildLanguageBlock(options.language)
    → returns assembled string

Data Ownership:
  - InterviewPhase type: owned and exported by this module
  - PERSONA_BLOCK, PHASE_BLOCKS: module-level constants, immutable
  - Assembled prompt string: owned by caller (AnthropicProvider), not cached

File/Class Layout:
  - src/lib/ai/prompts/interviewer.ts
      exports: InterviewPhase, InterviewerPromptOptions, buildInterviewerSystemPrompt
      internal: PERSONA_BLOCK, PHASE_BLOCKS (8 entries), buildLanguageBlock,
                buildReviewerInjection
