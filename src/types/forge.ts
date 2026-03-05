export type BusinessRole = 'ceo' | 'cto' | 'cmo' | 'cfo' | 'coo';

export const BUSINESS_ROLE_LABELS: Record<BusinessRole, string> = {
  ceo: 'Chief Executive Officer',
  cto: 'Chief Technology Officer',
  cmo: 'Chief Marketing Officer',
  cfo: 'Chief Financial Officer',
  coo: 'Chief Operations Officer',
};

export interface SquadMember {
  id: string;
  name: string;
  email: string;
  password: string;
  businessRole: BusinessRole;
  squadId: string;
}

export interface Squad {
  id: string;
  name: string;
  members: SquadMember[];
  selectedProblemId: string | null;
  forgeStartDate: string;
  forgeDay: number; // 1-90
}

export interface ProblemBankEntry {
  id: string;
  title: string;
  description: string;
  industry: string;
  marketSize: string;
  targetDemographic: string;
  competitorLandscape: string;
  urgencyRating: 'low' | 'medium' | 'high' | 'critical';
  geographicScope: string;
  evidenceLinks: string[];
  submittedByAnalystId: string;
  submittedByName: string;
  dateSubmitted: string;
  status: 'available' | 'claimed';
  claimedBySquadId: string | null;
}

export interface ForgeTodo {
  id: string;
  squadId: string;
  memberId: string | null; // null = squad-wide
  title: string;
  description: string;
  completed: boolean;
  dueDay: number; // day in the 90-day forge
  category: 'business-model' | 'market-research' | 'financial-planning' | 'operations' | 'customer-discovery';
}

export interface ForgeKPI {
  id: string;
  memberId: string;
  squadId: string;
  metric: string;
  target: number;
  current: number;
  unit: string;
}

export interface LetterOfIntent {
  id: string;
  squadId: string;
  customerName: string;
  customerOrg: string;
  description: string;
  dateReceived: string;
  verified: boolean;
}

export const FORGE_PHASES = [
  { days: '1-15', label: 'Foundation', description: 'Understand business fundamentals & pick a problem' },
  { days: '16-40', label: 'Deep Dive', description: 'Market research, business model, financial planning' },
  { days: '41-65', label: 'Build & Test', description: 'Prototype solution, test assumptions' },
  { days: '66-90', label: 'Market Validation', description: 'Connect with customers, collect LOIs' },
];
