import { useForgeAuth } from '@/contexts/ForgeAuthContext';
import { useForgeData } from '@/contexts/ForgeDataContext';
import { FORGE_PHASES, BUSINESS_ROLE_LABELS } from '@/types/forge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Flame, Users, Target, CheckCircle2, FileCheck } from 'lucide-react';

export default function ForgeDashboard() {
  const { member, squad } = useForgeAuth();
  const { problems, todos, kpis, lois } = useForgeData();

  if (!member || !squad) return null;

  const selectedProblem = problems.find(p => p.id === squad.selectedProblemId);
  const squadTodos = todos.filter(t => t.squadId === squad.id);
  const completedTodos = squadTodos.filter(t => t.completed).length;
  const myKPIs = kpis.filter(k => k.memberId === member.id);
  const squadLOIs = lois.filter(l => l.squadId === squad.id);
  const currentPhase = FORGE_PHASES.find((p) => {
    const [start, end] = p.days.split('-').map(Number);
    return squad.forgeDay >= start && squad.forgeDay <= end;
  }) ?? FORGE_PHASES[0];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Flame className="h-8 w-8 text-orange-500" />
        <div>
          <h1 className="text-2xl font-bold">Welcome back, {member.name}</h1>
          <p className="text-muted-foreground text-sm">{BUSINESS_ROLE_LABELS[member.businessRole]} — {squad.name}</p>
        </div>
      </div>

      {/* Forge Phase Progress */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Forge Progress — Day {squad.forgeDay} of 90</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Progress value={(squad.forgeDay / 90) * 100} className="h-2" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {FORGE_PHASES.map((phase) => {
              const [start, end] = phase.days.split('-').map(Number);
              const isActive = squad.forgeDay >= start && squad.forgeDay <= end;
              const isDone = squad.forgeDay > end;
              return (
                <div key={phase.label} className={`p-3 rounded-lg border text-xs ${isActive ? 'border-orange-400 bg-orange-50' : isDone ? 'border-green-300 bg-green-50' : 'border-border'}`}>
                  <p className="font-semibold">{phase.label}</p>
                  <p className="text-muted-foreground">Days {phase.days}</p>
                  {isActive && <Badge variant="secondary" className="mt-1 text-[10px]">Current</Badge>}
                  {isDone && <Badge className="mt-1 text-[10px] bg-green-600">Complete</Badge>}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Target className="h-8 w-8 text-orange-500" />
              <div>
                <p className="text-2xl font-bold">{selectedProblem ? '1' : '0'}</p>
                <p className="text-xs text-muted-foreground">Problem Selected</p>
              </div>
            </div>
            {selectedProblem && <p className="mt-2 text-xs truncate">{selectedProblem.title}</p>}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{completedTodos}/{squadTodos.length}</p>
                <p className="text-xs text-muted-foreground">To-Do's Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{squad.members.length}</p>
                <p className="text-xs text-muted-foreground">Squad Members</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <FileCheck className="h-8 w-8 text-purple-500" />
              <div>
                <p className="text-2xl font-bold">{squadLOIs.length}</p>
                <p className="text-xs text-muted-foreground">Letters of Intent</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* My KPIs snapshot */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Your KPIs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {myKPIs.map(kpi => (
              <div key={kpi.id} className="flex items-center justify-between">
                <span className="text-sm">{kpi.metric}</span>
                <div className="flex items-center gap-3 w-48">
                  <Progress value={(kpi.current / kpi.target) * 100} className="h-2 flex-1" />
                  <span className="text-xs text-muted-foreground w-16 text-right">{kpi.current}/{kpi.target}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Current phase description */}
      <Card className="border-orange-200 bg-orange-50/50">
        <CardContent className="pt-6">
          <h3 className="font-semibold text-sm mb-1">{currentPhase.label} Phase (Days {currentPhase.days})</h3>
          <p className="text-sm text-muted-foreground">{currentPhase.description}</p>
        </CardContent>
      </Card>
    </div>
  );
}
