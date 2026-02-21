import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { Pitch } from '@/types';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';

interface Props {
  pitch: Pitch;
}

export default function MeetingPanel({ pitch }: Props) {
  const { user } = useAuth();
  const { updateMeetingAgenda, approveMeeting, rejectMeeting } = useData();
  const meeting = pitch.meetings[0];
  const [editingAgenda, setEditingAgenda] = useState(false);
  const [agendaText, setAgendaText] = useState('');

  if (!meeting) {
    return <p className="text-sm text-muted-foreground">No meeting scheduled yet.</p>;
  }

  const isAssignedAnalyst = user?.id === pitch.assignedAnalystId;
  const canEditAgenda = isAssignedAnalyst && meeting.outcome === 'pending';

  const startEdit = () => {
    setAgendaText(meeting.agenda.join('\n'));
    setEditingAgenda(true);
  };

  const saveAgenda = () => {
    const items = agendaText.split('\n').map(s => s.trim()).filter(Boolean);
    updateMeetingAgenda(pitch.id, meeting.id, items, pitch.founderId);
    setEditingAgenda(false);
  };

  const outcomeColor = {
    pending: 'bg-warning/10 text-warning',
    approved: 'bg-success/10 text-success',
    rejected: 'bg-destructive/10 text-destructive',
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Validation Meeting</h3>
        <Badge variant="outline" className={outcomeColor[meeting.outcome]}>
          {meeting.outcome === 'pending' ? 'Pending' : meeting.outcome === 'approved' ? 'Approved' : 'Rejected'}
        </Badge>
      </div>

      <div className="text-sm text-muted-foreground">
        Scheduled: {new Date(meeting.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium">Agenda</h4>
          {canEditAgenda && !editingAgenda && (
            <Button size="sm" variant="outline" onClick={startEdit}>
              Edit Agenda
            </Button>
          )}
        </div>

        {editingAgenda ? (
          <div className="space-y-2">
            <Textarea
              value={agendaText}
              onChange={e => setAgendaText(e.target.value)}
              rows={8}
              placeholder="One agenda item per line"
            />
            <div className="flex gap-2">
              <Button size="sm" onClick={saveAgenda}>Save</Button>
              <Button size="sm" variant="outline" onClick={() => setEditingAgenda(false)}>Cancel</Button>
            </div>
          </div>
        ) : (
          <ol className="space-y-1.5 text-sm">
            {meeting.agenda.map((item, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-muted-foreground shrink-0">{i + 1}.</span>
                {item}
              </li>
            ))}
          </ol>
        )}
      </div>

      {isAssignedAnalyst && meeting.outcome === 'pending' && (
        <div className="flex gap-2 border-t pt-4">
          <Button onClick={() => approveMeeting(pitch.id, meeting.id)}>
            Approve — Proceed to Due Diligence
          </Button>
          <Button variant="outline" onClick={() => rejectMeeting(pitch.id, meeting.id)}>
            Reject
          </Button>
        </div>
      )}
    </div>
  );
}