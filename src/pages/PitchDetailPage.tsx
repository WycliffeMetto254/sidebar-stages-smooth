import { useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { STAGES, Stage, STAGE_LABELS } from '@/types';
import { ANALYSIS_THRESHOLD } from '@/data/mockData';
import StageTracker from '@/components/pitch/StageTracker';
import AIAnalysisPanel from '@/components/pitch/AIAnalysisPanel';
import AssignmentPanel from '@/components/pitch/AssignmentPanel';
import MeetingPanel from '@/components/pitch/MeetingPanel';
import DueDiligencePanel from '@/components/pitch/DueDiligencePanel';
import ContractPanel from '@/components/pitch/ContractPanel';
import BootcampPanel from '@/components/pitch/BootcampPanel';
import FundingPanel from '@/components/pitch/FundingPanel';
import ProjectionsPanel from '@/components/pitch/ProjectionsPanel';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';

type TabKey = 'overview' | 'analysis' | 'assignment' | 'meeting' | 'diligence' | 'contract' | 'bootcamp' | 'funding' | 'projections';

const STAGE_TO_TAB: Partial<Record<Stage, TabKey>> = {
  idea: 'overview',
  analysis: 'analysis',
  awaiting_assignment: 'assignment',
  validation: 'meeting',
  diligence: 'diligence',
  contract: 'contract',
  bootcamp: 'bootcamp',
  funding: 'funding',
};

export default function PitchDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { pitches, updatePitchFields, submitForAnalysis } = useData();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const pitch = pitches.find(p => p.id === id);
  const activeTab = (searchParams.get('tab') as TabKey) || 'overview';
  const [analyzing, setAnalyzing] = useState(false);

  if (!pitch) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Pitch not found.</p>
        <Button variant="outline" className="mt-4" onClick={() => navigate('/dashboard')}>
          Back to Dashboard
        </Button>
      </div>
    );
  }

  const currentStageIndex = STAGES.indexOf(pitch.stage);
  const isFounder = user?.role === 'founder' && user.id === pitch.founderId;
  const isEditable = isFounder && pitch.stage === 'idea';

  const handleStageClick = (stage: Stage) => {
    const tab = STAGE_TO_TAB[stage];
    if (tab) {
      setSearchParams({ tab });
    }
  };

  const handleAnalyze = () => {
    setAnalyzing(true);
    setTimeout(() => {
      submitForAnalysis(pitch.id);
      setAnalyzing(false);
      setSearchParams({ tab: 'analysis' });
    }, 1500);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <PitchOverview
            pitch={pitch}
            editable={isEditable}
            onUpdate={(fields) => updatePitchFields(pitch.id, fields)}
            onAnalyze={handleAnalyze}
            analyzing={analyzing}
          />
        );
      case 'analysis':
        return pitch.analysisScores ? (
          <AIAnalysisPanel
            scores={pitch.analysisScores}
            passed={pitch.analysisScores.overall >= ANALYSIS_THRESHOLD}
          />
        ) : (
          <p className="text-sm text-muted-foreground">Submit your pitch for AI analysis first.</p>
        );
      case 'assignment':
        return <AssignmentPanel pitch={pitch} />;
      case 'meeting':
        return <MeetingPanel pitch={pitch} />;
      case 'diligence':
        return <DueDiligencePanel pitch={pitch} />;
      case 'contract':
        return <ContractPanel pitch={pitch} />;
      case 'bootcamp':
        return <BootcampPanel pitch={pitch} />;
      case 'funding':
        return <FundingPanel pitch={pitch} />;
      case 'projections':
        return <ProjectionsPanel pitch={pitch} />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">{pitch.companyName}</h1>
          <p className="text-sm text-muted-foreground">{pitch.tagline}</p>
        </div>
        <span className="text-xs px-3 py-1 rounded-full border font-medium">
          {STAGE_LABELS[pitch.stage]}
        </span>
      </div>

      <Card>
        <CardContent className="py-4">
          <StageTracker currentStage={pitch.stage} onStageClick={handleStageClick} />
        </CardContent>
      </Card>

      <div>
        {renderContent()}
      </div>
    </div>
  );
}

function PitchOverview({
  pitch,
  editable,
  onUpdate,
  onAnalyze,
  analyzing,
}: {
  pitch: import('@/types').Pitch;
  editable: boolean;
  onUpdate: (fields: Partial<import('@/types').Pitch>) => void;
  onAnalyze: () => void;
  analyzing: boolean;
}) {
  const fields: { key: keyof Pick<typeof pitch, 'problem' | 'solution' | 'marketSize' | 'businessModel' | 'team'>; label: string }[] = [
    { key: 'problem', label: 'Problem' },
    { key: 'solution', label: 'Solution' },
    { key: 'marketSize', label: 'Market Size' },
    { key: 'businessModel', label: 'Business Model' },
    { key: 'team', label: 'Team' },
  ];

  return (
    <div className="space-y-5">
      {editable ? (
        <>
          <div className="space-y-1.5">
            <Label>Company Name</Label>
            <Input
              value={pitch.companyName}
              onChange={e => onUpdate({ companyName: e.target.value })}
            />
          </div>
          <div className="space-y-1.5">
            <Label>Tagline</Label>
            <Input
              value={pitch.tagline}
              onChange={e => onUpdate({ tagline: e.target.value })}
            />
          </div>
          {fields.map(f => (
            <div key={f.key} className="space-y-1.5">
              <Label>{f.label}</Label>
              <Textarea
                value={pitch[f.key]}
                onChange={e => onUpdate({ [f.key]: e.target.value })}
                rows={3}
              />
            </div>
          ))}
          <Button onClick={onAnalyze} disabled={analyzing}>
            {analyzing ? 'Analyzing...' : 'Submit for AI Analysis'}
          </Button>
        </>
      ) : (
        <div className="space-y-4">
          {fields.map(f => (
            <div key={f.key}>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">{f.label}</h4>
              <p className="text-sm">{pitch[f.key]}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}