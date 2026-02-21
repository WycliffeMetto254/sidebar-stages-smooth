import { STAGES, STAGE_LABELS, Stage } from '@/types';
import { Check, Lock } from 'lucide-react';

interface StageTrackerProps {
  currentStage: Stage;
  onStageClick?: (stage: Stage) => void;
}

export default function StageTracker({ currentStage, onStageClick }: StageTrackerProps) {
  const currentIndex = STAGES.indexOf(currentStage);

  return (
    <div className="w-full overflow-x-auto">
      <div className="flex items-center min-w-[640px] px-1">
        {STAGES.map((stage, i) => {
          const isComplete = i < currentIndex;
          const isActive = i === currentIndex;
          const isLocked = i > currentIndex;
          const isClickable = !isLocked && onStageClick;

          return (
            <div key={stage} className="flex items-center flex-1">
              <button
                disabled={isLocked}
                onClick={() => isClickable && onStageClick?.(stage)}
                className={`flex flex-col items-center gap-1.5 w-full transition-colors ${
                  isClickable ? 'cursor-pointer' : isLocked ? 'cursor-not-allowed' : ''
                }`}
              >
                <div
                  className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-medium border-2 transition-colors ${
                    isComplete
                      ? 'bg-stage-complete border-stage-complete text-white'
                      : isActive
                      ? 'bg-stage-active border-stage-active text-white'
                      : 'bg-background border-stage-locked text-muted-foreground'
                  }`}
                >
                  {isComplete ? (
                    <Check className="h-4 w-4" />
                  ) : isLocked ? (
                    <Lock className="h-3 w-3" />
                  ) : (
                    i + 1
                  )}
                </div>
                <span
                  className={`text-[11px] text-center leading-tight ${
                    isActive ? 'font-semibold text-foreground' : 'text-muted-foreground'
                  }`}
                >
                  {STAGE_LABELS[stage]}
                </span>
              </button>
              {i < STAGES.length - 1 && (
                <div
                  className={`h-0.5 flex-1 mx-1 ${
                    i < currentIndex ? 'bg-stage-complete' : 'bg-border'
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}