import { AnalysisScores } from '@/types';
import { ANALYSIS_THRESHOLD } from '@/data/mockData';

interface Props {
  scores: AnalysisScores;
  passed: boolean;
}

const SCORE_LABELS: Record<keyof Omit<AnalysisScores, 'overall'>, string> = {
  problemClarity: 'Problem Clarity',
  marketViability: 'Market Viability',
  feasibility: 'Feasibility',
  revenueLogic: 'Revenue Logic',
  executionReadiness: 'Execution Readiness',
};

export default function AIAnalysisPanel({ scores, passed }: Props) {
  const entries = Object.entries(SCORE_LABELS) as [keyof typeof SCORE_LABELS, string][];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">AI Analysis Results</h3>
        <div
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            passed
              ? 'bg-success/10 text-success'
              : 'bg-destructive/10 text-destructive'
          }`}
        >
          {passed ? 'Passed' : 'Below Threshold'}
        </div>
      </div>

      <div className="grid gap-3">
        {entries.map(([key, label]) => {
          const value = scores[key];
          const barColor = value >= ANALYSIS_THRESHOLD ? 'bg-stage-complete' : value >= 60 ? 'bg-warning' : 'bg-destructive';
          return (
            <div key={key} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span>{label}</span>
                <span className="font-medium">{value}/100</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className={`h-full rounded-full transition-all ${barColor}`} style={{ width: `${value}%` }} />
              </div>
            </div>
          );
        })}
      </div>

      <div className="border-t pt-4">
        <div className="flex items-center justify-between">
          <span className="font-semibold">Overall Score</span>
          <span className="text-2xl font-bold">{scores.overall}/100</span>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Threshold for advancement: {ANALYSIS_THRESHOLD}/100
        </p>
      </div>
    </div>
  );
}