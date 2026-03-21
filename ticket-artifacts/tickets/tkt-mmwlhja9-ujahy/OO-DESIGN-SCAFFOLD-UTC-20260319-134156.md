# OO Design Gate — tkt-mmwlhja9-ujahy (v2, approved)

**Approved:** OO-DESIGN-APPROVED
**Timestamp:** 2026-03-19T13:41:56Z

## Design Goal
Implement the reviewer system prompt and its JSON output parser. The module
owns prompt building and raw-output parsing. The parser is a pure function:
strip fences → parse JSON → normalize snake_case to camelCase → validate
shape → return typed ReviewerOutput or throw ReviewerParseError. Callers
own logging — the parser throws, callers catch and log.

## Constraints
- parseReviewerOutput(raw: string): ReviewerOutput — no logger parameter; caller (AnthropicProvider.critique) catches ReviewerParseError and logs
- Pure functions throughout — no module-level state, no console.*
- snake_case JSON from the model is normalized to camelCase before validation (explicit mapping rule — see OutputNormalizer below)
- ReviewerParseError carries rawOutput field (string) for caller to log
- Spec example output must appear as a verbatim block comment in the source (documents the exact JSON contract the parser implements)
- All type imports from src/lib/ai/interfaces.ts (ticket 4 prerequisite)

## Existing Code to Reuse
- src/lib/ai/interfaces.ts (ticket 4 prerequisite): ReviewerOutput, ReviewerFlag, FactToStore, ILogger (imported by callers)

## Components
- PromptBuilder: buildReviewerSystemPrompt — pure function, returns the complete reviewer system prompt string including: role definition, JSON output schema, all detection rules (admission_risk, inconsistency, deadline_risk, coverage_risk, gap, prior_knowledge_risk), severity guide, prior knowledge examples, admission risk examples, what the reviewer never does
- FenceStripper: stripMarkdownFences — internal, removes ```json ... ``` or ``` ... ``` wrappers from raw model output before JSON.parse
- OutputNormalizer: normalizeReviewerOutput — internal, maps model's snake_case keys to camelCase ReviewerOutput fields. Explicit key mapping:
  - follow_up_required → followUpRequired
  - follow_up_reason → followUpReason
  - suggested_probe → suggestedProbe
  - facts_to_store → factsToStore
  - phase_complete → phaseComplete
  - phase_complete_reason → phaseCompleteReason
  - open_questions_to_add → openQuestionsToAdd
  - critique_summary → critiqueSummary
  - recommended_action → recommendedAction (inside each flag)
  - Nested arrays (factsToStore, flags) are mapped recursively.
- OutputValidator: validateReviewerOutput — internal, confirms normalized object satisfies ReviewerOutput shape; checks required fields present and severity/confidence enum values are within allowed sets; throws ReviewerParseError if invalid
- OutputParser: parseReviewerOutput — exported, orchestrates: stripMarkdownFences → JSON.parse → normalizeReviewerOutput → validateReviewerOutput → return ReviewerOutput. Throws ReviewerParseError on any failure in the chain
- ReviewerParseError: exported class, extends Error, adds rawOutput: string

## Interfaces
// Exported:
class ReviewerParseError extends Error {
  rawOutput: string
  constructor(message: string, rawOutput: string)
}

interface ReviewerPromptOptions {
  language: 'no' | 'en'
}

function buildReviewerSystemPrompt(options: ReviewerPromptOptions): string

function parseReviewerOutput(raw: string): ReviewerOutput
// throws ReviewerParseError

// Internal (not exported):
function stripMarkdownFences(raw: string): string
function normalizeReviewerOutput(parsed: unknown): Record<string, unknown>
function validateReviewerOutput(normalized: unknown): ReviewerOutput
const REVIEWER_PROMPT_TEMPLATE: string
// EXAMPLE_OUTPUT_COMMENT: verbatim spec example as block comment in source

## Dependencies
- src/lib/ai/prompts/reviewer.ts → src/lib/ai/interfaces.ts (imports ReviewerOutput, ReviewerFlag, FactToStore)
- src/lib/ai/providers/anthropic.ts (ticket 7) → reviewer.ts (consumes buildReviewerSystemPrompt, parseReviewerOutput, catches ReviewerParseError and logs via its ILogger)
- src/app/api/chat/route.ts (ticket 12b) → reviewer.ts (consumes parseReviewerOutput, catches ReviewerParseError)

## Call Graph
- AnthropicProvider.critique() → buildReviewerSystemPrompt(options) → returns prompt string
- AnthropicProvider.critique() → parseReviewerOutput(raw)
- parseReviewerOutput(raw) → stripMarkdownFences(raw)
- parseReviewerOutput(raw) → JSON.parse(cleaned)
- parseReviewerOutput(raw) → normalizeReviewerOutput(parsed)
- parseReviewerOutput(raw) → validateReviewerOutput(normalized)
- parseReviewerOutput(raw) → returns ReviewerOutput | throws ReviewerParseError
- AnthropicProvider.critique() → catch(ReviewerParseError) → logger.error(...) → return safe default

## Data Ownership
- REVIEWER_PROMPT_TEMPLATE: module-level constant, immutable
- ReviewerOutput value: owned by caller after parseReviewerOutput returns
- rawOutput in ReviewerParseError: owned by the error instance

## File/Class Layout
- src/lib/ai/prompts/reviewer.ts
  - exports: ReviewerParseError, ReviewerPromptOptions, buildReviewerSystemPrompt, parseReviewerOutput
  - internal: REVIEWER_PROMPT_TEMPLATE, stripMarkdownFences, normalizeReviewerOutput, validateReviewerOutput
  - required comment: verbatim block comment containing the full example JSON output from Parat_System_Prompts_v0.1.md (the complete object beginning at "follow_up_required": true), positioned immediately before the parseReviewerOutput function to document the wire format
