import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { useNavigate } from 'react-router-dom';
import { STAGE_LABELS } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, FileText, Users, TrendingUp } from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const { pitches } = useData();
  const navigate = useNavigate();

  if (!user) return null;

  const myPitches =
    user.role === 'founder'
      ? pitches.filter(p => p.founderId === user.id)
      : user.role === 'analyst'
      ? pitches.filter(p => p.assignedAnalystId === user.id)
      : pitches;

  const awaitingAssignment = pitches.filter(p => p.stage === 'awaiting_assignment');

  const stageBadgeVariant = (stage: string) => {
    if (['funding', 'bootcamp'].includes(stage)) return 'default' as const;
    if (stage === 'awaiting_assignment') return 'secondary' as const;
    return 'outline' as const;
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Welcome, {user.name}</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {user.role === 'founder' && 'Manage your venture pitches and track progress.'}
            {user.role === 'analyst' && 'Review and validate assigned pitches.'}
            {user.role === 'senior_analyst' && 'Oversee all pitches and manage assignments.'}
          </p>
        </div>
        {user.role === 'founder' && (
          <Button onClick={() => navigate('/pitch/new')}>
            <Plus className="h-4 w-4 mr-2" />
            New Pitch
          </Button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-semibold">{myPitches.length}</p>
              <p className="text-xs text-muted-foreground">
                {user.role === 'founder' ? 'My Pitches' : user.role === 'analyst' ? 'Assigned' : 'Total Pitches'}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="h-10 w-10 rounded-md bg-success/10 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-2xl font-semibold">
                {myPitches.filter(p => ['funding', 'bootcamp'].includes(p.stage)).length}
              </p>
              <p className="text-xs text-muted-foreground">Active Ventures</p>
            </div>
          </CardContent>
        </Card>
        {user.role === 'senior_analyst' && (
          <Card>
            <CardContent className="flex items-center gap-3 p-4">
              <div className="h-10 w-10 rounded-md bg-warning/10 flex items-center justify-center">
                <Users className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-semibold">{awaitingAssignment.length}</p>
                <p className="text-xs text-muted-foreground">Awaiting Assignment</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Senior Analyst: Awaiting Assignment */}
      {user.role === 'senior_analyst' && awaitingAssignment.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Pitches Awaiting Assignment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="divide-y">
              {awaitingAssignment.map(p => (
                <div key={p.id} className="flex items-center justify-between py-3">
                  <div>
                    <p className="font-medium text-sm">{p.companyName}</p>
                    <p className="text-xs text-muted-foreground">{p.tagline}</p>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => navigate(`/pitch/${p.id}`)}>
                    Assign
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pitch List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            {user.role === 'founder' ? 'My Pitches' : user.role === 'analyst' ? 'Assigned Pitches' : 'All Pitches'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {myPitches.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">
              {user.role === 'founder' ? 'No pitches yet. Create your first pitch to get started.' : 'No pitches assigned yet.'}
            </p>
          ) : (
            <div className="divide-y">
              {myPitches.map(p => (
                <div
                  key={p.id}
                  className="flex items-center justify-between py-3 cursor-pointer hover:bg-muted/50 -mx-4 px-4 transition-colors"
                  onClick={() => navigate(`/pitch/${p.id}`)}
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-sm">{p.companyName}</p>
                    <p className="text-xs text-muted-foreground truncate">{p.tagline}</p>
                  </div>
                  <Badge variant={stageBadgeVariant(p.stage)}>
                    {STAGE_LABELS[p.stage]}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}