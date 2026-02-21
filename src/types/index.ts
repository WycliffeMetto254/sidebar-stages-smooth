export type Role = 'founder' | 'analyst' | 'senior_analyst';

export type Stage =
  | 'idea'
  | 'analysis'
  | 'awaiting_assignment'
  | 'validation'
  | 'diligence'
  | 'contract'
  | 'bootcamp'
  | 'funding';

export const STAGES: Stage[] = [
  'idea', 'analysis', 'awaiting_assignment', 'validation',
  'diligence', 'contract', 'bootcamp', 'funding',
];

export const STAGE_LABELS: Record<Stage, string> = {
  idea: 'Idea',
  analysis: 'Analysis',
  awaiting_assignment: 'Awaiting Assignment',
  validation: 'Validation',
  diligence: 'Due Diligence',
  contract: 'Contract',
  bootcamp: 'Bootcamp',
  funding: 'Funding',
};

export const ROLE_LABELS: Record<Role, string> = {
  founder: 'Founder',
  analyst: 'Analyst',
  senior_analyst: 'Senior Analyst',
};

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  password: string;
}

export interface AnalysisScores {
  problemClarity: number;
  marketViability: number;
  feasibility: number;
  revenueLogic: number;
  executionReadiness: number;
  overall: number;
}

export interface Meeting {
  id: string;
  pitchId: string;
  agenda: string[];
  outcome: 'pending' | 'approved' | 'rejected';
  date: string;
}

export interface DiligenceData {
  businessRegistration: string;
  physicalAddress: string;
  pinLocation: string;
  workforceSize: string;
  businessType: string;
  verified: boolean;
}

export interface Milestone {
  id: string;
  title: string;
  completed: boolean;
  trancheAmount: number;
  approved: boolean;
}

export interface BootcampDay {
  day: number;
  week: number;
  title: string;
  completed: boolean;
}

export interface AppNotification {
  id: string;
  userId: string;
  message: string;
  pitchId: string;
  tab?: string;
  read: boolean;
  createdAt: string;
}

export interface Pitch {
  id: string;
  founderId: string;
  assignedAnalystId: string | null;
  assignedBySeniorId: string | null;
  companyName: string;
  tagline: string;
  problem: string;
  solution: string;
  marketSize: string;
  businessModel: string;
  team: string;
  stage: Stage;
  analysisScores: AnalysisScores | null;
  meetings: Meeting[];
  diligenceData: DiligenceData | null;
  contractSignedFounder: boolean;
  contractSignedAnalyst: boolean;
  bootcampProgress: BootcampDay[];
  milestones: Milestone[];
  escrowBalance: number;
}