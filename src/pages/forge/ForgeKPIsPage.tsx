import { useState } from 'react';
import { useForgeAuth } from '@/contexts/ForgeAuthContext';
import { useForgeData } from '@/contexts/ForgeDataContext';
import { BUSINESS_ROLE_LABELS } from '@/types/forge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function ForgeKPIsPage() {
  const { member, squad } = useForgeAuth();
  const { kpis, updateKPI } = useForgeData();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  if (!member || !squad) return null;

  const myKPIs = kpis.filter(k => k.memberId === member.id);
  const squadKPIs = kpis.filter(k => k.squadId === squad.id);

  const handleSave = (kpiId: string) => {
    const val = parseInt(editValue);
    if (!isNaN(val) && val >= 0) updateKPI(kpiId, val);
    setEditingId(null);
  };

  const renderKPI = (kpi: typeof kpis[0], editable: boolean) => {
    const pct = Math.min(100, (kpi.current / kpi.target) * 100);
    return (
      <div key={kpi.id} className="flex items-center justify-between gap-4 py-3 border-b last:border-0">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium">{kpi.metric}</p>
          <div className="flex items-center gap-3 mt-1">
            <Progress value={pct} className="h-2 flex-1" />
            {editingId === kpi.id ? (
              <div className="flex items-center gap-1">
                <Input
                  type="number"
                  value={editValue}
                  onChange={e => setEditValue(e.target.value)}
                  className="w-16 h-7 text-xs"
                  min={0}
                  autoFocus
                  onKeyDown={e => e.key === 'Enter' && handleSave(kpi.id)}
                />
                <span className="text-xs text-muted-foreground">/ {kpi.target}</span>
                <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => handleSave(kpi.id)}>Save</Button>
              </div>
            ) : (
              <div className="flex items-center gap-1">
                <span className="text-xs font-medium w-16 text-right">{kpi.current}/{kpi.target} {kpi.unit}</span>
                {editable && (
                  <Button size="sm" variant="ghost" className="h-6 text-[10px]" onClick={() => { setEditingId(kpi.id); setEditValue(String(kpi.current)); }}>
                    Update
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">KPI Tracker</h1>
        <p className="text-muted-foreground text-sm">Track individual performance metrics across your forge journey.</p>
      </div>

      <Tabs defaultValue="mine">
        <TabsList>
          <TabsTrigger value="mine">My KPIs</TabsTrigger>
          <TabsTrigger value="squad">Squad KPIs</TabsTrigger>
        </TabsList>

        <TabsContent value="mine" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">{member.name} — {BUSINESS_ROLE_LABELS[member.businessRole]}</CardTitle>
            </CardHeader>
            <CardContent>
              {myKPIs.map(k => renderKPI(k, true))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="squad" className="mt-4 space-y-4">
          {squad.members.map(m => {
            const mKPIs = squadKPIs.filter(k => k.memberId === m.id);
            if (mKPIs.length === 0) return null;
            return (
              <Card key={m.id}>
                <CardHeader>
                  <CardTitle className="text-sm">{m.name} — {BUSINESS_ROLE_LABELS[m.businessRole]}</CardTitle>
                </CardHeader>
                <CardContent>
                  {mKPIs.map(k => renderKPI(k, m.id === member.id))}
                </CardContent>
              </Card>
            );
          })}
        </TabsContent>
      </Tabs>
    </div>
  );
}
