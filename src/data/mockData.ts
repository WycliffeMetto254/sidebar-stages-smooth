import { User, Milestone } from '@/types';

export const MOCK_USERS: User[] = [
  {
    id: 'analyst-1',
    name: 'James Mitchell',
    email: 'analyst@vett.com',
    role: 'analyst',
    password: 'password',
  },
  {
    id: 'analyst-2',
    name: 'Sarah Chen',
    email: 'analyst2@vett.com',
    role: 'analyst',
    password: 'password',
  },
  {
    id: 'senior-1',
    name: 'Robert Graves',
    email: 'senior@vett.com',
    role: 'senior_analyst',
    password: 'password',
  },
];

export const DEFAULT_MILESTONES: Milestone[] = [
  { id: 'm1', title: 'MVP Launch', completed: false, trancheAmount: 50000, approved: false },
  { id: 'm2', title: 'First 100 Users', completed: false, trancheAmount: 75000, approved: false },
  { id: 'm3', title: 'Revenue Target Met', completed: false, trancheAmount: 100000, approved: false },
  { id: 'm4', title: 'Growth Milestone', completed: false, trancheAmount: 125000, approved: false },
];

export const ANALYSIS_THRESHOLD = 70;