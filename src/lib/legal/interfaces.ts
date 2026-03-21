import type { CaseTypeEnum, StatuteRef } from '@/types/index'

// ClaimType: type alias for CaseTypeEnum. Same values for MVP.
// Semantically distinct: CaseTypeEnum classifies the overall case;
// ClaimType classifies what an individual claim alleges.
// LegalIntelligenceProvider is keyed to ClaimType per handoff doc line 96.
export type ClaimType = CaseTypeEnum

export interface LegalIntelligenceProvider {
  jurisdiction: string
  lookup(claimType: ClaimType, keywords: string[]): Promise<StatuteRef[]>
  summarise(ref: StatuteRef, language: string): Promise<string>
}
