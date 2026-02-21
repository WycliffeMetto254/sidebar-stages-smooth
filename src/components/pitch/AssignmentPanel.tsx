import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { Pitch } from '@/types';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface Props {
  pitch: Pitch;
}

export default function AssignmentPanel({ pitch }: Props) {
  const { user, allUsers } = useAuth();
  const { assignPitch } = useData();
  const [selectedAnalyst, setSelectedAnalyst] = useState('');

  const analysts = allUsers.filter(u => u.role === 'analyst');
  const isSenior = user?.role === 'senior_analyst';

  const handleAssign = () => {
    if (!user || !selectedAnalyst) return;
    assignPitch(pitch.id, selectedAnalyst, user.id);
  };

  if (!isSenior) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground text-sm">
          This pitch is awaiting assignment by a Senior Analyst.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 max-w-md">
      <h3 className="font-semibold">Assign to Analyst</h3>
      <p className="text-sm text-muted-foreground">
        Select an analyst to assign this pitch for validation and due diligence.
      </p>

      <div className="space-y-2">
        <Label>Select Analyst</Label>
        <Select value={selectedAnalyst} onValueChange={setSelectedAnalyst}>
          <SelectTrigger>
            <SelectValue placeholder="Choose an analyst" />
          </SelectTrigger>
          <SelectContent>
            {analysts.map(a => (
              <SelectItem key={a.id} value={a.id}>
                {a.name} ({a.email})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button onClick={handleAssign} disabled={!selectedAnalyst}>
        Assign Pitch
      </Button>
    </div>
  );
}