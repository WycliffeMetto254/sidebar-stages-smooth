import { BootcampDay } from '@/types';

const dailyTasks: Record<number, string[]> = {
  1: [
    'System architecture review',
    'Infrastructure planning',
    'Load testing strategy',
    'Failure mode analysis',
    'Security audit preparation',
    'Scalability assessment',
    'Architecture sign-off',
  ],
  2: [
    'Cost structure analysis',
    'Revenue model validation',
    'CAC & LTV calculation',
    'Break-even analysis',
    'Pricing strategy review',
    'Margin optimization',
    'Unit economics sign-off',
  ],
  3: [
    'Brand identity workshop',
    'Messaging framework',
    'Channel strategy',
    'Content plan development',
    'Launch sequence planning',
    'Partnership outreach',
    'GTM strategy sign-off',
  ],
  4: [
    'Pitch deck refinement',
    'Financial model review',
    'Investor targeting',
    'Due diligence packet',
    'Term sheet preparation',
    'Mock pitch sessions',
    'Funding readiness sign-off',
  ],
};

const weekTitles = [
  'Architecture & Stress Testing',
  'Unit Economics',
  'Branding & GTM',
  'Funding Gate',
];

export function generateBootcampDays(): BootcampDay[] {
  const days: BootcampDay[] = [];
  for (let week = 1; week <= 4; week++) {
    for (let dayInWeek = 0; dayInWeek < 7; dayInWeek++) {
      days.push({
        day: (week - 1) * 7 + dayInWeek + 1,
        week,
        title: `${weekTitles[week - 1]} — ${dailyTasks[week][dayInWeek]}`,
        completed: false,
      });
    }
  }
  return days;
}