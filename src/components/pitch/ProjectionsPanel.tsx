import { Pitch } from '@/types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface Props {
  pitch: Pitch;
}

export default function ProjectionsPanel({ pitch }: Props) {
  const scores = pitch.analysisScores;
  const milestones = pitch.milestones;
  const totalFunding = milestones.reduce((s, m) => s + m.trancheAmount, 0);
  const released = totalFunding - pitch.escrowBalance;
  const completedMilestones = milestones.filter(m => m.approved).length;

  const scoreData = scores
    ? [
        { name: 'Problem', value: scores.problemClarity },
        { name: 'Market', value: scores.marketViability },
        { name: 'Feasibility', value: scores.feasibility },
        { name: 'Revenue', value: scores.revenueLogic },
        { name: 'Execution', value: scores.executionReadiness },
      ]
    : [];

  const bootcampComplete = pitch.bootcampProgress.length > 0
    ? Math.round((pitch.bootcampProgress.filter(d => d.completed).length / pitch.bootcampProgress.length) * 100)
    : 0;

  return (
    <div className="space-y-6">
      <h3 className="font-semibold">Projections & Progress</h3>

      {scores && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium">AI Analysis Scores</h4>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={scoreData}>
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {scoreData.map((entry, i) => (
                    <Cell key={i} fill={entry.value >= 70 ? 'hsl(142 71% 45%)' : entry.value >= 60 ? 'hsl(38 92% 50%)' : 'hsl(0 72% 51%)'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <MetricCard label="Overall Score" value={scores ? `${scores.overall}/100` : 'N/A'} />
        <MetricCard label="Bootcamp Progress" value={`${bootcampComplete}%`} />
        <MetricCard label="Milestones Completed" value={`${completedMilestones}/${milestones.length}`} />
        <MetricCard label="Capital Released" value={`$${released.toLocaleString()}`} />
        <MetricCard label="Escrow Balance" value={`$${pitch.escrowBalance.toLocaleString()}`} />
        <MetricCard label="Total Funding" value={`$${totalFunding.toLocaleString()}`} />
      </div>

      {milestones.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Milestone Progress</h4>
          <div className="space-y-1.5">
            {milestones.map(m => (
              <div key={m.id} className="flex items-center gap-3 text-sm">
                <div className={`h-2.5 w-2.5 rounded-full ${m.approved ? 'bg-success' : m.completed ? 'bg-warning' : 'bg-muted-foreground/30'}`} />
                <span className="flex-1">{m.title}</span>
                <span className="text-muted-foreground">${m.trancheAmount.toLocaleString()}</span>
                <span className={`text-xs ${m.approved ? 'text-success' : m.completed ? 'text-warning' : 'text-muted-foreground'}`}>
                  {m.approved ? 'Released' : m.completed ? 'Pending' : 'Locked'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="border rounded-md p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-lg font-semibold mt-0.5">{value}</p>
    </div>
  );
}