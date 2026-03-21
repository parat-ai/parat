# Parat
### Product Specification v0.1 — Working draft — March 2026

*Case preparation for people who need a lawyer — not yet a lawyer*

| | |
|---|---|
| Version | 0.1 — Working draft |
| Date | March 2026 |
| Status | Concept / pre-build |

> **Name note:** "Parat" is the working title. It is internationally understood, legally connoted, and needs no translation. Alternatives considered: Precis, Primer, Briefd. Confirm before domain registration.
---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Problem Statement](#2-problem-statement)
3. [Product Architecture](#3-product-architecture)
4. [Data Model](#4-data-model)
5. [Interview Flow](#5-interview-flow)
6. [Document Processing](#6-document-processing)
7. [The Lawyer Brief](#7-the-lawyer-brief)
8. [The Lawyer Seat and Marketplace](#8-the-lawyer-seat-and-marketplace)
9. [Communications](#9-communications)
10. [Legal Intelligence Layer](#10-legal-intelligence-layer)
11. [AI Architecture](#11-ai-architecture)
12. [Business Model](#12-business-model)
13. [MVP Scope](#13-mvp-scope)
14. [Roadmap](#14-roadmap)
15. [Tech Stack](#15-tech-stack)
16. [Decisions and Constraints](#16-decisions-and-constraints)

---

## 1. Executive Summary

**From legal chaos to a lawyer-ready brief.**
*Your case, prepared. A structured chronology, issue map, and supporting brief — ready before the first lawyer call.*

Parat is a case preparation platform for people facing serious disputes. It helps users turn scattered documents, fragmented timelines, and unstructured facts into a structured, source-linked case brief before the first lawyer meeting.

The core product is not chat. It is a structured, source-linked chronology and issue map generated from guided intake, uploaded documents, and continuous fact verification. Everything else — the AI interview, document processing, the lawyer seat — exists to produce that artifact.

Parat's primary output is a structured, source-linked chronology and issue map that a lawyer can review immediately. The brief compresses the first lawyer meeting from orientation to strategy — saving real money at the moment people can least afford to waste it.

The product is launched first for Norwegian founder, investor, and shareholder disputes, with a jurisdiction-extensible architecture for future expansion. The AI converses with users in their own language automatically. Where legal database APIs exist for a given jurisdiction — such as the Lovdata API in Norway — the platform adds a legal intelligence layer that cross-references claims against local statutes. This is an enhancement, not a dependency. The product works fully without it.

The business model is subscription-based with a quarterly option to match the lifecycle of legal cases. Lawyer seat add-ons create a second revenue stream and transform the product into a shared collaboration platform between client and counsel.

---

## 2. Problem Statement

### The gap nobody is filling

Legal technology investment has concentrated on two segments: enterprise eDiscovery platforms (Everlaw, Relativity) and AI workspaces for legal professionals (Legora, Harvey). Both assume the user already has a lawyer, already has a case underway, and already understands what they are dealing with.

The person about to hire a lawyer has none of those things. They have a pile of unstructured facts, a stack of documents they cannot interpret, and a consultation booked with someone who charges more per hour than they earn in a day. The first hour of that consultation is spent on orientation — explaining what happened, who the parties are, what documents exist, and what the timeline looks like.

That orientation is the most expensive and least valuable part of legal work. It is also entirely avoidable.

### The specific user

The primary user is a founder, director, or private individual facing a civil dispute. They are not a legal professional. They are stressed, time-poor, and uncertain about their own position. They have typically already tried to make sense of their situation using general-purpose AI tools — ChatGPT, Claude, Gemini — and found those tools frustrating because context is lost between sessions, there is no structure, and there is no memory.

Secondary users include small business owners, landlords, employees in employment disputes, and individuals in inheritance or contractual conflicts. The pattern is the same: a real legal situation, no professional support yet, and a need for clarity before committing to the cost of counsel.

### The insurance dimension

Many disputes involve insurance coverage — D&O, professional indemnity, management liability. The insurance question is not a secondary concern. It is often the most time-sensitive element of the case, with hard notification deadlines that can void coverage if missed. Parat surfaces this immediately and tracks it as a parallel track throughout the case.

---

## 3. Product Architecture

Parat is built in three layers. Each layer makes the previous one more valuable.

### Layer 1 — Preparation tool

The core product. A structured AI interview that guides the user through their case, processes and classifies uploaded documents, and produces a complete, exportable case brief. Targets B2C users. Self-serve, subscription-based. Launched first for Norwegian founder, investor, and shareholder disputes — built on a jurisdiction-extensible core.

- Structured intake interview across case types
- Multi-model AI: interviewer model + silent reviewer/critic model
- Multilingual: AI responds in the user's language automatically; UI translated into major world languages
- Document upload and processing: PDF, Word, email, scanned images, Excel, CSV
- Automatic fact extraction and gap detection from uploaded documents
- Insurance track with notification deadline tracking and letter drafting
- Exportable lawyer brief (PDF/Word)

### Layer 2 — Collaboration platform

The lawyer seat. Once a case brief exists, the user can invite their lawyer directly into the platform. The lawyer accesses the data room, the brief, and a shared communication thread per claim. This is a paid add-on seat per matter.

- Invite lawyer by email — no separate subscription required for the lawyer
- Role-based access: client vs. counsel views
- Shared data room with organised document structure
- Per-claim communication threads
- Lawyer can run their own AI queries against case documents
- Brief updates as the case develops — both parties see the latest version

### Layer 3 — Legal intelligence

The moat. Where a legal database API exists for the user's jurisdiction, the platform integrates it — cross-referencing claims against local statutes and surfacing relevant law directly in the case brief. This layer is jurisdiction-specific and additive: users in jurisdictions without an integration still get the full product.

The first integration is Lovdata (Norway), which is live, free, and covers the full Norwegian legal corpus. Other jurisdictions follow the same model as their APIs become available.

- Jurisdiction detected from user's location and case settings
- Statute lookup per Claim — relevant law surfaced automatically
- Plain-language summaries of applicable statutes in the brief
- Live links to authoritative legal sources
- Current integrations: Lovdata (Norway)
- Roadmap: Karnov (Sweden, Denmark), EUR-Lex (EU), and others

---

## 4. Data Model

The data model mirrors how legal cases are actually structured. It maps directly to the Veriloom hierarchy:

| Parat | Veriloom |
|---|---|
| Case | Product |
| Claim | Feature |
| Thread | Epic |
| Fact | Task |

Each AI session loads only the relevant context level — context never overflows.

### Case

Loaded in every session. The persistent top-level container.

| Field | Type |
|---|---|
| `id` | UUID |
| `title` | User-defined case name |
| `type` | Enum: `investor_dispute` \| `employment` \| `landlord` \| `divorce` \| `inheritance` \| `contractual` \| `other` |
| `status` | Enum: `pre-legal` \| `active` \| `settled` \| `closed` |
| `jurisdiction` | Country + region |
| `opened_at` | Date |
| `plaintiff` | Name, role, entity type |
| `defendant` | Name, role, entity type (the user) |
| `co_defendants` | Array |
| `exposure_amount` | Number (currency) |
| `exposure_notes` | Personal assets at risk? Free text |
| `summary` | 1-paragraph plain language case overview |
| `last_updated` | Date |

### Insurance

A parallel track alongside the Case. Not nested under a Claim — insurance runs across the whole matter. Loaded at session start alongside the Case summary.

| Field | Type |
|---|---|
| `id` | UUID |
| `case_id` | FK → Case |
| `policy_type` | Enum: `D&O` \| `professional_indemnity` \| `management_liability` \| `other` |
| `insurer` | Name |
| `policy_number` | String |
| `coverage_period_from` | Date |
| `coverage_period_to` | Date |
| `coverage_limit` | Number (currency) |
| `claims_made` | Boolean — claims-made vs. occurrence |
| `notification_deadline` | Date — **CRITICAL**, flagged if imminent |
| `notification_status` | Enum: `not_sent` \| `drafted` \| `sent` \| `acknowledged` \| `declined` |
| `notification_draft` | Text — the letter being built |
| `coverage_review_status` | Enum: `not-assessed` \| `under-review` \| `possible-issues-flagged` \| `insurer-response-received` \| `declined` |
| `exclusions_flagged` | Array — policy exclusions that may apply |
| `prior_knowledge_attention` | Enum: `none-identified` \| `possible` \| `significant` \| `requires-immediate-legal-review` — AI-assessed |
| `insurer_contacts` | Array: name, email, role |
| `notes` | Free text |

### Claim

One case can have multiple claims. Loaded alongside its parent Case when working on that claim.

| Field | Type |
|---|---|
| `id` | UUID |
| `case_id` | FK → Case |
| `title` | Short label, e.g. "Misrepresentation of financial position" |
| `allegation` | What they allege, in their words |
| `our_position` | User's one-sentence response |
| `legal_basis` | Law or duty being invoked (if known) |
| `lovdata_refs` | Array — relevant Norwegian statute references from Lovdata API |
| `amount_sought` | Number |
| `documentation_status` | Enum: `well-supported` \| `partially-supported` \| `incomplete` \| `requires-review` |
| `status` | Enum: `active` \| `withdrawn` \| `disputed` \| `resolved` |
| `created_at` / `updated_at` | Timestamps |

### Thread

Four fixed thread types per Claim. Loaded alongside its parent Claim.

| Field | Type |
|---|---|
| `id` | UUID |
| `claim_id` | FK → Claim |
| `type` | Enum: `timeline` \| `evidence` \| `arguments` \| `open_questions` |
| `entries` | Array of Facts |
| `last_updated` | Date |
| `ai_critique` | Latest reviewer model output — persists between sessions |

> The `ai_critique` field is critical. It stores the reviewer model's last assessment of gaps, inconsistencies, and risks. It persists between sessions and is updated incrementally — not regenerated from scratch.

### Fact

The atomic unit. One statement, one source, one verified flag. Every fact traces to something real.

| Field | Type |
|---|---|
| `id` | UUID |
| `thread_id` | FK → Thread |
| `statement` | Single factual statement in plain language |
| `source_type` | Enum: `document` \| `email` \| `verbal` \| `public_record` \| `memory` \| `unknown` |
| `source_ref` | Filename, email subject, URL, or description |
| `source_date` | Date of the original source |
| `verified` | Boolean — user-confirmed vs. AI-inferred |
| `added_by` | Enum: `user` \| `ai_interview` \| `ai_inference` |
| `confidence` | Enum: `confirmed` \| `probable` \| `uncertain` |
| `notes` | Free text |
| `created_at` | Timestamp |

### Session

Not in the brief, but critical for continuity. Every session writes a 2-3 sentence summary. The next session loads the last three summaries — not the full conversation history.

| Field | Type |
|---|---|
| `id` | UUID |
| `case_id` | FK → Case |
| `started_at` | Timestamp |
| `model_primary` | Interviewer model used |
| `model_reviewer` | Critic model used |
| `context_loaded` | Array of Claim/Thread IDs in context this session |
| `facts_added` | Array of Fact IDs created |
| `facts_updated` | Array of Fact IDs modified |
| `critique_output` | Raw reviewer output, stored for audit |
| `summary_of_session` | 2-3 sentences auto-generated at session end |

### Communication

Imported communications mapped to a case. Not generated by Parat — ingested from external tools via integrations. Each Communication is classified and linked to the relevant Claim or Thread automatically.

| Field | Type |
|---|---|
| `id` | UUID |
| `case_id` | FK → Case |
| `claim_id` | FK → Claim (optional — may map to case level) |
| `thread_id` | FK → Thread (optional) |
| `type` | Enum: `message` \| `email` \| `call_transcript` \| `sms` \| `document_note` |
| `source` | Enum: `parat_message` \| `email_ingest` \| `google_meet` \| `teams` \| `zoom` \| `whatsapp` \| `manual` |
| `participants` | Array: user IDs or name strings |
| `content` | Full text of message or transcript |
| `summary` | AI-generated 1-2 sentence summary |
| `facts_extracted` | Array of Fact IDs auto-created from this communication |
| `sent_at` | Timestamp of original communication |
| `ingested_at` | Timestamp of import into Parat |
| `verified` | Boolean — user confirmed mapping is correct |

---

## 5. Interview Flow

The intake interview is the core product interaction. It runs on first use and can be re-entered at any time to add detail. It is conversational, not form-based — the AI speaks naturally, adapts to what the user has already said, and does not repeat questions answered by uploaded documents.

Two models run simultaneously. The interviewer model conducts the conversation. The reviewer model silently critiques each answer and instructs the interviewer to probe further, flag risks, or note gaps. The user sees only the interviewer.

### Phase 1A — Orientation

Goal: establish the highest-level picture in the user's own words.

- What is this dispute about, in one or two sentences?
- Who is making the claim against you, and what are they asking for?
- Has formal legal action started, or is this still a threat or demand?

### Phase 1B — Insurance

Goal: surface insurance coverage and notification obligations before anything else. Inserted early because a missed notification deadline can void coverage entirely.

**Policy basics:**
- Do you have any relevant insurance — D&O, professional indemnity, or management liability?
- Who is the insurer, and what are the coverage dates?
- Is this a claims-made policy?
- Have you notified your insurer yet? If yes — when, and what did you say?
- Do you know your notification deadline?

**Prior knowledge block — the questions that determine coverage validity:**
- When exactly did you first receive the claim or letter of intent?
- At the time you took out this policy, were you aware of any disputes, complaints, or threatened claims?
- Had any investor, creditor, or counterparty expressed dissatisfaction before the policy started?
- Was there any dispute, significant financial event, or creditor pressure in the 6 months before policy inception?
- Did anything specific prompt you to take out the policy when you did?
- Were there any board-level discussions of legal risk or potential claims before the policy started?

> The reviewer model cross-references all answers here against the case timeline. Any event that predates policy inception and could constitute prior knowledge is flagged with a coverage risk rating.

### Phase 2 — Timeline

Goal: build the chronological spine of the case.

- When was the company founded, and what did it do?
- When did the investors come in, and on what terms — equity, loan, or convertible note?
- When did the company start experiencing financial difficulty?
- Were there any significant events — covenant breaches, board decisions, investor communications — in the lead-up to insolvency?
- When did the formal bankruptcy or insolvency process begin, and how did it conclude?
- When did you first hear from the investors about a potential claim?

### Phase 3 — Parties

Goal: map everyone involved and their roles.

- Who are the investors making the claim — individuals, funds, or both?
- Who else was in leadership at the company — co-founders, board members, executives?
- Is anyone else named in the claim alongside you?
- Were there any advisors — legal, financial, or otherwise — involved in the events being disputed?

### Phase 4 — The Claims

Goal: pin down what they are actually alleging, claim by claim.

- What are they saying you did wrong, specifically?
- Are they characterising the conduct as negligent, reckless, or intentional?
- Are they claiming misrepresentation, breach of fiduciary duty, improper distributions, something else?
- What amount are they seeking, and how are they calculating it?
- Have they cited specific laws or duties in their claim?

### Phase 5 — Your Position

Goal: surface the defence.

- What is your response to each allegation?
- Were there agreements, disclosures, or communications that support your position?
- Were investors kept informed of the financial situation as it developed?
- Is there anything you did that in hindsight you would do differently — and if so, what?

> The reviewer model flags any answer that sounds like an admission of wrongdoing and prompts the interviewer to seek clarification before it is stored as a Fact.

### Phase 6 — Evidence

Goal: inventory what exists and what is missing.

- What documents do you have that are relevant to this case?
- What documents do they likely have?
- Are there witnesses who could support your account?
- Is there any documentation you know should exist but cannot locate?

### Phase 7 — Exposure and Outcome

Goal: ground the user in what is actually at stake and what they want.

- Has anyone given you an informal sense of your legal exposure?
- Are your personal assets at risk, or is this contained to the company?
- What outcome are you hoping for — full defence, settlement, clarification?
- Is there a time constraint — a filing deadline, a settlement window?

---

## 6. Document Processing

Every uploaded document is processed automatically. No manual sorting or tagging required from the user.

### Supported file types

- PDF — native text extraction and OCR for scanned documents
- Word (.docx, .doc)
- Email (.eml, .msg) — including thread parsing
- Excel and CSV
- Images (.png, .jpg) — OCR
- Plain text

### Processing pipeline

Each document passes through the following steps on upload:

1. **Classification** — policy document | claim letter | board minute | financial statement | correspondence | legal filing | other
2. **Track routing** — Insurance | Claims | Timeline | Evidence | Arguments
3. **Fact extraction** — dates, parties, amounts, obligations, deadlines pulled out as draft Facts with `added_by: ai_inference` and `verified: false`
4. **Interview gap-matching** — the system checks which open interview questions the document answers and marks them resolved
5. **Gap surfacing** — remaining unanswered questions are re-presented to the user after upload

> The user is never asked a question the system can already answer from their documents. The interview adapts continuously as documents are added.

### Data room structure

All documents live in a structured, browsable data room organised by track:

```
Case: [case title]
├── Insurance
│   ├── Policy documents
│   ├── Insurer correspondence
│   └── Notification letter drafts
├── Claims
│   ├── Claim A
│   │   ├── Letter of demand
│   │   └── Supporting documents
│   └── Claim B
├── Timeline
│   └── Board minutes, financial statements
├── Evidence
│   └── Documents supporting user's position
└── Generated outputs
    ├── Case brief (versioned)
    └── Notification letter drafts
```

Every Fact in the system links back to its source document with a page or section reference. The lawyer brief contains live footnotes pointing directly into the data room.

---

## 7. The Lawyer Brief

The brief is the primary output of the platform. It is generated automatically from the data model and updates every session. It is always ready to export — the user never needs to write it.

### Structure

| Section | Contents |
|---|---|
| **0. Insurance status** | Policy details, notification status, coverage eligibility assessment, flagged exclusions, draft notification letter |
| **1. Case overview** | Parties, jurisdiction, status, exposure |
| **2. Claims summary** | One paragraph per Claim: allegation, our position, amount, strength assessment |
| **3. Timeline** | All Timeline thread Facts sorted by date, with source references |
| **4. Evidence inventory** | All Evidence Facts grouped by source type |
| **5. Our position** | All Arguments Facts |
| **6. Open questions** | All unresolved Open_questions Facts |
| **7. Exposure assessment** | Amount, personal asset risk, AI summary |
| **8. Legal context** | Lovdata-sourced statute references relevant to each Claim, with direct links |

The brief exports as PDF and Word. All footnotes are live links into the data room.

---

## 8. The Lawyer Seat and Marketplace

### The lawyer seat

Once a case brief exists, the user can invite their lawyer into the platform via email. The lawyer can accept as a guest (no account required) or create a free Parat account. Creating an account is encouraged — it unlocks the marketplace profile and builds their track record on the platform over time.

**What the lawyer gets:**

- Full read access to the data room
- The generated brief as a living document
- Ability to annotate documents and flag issues
- Per-claim communication thread — shared space for questions, instructions, and status updates
- Ability to run AI queries against case documents
- Ability to add Facts, update claim assessments, and mark open questions resolved

The lawyer arrives informed. The first consultation is strategic, not orientational. The platform becomes the single source of truth for the matter.

### The lawyer account

Lawyers who create an account build a profile automatically from the cases they work on. No manual setup beyond basic credentials.

**Auto-populated from case data:**
- Case types handled (investor, employment, landlord, etc.)
- Jurisdiction(s)
- Activity patterns — response time, communication volume
- Case progression signal — did the brief improve, did open questions get resolved?

**Manually added by lawyer:**
- Bar registration and credentials
- Firm affiliation
- Self-described specialisms
- Languages

Lawyer accounts are free. Discovery and referrals are the value exchange. No paid placement, no featured listings — ranking is earned from platform activity, not purchased.

### The reputation layer

Parat does not use star ratings. The reputation signal is built from two sources:

**Inferred from platform activity:**
- Response time to client messages
- Rate of open question resolution
- Case brief improvement while lawyer was active
- Communication clarity (AI-assessed from message content)

**Collected at case close — short structured questionnaire:**
- Did your lawyer respond to you promptly?
- Did they explain things in a way you could understand?
- Would you use them again for a similar matter?
- Would you recommend them to someone in a similar situation?

Four questions, binary answers. No numeric scores. The output is a trust signal displayed on the lawyer's profile, not a ranking metric gamed by outlier reviews.

A client who lost a case they were always going to lose is not a reflection of lawyer quality. The questionnaire is scoped to process and communication, not outcome.

### The marketplace

When a user completes a case brief, Parat can suggest lawyers based on:

- Case type match — lawyers who have worked on similar cases
- Jurisdiction match — lawyers active in the user's country and region
- Trust signal — based on questionnaire responses and platform activity
- Language match — lawyers who communicate in the user's language

Finding a lawyer today is word of mouth or a Google search — neither of which tells you whether this person has handled an investor dispute with D&O complications in Norway before. Parat can answer that question precisely, from real case data, at the exact moment the user needs it.

The marketplace is not in MVP. It requires a critical mass of lawyer accounts and case history to generate meaningful matches. It ships when that mass exists.

---

## 9. Communications

### Philosophy: Parat is the case layer, not the communication tool

Every major communication platform already has transcription, recording, and export APIs. Parat does not replicate these. It is the destination where communication outputs land and get structured — mapped to claims, threaded into the case record, and mined for facts automatically.

### What this means in practice

Anything that happens inside or connected to a case becomes part of the structured case record. Not what the user remembers to add. What actually happened.

This creates a case record that is materially more accurate than any manually maintained document — and generates a communication signal that no other platform has access to.

### Integration map

| Tool | Integration mechanism | What Parat ingests |
|---|---|---|
| **Email** | Per-case forwarding address (case-xyz@parat.ai) | Full email thread, classified and mapped to claim |
| **Google Meet** | OAuth integration, post-call transcript pull | Meeting transcript, mapped to case |
| **Microsoft Teams** | Teams app or webhook | Meeting transcript and chat |
| **Zoom** | Zoom API, post-call transcript pull | Meeting transcript |
| **WhatsApp** | WhatsApp Business API | Message thread mapped to case |
| **Manual upload** | File upload | Any transcript or message export |

Parat never joins calls or intercepts communications in real time. It pulls structured outputs — transcripts, exports — after the fact, with explicit user consent.

### Consent and privacy

All communication ingestion requires explicit opt-in per integration. Users choose which integrations to connect at the case level, not just at account level — a user may want email ingestion for one case but not another.

Lawyer consent is required before any communication involving a lawyer is ingested or processed.

### What Parat does with ingested communications

1. Classifies the communication by type and relevant claim
2. Extracts facts automatically — dates, commitments, admissions, references to documents
3. Creates draft Facts in the relevant Thread with `added_by: ai_inference` and `verified: false`
4. Generates a 1-2 sentence summary stored on the Communication object
5. Surfaces newly extracted facts to the user for verification

The case brief and timeline update automatically as communications are ingested. The lawyer who joins a case mid-way sees a complete record, not just what the client chose to summarise.

### MVP scope

Communications are out of scope for MVP. The sequencing:

| Feature | Milestone |
|---|---|
| Per-case email ingestion address | V1.1 |
| In-platform client/lawyer messaging | V1.2 |
| Google Meet / Zoom transcript import | V1.2 |
| Microsoft Teams integration | V2.0 |
| WhatsApp Business API | V2.0 |

---

## 10. Legal Intelligence Layer

The legal intelligence layer connects Parat to authoritative legal sources for the user's jurisdiction. It is optional infrastructure — the product works without it — but it is the feature that makes Parat genuinely sticky in markets where it exists.

### How it works

When a Claim is created, the platform detects the user's jurisdiction from their case settings and queries the relevant legal database API. Applicable statutes, regulations, and case law references are stored on the Claim and rendered in Section 8 of the lawyer brief as plain-language summaries with direct source links.

The reviewer model uses this data to assess whether the plaintiff's legal basis is sound under local law — surfacing weak claims before the user spends money having a lawyer confirm the same thing.

### Multilingual output

The legal intelligence layer outputs in the user's language. A Norwegian user sees aksjeloven provisions in Norwegian. A French user sees Code civil provisions in French. The AI handles translation and plain-language summarisation natively.

### Current integrations

**Lovdata (Norway)** — live, free API. Covers the full Norwegian legal corpus: laws, regulations, case law, and legal literature. First integration shipping with MVP.

Relevant Norwegian statutes by case type:
- Investor disputes: aksjeloven (company law), konkursloven (bankruptcy law), avtaleloven (contract law)
- Employment: arbeidsmiljøloven (working environment act)
- Landlord/tenant: husleieloven (tenancy act)

### Roadmap integrations

| Jurisdiction | Source | Status |
|---|---|---|
| Sweden / Denmark | Karnov | Planned |
| EU | EUR-Lex | Planned |
| UK | legislation.gov.uk | Planned |
| USA | varies by state | Under evaluation |

### Integration model

Each jurisdiction integration follows the same pattern: one API connector, one statute taxonomy per case type, one query config per Claim type. Adding a new jurisdiction is a bounded build, not a platform change.

> Recommended: approach Lovdata as an early partner. Positioning Parat as a consumer access layer — making Norwegian law accessible to non-lawyers for the first time — aligns with their public interest mandate and may open co-marketing opportunities.

---

## 11. AI Architecture

### Multi-model approach

Every interview session runs two models simultaneously:

- **Interviewer model** — conducts the conversation, asks questions, follows up, stores Facts. The user interacts only with this model.
- **Reviewer model** — reads each answer silently, assesses for gaps, inconsistencies, admissions, and risks, and passes structured instructions back to the interviewer. The user never sees this model's output — but it shapes every follow-up question.

The reviewer model's output is stored as `ai_critique` on the relevant Thread after each session. It reads the stored critique from last time and updates it incrementally — it does not re-read the full case from scratch.

### Context management

| Always loaded | Case summary, Insurance track summary, last 3 session summaries |
|---|---|
| Loaded on demand | The specific Claim being discussed, its Threads, its Facts |
| Never loaded speculatively | Facts from other Claims, full document contents, full conversation history |

Session summaries are the memory layer. The AI does not rely on conversation history — it relies on structured, persisted summaries that never degrade across sessions.

### Token economics

Parat calls AI APIs directly and manages costs. Users do not provide their own API keys.

The context management architecture described above is not just good engineering — it is the cost control mechanism. By loading only the relevant slice of the data model per session, token consumption per session stays predictable and bounded. A user working on one claim does not burn tokens on the rest of the case.

This matters because AI API costs are real and variable. A user who uploads 200 documents and runs 40 sessions over a 12-month case will consume meaningfully more than a user who runs 5 sessions on a simple landlord dispute. The pricing model must reflect this without punishing ordinary use.

---

## 12. Business Model

### Credit-based pricing

Every plan purchases a bundle of case credits. Case credits are the unit of value — not seats, not sessions, not features. The subscription period determines how long the bundle is valid, not how much you can do within it.

| Plan | Price | Token bundle | Notes |
|---|---|---|---|
| Monthly | ~250 NOK/month | 500 case credits | Good for simple, active cases |
| Quarterly | ~600 NOK/quarter | 1,500 case credits | Preferred — matches case lifecycle |
| Lawyer seat | ~300 NOK/month per matter | 300 case credits | Billed to client, not the lawyer |
| Top-up pack | ~150 NOK | 500 case credits | Available at any time, no expiry |

Case credit bundles do not roll over between periods. Unused credits expire when the period ends. Top-up packs purchased separately never expire — they sit in the account until consumed.

The credit balance is always visible. Users see exactly how many case credits they have left and roughly how many sessions that represents. When the balance hits zero, the platform pauses AI features — it does not silently rack up charges. The user tops up to continue.

### Why this model

Parat cannot subsidise outlier users. A single user running large document sets through OCR, processing hundreds of emails, and running extended multi-model sessions can generate API costs that exceed their subscription fee many times over. The case credit model ensures that heavy consumption is always paid for — either by the bundle or by a top-up.

It also aligns incentives correctly. A user mid-case who runs out of credits has strong motivation to top up immediately — their case is active, the stakes are real, and they have already invested time in the platform. Top-up conversion is not a hard sell in this context.

### Why quarterly

Legal cases run for months or years. A monthly subscription optimises for churn. A quarterly subscription matches the user's mental model — they are dealing with a situation, not subscribing to a service. Quarterly billing also reduces payment friction for a product category where engagement is episodic: intense during flare-ups, quiet during waiting periods.

### Revenue model evolution

1. **Phase 1** — B2C subscriptions: individual cases, self-serve
2. **Phase 2** — Lawyer seat add-ons: collaboration revenue per matter
3. **Phase 3** — Law firm intake tool: white-label or API access for firms
4. **Phase 4** — Jurisdiction expansion: legal intelligence integrations market by market as APIs become available

---

## 13. MVP Scope

The MVP must do one thing exceptionally well: take a disorganised person with a real legal problem and produce a structured, credible case document in a single session.

### In scope

- Case type: investor / shareholder dispute (one type only — designed from a real case)
- Full interview flow: Phases 1A through 7
- Insurance track: full Phase 1B interview and notification letter draft
- Document upload: PDF and Word processing with fact extraction
- Data model: Case, Insurance, Claim, Thread, Fact, Session
- Lawyer brief: auto-generated PDF export
- Legal intelligence layer: Lovdata integration for Norwegian jurisdiction
- Multilingual AI responses (browser language detection)
- Session continuity: session summaries as the memory layer
- Web app: clean, calm UI — the opposite of a legal form

### Out of scope

- Lawyer seat and data room sharing
- Additional case types beyond investor disputes
- Mobile app
- Full multi-document data room with advanced search
- Lawyer accounts and marketplace
- Communications integrations (email, Meet, Teams, WhatsApp)
- Chambers or lawyer matching
- Integrations with external document management systems

> The investor dispute case type is chosen because it is the most complex — it involves corporate law, insolvency, director duties, insurance, and multi-party dynamics. If the interview flow works for this case type, it works for everything simpler.

---

## 14. Roadmap

### Architecture note: universal framework, not per-case rebuilds

The interview framework is almost entirely universal. Phases 1A, 2, 3, 5, 6, and 7 are identical regardless of case type — the same questions, the same data model, the same context management. What differs between case types is narrow and deliberate:

- **Phase 4 (the claims)** — the vocabulary of wrongdoing, the relevant legal concepts, and the legal intelligence queries all depend on case type. This is a configuration layer, not a rewrite.
- **Phase 1B (insurance)** — activates for case types where coverage is relevant (investor, employment, professional indemnity) and sits dormant for others (divorce, landlord).
- **Document taxonomy** — a shareholder agreement, an employment contract, and a lease require different extraction logic.

Adding a new case type after MVP is therefore a focused build: one Phase 4 question set, one document taxonomy, one legal intelligence query config. The rest of the product ships once and does not change.

### Milestones

| Milestone | Timeline | Scope |
|---|---|---|
| MVP | Q2 2026 | Universal framework. Phase 4 for investor disputes. Insurance track. Lovdata (Norway). Multilingual AI. Brief export. Web app. |
| V1.1 | Q3 2026 | Phase 4 configs for employment and landlord/tenant. Per-case email ingestion. Document OCR. Session history view. |
| V1.2 | Q3 2026 | Lawyer seat and accounts. In-platform messaging. Google Meet / Zoom transcript import. Data room. |
| V2.0 | Q4 2026 | Lawyer marketplace with matching. Phase 4 configs for divorce and inheritance. Teams and WhatsApp integrations. Mobile app. |
| V2.1 | 2027 | Law firm intake tool. API access. Karnov integration (Sweden/Denmark). |
| V3.0 | 2027+ | EUR-Lex (EU). UK legislation API. US market evaluation. |

---

## 15. Tech Stack

All technology choices follow a single principle: clean abstractions at every layer. Each external dependency — AI provider, payment processor, auth provider, legal data API, storage — sits behind an interface. The concrete implementation is swappable without touching application logic.

---

### Frontend

**Next.js (React, TypeScript)**

Server-side rendering for public marketing pages. Client-side rendering for the authenticated application. The page/component/hook separation maps cleanly to Parat's UI contexts — marketing site, case workspace, data room, lawyer view. TypeScript throughout.

---

### Backend

**Node.js with TypeScript**

TypeScript enables the object-oriented architecture that underpins the entire product. Every entity in the data model — `Case`, `Claim`, `Thread`, `Fact`, `Session`, `Insurance`, `Communication` — is a typed class with defined methods and interfaces. Every external service sits behind an abstract interface with a concrete implementation.

**Core abstract interfaces:**

```typescript
// AI layer — swap providers without touching application code
interface AIProvider {
  interview(context: CaseContext, message: string): Promise<AIResponse>
  critique(thread: Thread): Promise<CritiqueResult>
  extract(document: Document): Promise<Fact[]>
  summarise(content: string, language: string): Promise<string>
  query(prompt: string): Promise<string>
}

// Legal intelligence — one interface, many jurisdictions
interface LegalIntelligenceProvider {
  jurisdiction: string
  lookup(claimType: ClaimType, keywords: string[]): Promise<StatuteRef[]>
  summarise(ref: StatuteRef, language: string): Promise<string>
}

// Billing — swap Polar for Stripe if needed in one file
interface BillingService {
  createCheckout(userId: string, productId: string): Promise<CheckoutSession>
  deductTokens(userId: string, amount: number): Promise<TokenBalance>
  getBalance(userId: string): Promise<TokenBalance>
  purchaseTopUp(userId: string, packId: string): Promise<TokenBalance>
  getSubscription(userId: string): Promise<Subscription | null>
}

// Storage — S3-compatible, provider-agnostic
interface StorageProvider {
  upload(file: Buffer, path: string, mimeType: string): Promise<string>
  download(path: string): Promise<Buffer>
  delete(path: string): Promise<void>
  getSignedUrl(path: string, expiresIn: number): Promise<string>
}

// Case type config — new case type = new class, zero changes to framework
abstract class CaseType {
  abstract type: CaseTypeEnum
  abstract phase4Questions(): InterviewQuestion[]
  abstract documentTaxonomy(): DocumentClassifier[]
  abstract legalQueryConfig(): LegalQueryConfig
  abstract insuranceRelevant(): boolean
}

// Concrete implementations
class InvestorDisputeCaseType extends CaseType { ... }
class EmploymentCaseType extends CaseType { ... }
class LandlordCaseType extends CaseType { ... }
```

The `CaseType` abstraction is the most important in the product. Adding a new case type means creating one new file that extends `CaseType`. Nothing else changes.

---

### Database

**PostgreSQL via Supabase**

Relational structure matches the data model exactly — Cases have Claims, Claims have Threads, Threads have Facts. Postgres JSON columns handle flexible fields like `lovdata_refs`, `facts_extracted`, and `exclusions_flagged` without forcing premature schema decisions.

Supabase provides managed Postgres, built-in storage, and real-time subscriptions for collaborative features (lawyer seat updates) — without ops overhead for a two-person team.

EU region hosting: Supabase West Europe (Dublin) or EU Central (Frankfurt). Required for GDPR compliance.

---

### Authentication

**Better Auth**

Handles all SSO providers — Google, Apple, Meta/Facebook — plus email/password and magic link. TypeScript-native, framework-agnostic, and has a first-party Polar plugin that wires auth and billing together automatically.

**Supported sign-in methods at MVP:**
- Google OAuth
- Apple Sign In
- GitHub (useful for lawyer/technical users)
- Email + password
- Magic link (email)

Meta/Facebook added post-MVP — lower priority for the initial user demographic.

**Polar integration via Better Auth plugin:**

```typescript
import { betterAuth } from "better-auth"
import { polar, checkout, portal, usage } from "@polar-sh/better-auth"
import { Polar } from "@polar-sh/sdk"

const polarClient = new Polar({ accessToken: process.env.POLAR_ACCESS_TOKEN })

export const auth = betterAuth({
  plugins: [
    polar({
      client: polarClient,
      createCustomerOnSignUp: true,  // Polar customer created on first signup
      use: [checkout(), portal(), usage()]
    })
  ],
  socialProviders: {
    google: { clientId: '...', clientSecret: '...' },
    apple:  { clientId: '...', clientSecret: '...' },
    github: { clientId: '...', clientSecret: '...' }
  }
})
```

User signup → Polar customer created automatically → token balance initialised → subscription flow ready. No manual wiring.

**Apple Sign In note:** Requires Apple Developer account ($99/year). Apple relays email addresses by default — the user's real email may not be available. Any email-dependent features (case notifications, lawyer invitations) must handle this gracefully with a fallback prompt for a confirmed email address.

---

### Payments and Billing

**Polar.sh**

Polar operates as a Merchant of Record — it handles VAT, GST, and sales tax in all jurisdictions automatically. For a Norwegian company selling globally, this eliminates the need to register for VAT in every market. It is the single most operationally significant billing decision for Parat.

**Why Polar over Stripe:**
- MoR tax handling included — no separate tax layer needed
- Native LLM token usage ingestion — purpose-built for Parat's billing model
- 4% + $0.40 per transaction — no monthly fees, no setup costs
- First-party Better Auth plugin — auth and billing wired together
- Open source — auditable, community-supported

**Product structure in Polar:**

| Product | Type | Price | Token bundle |
|---|---|---|---|
| Monthly plan | Recurring | ~250 NOK | 500 case credits |
| Quarterly plan | Recurring | ~600 NOK | 1,500 case credits |
| Lawyer seat | Recurring per matter | ~300 NOK/month | 300 case credits |
| Credit top-up S | One-time | ~150 NOK | 500 case credits |
| Credit top-up L | One-time | ~350 NOK | 1,500 case credits |

Top-up products are one-time purchases — they never expire. Subscription bundles reset at period renewal.

**Token ingestion:**

```typescript
import { Ingestion } from "@polar-sh/ingestion"
import { LLMStrategy } from "@polar-sh/ingestion/strategies/LLM"

const ingestion = Ingestion({ accessToken: process.env.POLAR_ACCESS_TOKEN })
  .strategy(new LLMStrategy(anthropicClient))
  .ingest("anthropic-usage")

// Every AI call goes through the ingestion client
// Token usage is tracked and deducted automatically
```

**Risk note:** Polar is a newer platform. A single negative account review was observed during research involving a 120-day balance hold after an account policy dispute. Mitigate by: maintaining a secondary Stripe account as a fallback, keeping the `BillingService` abstraction clean, and monitoring Polar's platform status during early growth.

---

### File Storage

**Supabase Storage (S3-compatible)**

Documents uploaded by users — PDFs, Word files, emails, images — are stored in Supabase Storage. Per-case storage buckets with row-level security ensure users can only access their own documents.

The `StorageProvider` interface means switching to AWS S3 or Cloudflare R2 is a single implementation swap if needed at scale.

---

### Hosting

| Layer | Provider | Notes |
|---|---|---|
| Frontend | Vercel | Native Next.js deployment, edge network, preview deployments per PR |
| Backend API | Railway or Fly.io | Node.js, simple ops, scales horizontally, EU region available |
| Database | Supabase (EU) | Managed Postgres, EU West (Dublin) for GDPR |
| Storage | Supabase Storage | Co-located with database, simplifies access control |
| AI APIs | Anthropic (primary) | Via abstracted AIProvider — model and provider swappable |
| Payments | Polar.sh | MoR, global tax handling |
| Auth | Better Auth | Self-hosted auth layer, integrates with Polar |

---

### Stack Summary

```
Next.js + TypeScript        — frontend and API routes
Node.js + TypeScript        — backend services
PostgreSQL (Supabase)       — primary database, EU hosted
Better Auth                 — authentication, SSO, session management
Polar.sh                    — payments, subscriptions, token billing, MoR tax
Supabase Storage            — document storage
Vercel                      — frontend hosting
Railway / Fly.io            — backend hosting
Anthropic API               — AI (behind AIProvider interface)
Lovdata API                 — legal intelligence, Norway (behind LegalIntelligenceProvider)
```

---

## 16. Decisions and Constraints

The following have been resolved. They inform product design, copy, legal terms, and infrastructure choices.

---

**Legal liability — decided**

Parat does not provide legal advice. It provides a structured framework for organising a legal situation using AI. All outputs — case briefs, timelines, claim assessments, insurance letter drafts — are organisational tools, not legal counsel.

Every output carries a clear disclaimer. Users acknowledge at signup that decisions made based on Parat's output are their own responsibility. Parat strongly recommends consulting a qualified lawyer once an overview has been established — the explicit value proposition is that the lawyer engagement becomes faster and cheaper as a result of using the platform, not that it replaces one.

This framing must be consistent across all UI copy, terms of service, and AI-generated outputs. The AI should never characterise its analysis as a legal opinion.

---

**Lovdata partnership — decided**

Lovdata is government-owned, open to founder conversations, and explicitly welcomes partnerships on their website. Their public interest mandate aligns directly with Parat's value proposition: making Norwegian law accessible to non-lawyers.

Approach Lovdata as a strategic partner, not just an API consumer. A formal data partnership agreement may unlock preferred access, co-marketing opportunities, and a defensible position as the recommended consumer-facing layer for their data.

Action: initiate founder conversation with Lovdata before MVP launch.

---

**Data residency — decided**

All data hosted in EU datacenters. GDPR compliance is non-negotiable for European users and sets the standard for all other markets.

A data processing agreement (DPA) is required before launch. The DPA should be drafted to minimise Parat's liability exposure — Parat processes data as a tool, does not own it, and does not use it for any purpose beyond delivering the service to the user.

Action: engage a GDPR-specialist lawyer to draft DPA and terms of service before launch.

---

**Multilingual UI — decided**

MVP ships with English and Norwegian. V1.1 adds Spanish, French, German, and Portuguese — covering the majority of the addressable market. Arabic, Hindi, Japanese, Korean, and Chinese follow in V2.

The AI conversation layer handles any language natively from day one — no additional build required. The bounded work per language is UI string translation only.

---

**Insurance letter liability — decided**

Parat takes no liability for the notification letter draft or any other output. The letter is a structured starting point generated from the user's own inputs. It is explicitly labelled as a draft for lawyer review — never as a final document.

If a user sends any Parat-generated output to an insurer, a counterparty, or a court without independent legal review, that is entirely their own decision and risk. The terms of service and in-product copy make this unambiguous.

The broader principle: Parat is a framework for leveraging the organisational power of LLMs. It makes the legal process more efficient and significantly reduces the cost of legal counsel by compressing orientation time. It is not a lawyer replacement and never claims to be.

---

**Data retention — decided**

Users choose their data retention preference at signup. Two options:

- **Standard** — data retained on EU servers for the duration of the subscription plus a defined grace period. Standard pricing.
- **Zero retention** — AI API calls use zero-retention configuration; case data is deleted on session end and not stored beyond the active session. Higher case credit cost passed through to user as a pricing tier premium.

The zero-retention option is most relevant for users handling highly sensitive matters — insurance claims, high-value disputes, confidential negotiations. It should be clearly explained at signup, not buried in settings.

---

**Legal intelligence API architecture — decided**

Parat does not host legal content. All statute and case law data is queried at runtime from authoritative external APIs and never stored beyond a citation string and a plain-language AI summary.

The query flow per Claim:
1. Claim type and jurisdiction detected
2. LLM generates a structured query in the API's required syntax
3. External API returns references and excerpts
4. LLM summarises applicable provisions in plain language in the user's language
5. Citation and summary stored on the Claim — not the full source text
6. Brief links directly to the authoritative source

Adding a new jurisdiction is a bounded build: one API connector, one prompt template mapping Parat's claim types to that jurisdiction's legal taxonomy, one test suite. A single developer can add a jurisdiction in a day once the pattern is established.

Priority order after Lovdata: Karnov (Sweden/Denmark), EUR-Lex (EU, 24 languages), legislation.gov.uk (UK, free and well-documented). US deprioritised — fragmented by state, no single authoritative API.

---

*Parat — Confidential working draft — March 2026*
