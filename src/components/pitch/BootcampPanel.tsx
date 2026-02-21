import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { Pitch } from '@/types';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';

interface Props {
  pitch: Pitch;
}

const WEEK_TITLES = [
  'Week 1: Architecture & Stress Testing',
  'Week 2: Unit Economics',
  'Week 3: Branding & GTM',
  'Week 4: Funding Gate',
];

export default function BootcampPanel({ pitch }: Props) {
  const { user } = useAuth();
  const { toggleBootcampDay } = useData();

  const days = pitch.bootcampProgress;
  const completedCount = days.filter(d => d.completed).length;
  const progress = days.length > 0 ? Math.round((completedCount / days.length) * 100) : 0;

  const isFounder = user?.role === 'founder' && user.id === pitch.founderId;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">28-Day Bootcamp Program</h3>
        <span className="text-sm text-muted-foreground">{completedCount}/{days.length} days</span>
      </div>

      <Progress value={progress} className="h-2" />

      {progress === 100 && (
        <p className="text-sm text-success font-medium">Bootcamp complete. Funding stage unlocked.</p>
      )}

      <div className="space-y-6">
        {WEEK_TITLES.map((weekTitle, weekIdx) => {
          const weekDays = days.filter(d => d.week === weekIdx + 1);
          const weekComplete = weekDays.filter(d => d.completed).length;
          return (
            <div key={weekIdx} className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium">{weekTitle}</h4>
                <span className="text-xs text-muted-foreground">{weekComplete}/7</span>
              </div>
              <div className="space-y-1">
                {weekDays.map((day) => {
                  const dayIndex = days.findIndex(d => d.day === day.day);
                  return (
                    <label
                      key={day.day}
                      className={`flex items-center gap-3 p-2 rounded text-sm transition-colors ${
                        day.completed ? 'bg-success/5' : 'hover:bg-muted'
                      } ${isFounder ? 'cursor-pointer' : 'cursor-default'}`}
                    >
                      <Checkbox
                        checked={day.completed}
                        onCheckedChange={() => isFounder && toggleBootcampDay(pitch.id, dayIndex)}
                        disabled={!isFounder}
                      />
                      <span className="flex-1">
                        <span className="text-muted-foreground mr-2">Day {day.day}:</span>
                        {day.title}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}