import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { Pitch } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, DollarSign, Lock } from 'lucide-react';

interface Props {
  pitch: Pitch;
}

export default function FundingPanel({ pitch }: Props) {
  const { user } = useAuth();
  const { completeMilestone, approveMilestone } = useData();

  const isFounder = user?.role === 'founder' && user.id === pitch.founderId;
  const isSenior = user?.role === 'senior_analyst';
  const totalFunding = pitch.milestones.reduce((s, m) => s + m.trancheAmount, 0);
  const released = totalFunding - pitch.escrowBalance;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Funding & Milestones</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="Total Funding" value={`$${totalFunding.toLocaleString()}`} />
        <StatCard label="In Escrow" value={`$${pitch.escrowBalance.toLocaleString()}`} />
        <StatCard label="Released" value={`$${released.toLocaleString()}`} />
      </div>

      <div className="space-y-3">
        <h4 className="text-sm font-medium">Milestone Tracker</h4>
        <div className="space-y-2">
          {pitch.milestones.map((m) => (
            <div key={m.id} className="border rounded-md p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                  m.approved ? 'bg-success/10' : m.completed ? 'bg-warning/10' : 'bg-muted'
                }`}>
                  {m.approved ? (
                    <Check className="h-4 w-4 text-success" />
                  ) : m.completed ? (
                    <DollarSign className="h-4 w-4 text-warning" />
                  ) : (
                    <Lock className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium">{m.title}</p>
                  <p className="text-xs text-muted-foreground">
                    Tranche: ${m.trancheAmount.toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {m.approved ? (
                  <Badge className="bg-success/10 text-success">Released</Badge>
                ) : m.completed ? (
                  <>
                    <Badge variant="outline" className="bg-warning/10 text-warning">Awaiting Approval</Badge>
                    {isSenior && (
                      <Button size="sm" onClick={() => approveMilestone(pitch.id, m.id)}>
                        Approve & Release
                      </Button>
                    )}
                  </>
                ) : (
                  <>
                    <Badge variant="outline">Pending</Badge>
                    {isFounder && (
                      <Button size="sm" variant="outline" onClick={() => completeMilestone(pitch.id, m.id)}>
                        Mark Complete
                      </Button>
                    )}
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="border rounded-md p-4">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-xl font-semibold mt-1">{value}</p>
    </div>
  );
}