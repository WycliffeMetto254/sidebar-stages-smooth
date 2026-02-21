import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { useNavigate } from 'react-router-dom';
import { STAGE_LABELS } from '@/types';
import { Badge } from '@/components/ui/badge';

export default function PitchesPage() {
  const { user } = useAuth();
  const { pitches } = useData();
  const navigate = useNavigate();

  if (!user) return null;

  const visible =
    user.role === 'founder'
      ? pitches.filter(p => p.founderId === user.id)
      : user.role === 'analyst'
      ? pitches.filter(p => p.assignedAnalystId === user.id)
      : pitches;

  return (
    <div className="space-y-4 max-w-5xl">
      <h1 className="text-xl font-semibold">Pitches</h1>
      {visible.length === 0 ? (
        <p className="text-sm text-muted-foreground">No pitches to display.</p>
      ) : (
        <div className="border rounded-md divide-y">
          {visible.map(p => (
            <div
              key={p.id}
              className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => navigate(`/pitch/${p.id}`)}
            >
              <div className="min-w-0 flex-1">
                <p className="font-medium text-sm">{p.companyName}</p>
                <p className="text-xs text-muted-foreground truncate">{p.tagline}</p>
              </div>
              <Badge variant="outline">{STAGE_LABELS[p.stage]}</Badge>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}