import { useState } from 'react';
import { useForgeAuth } from '@/contexts/ForgeAuthContext';
import { useForgeData } from '@/contexts/ForgeDataContext';
import { ProblemBankEntry } from '@/types/forge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Search, MapPin, Users, TrendingUp, AlertTriangle, ExternalLink } from 'lucide-react';

const URGENCY_COLORS: Record<string, string> = {
  low: 'bg-green-100 text-green-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-orange-100 text-orange-800',
  critical: 'bg-red-100 text-red-800',
};

export default function ProblemBankPage() {
  const { squad } = useForgeAuth();
  const { problems, claimProblem } = useForgeData();
  const [search, setSearch] = useState('');
  const [industryFilter, setIndustryFilter] = useState('all');
  const [urgencyFilter, setUrgencyFilter] = useState('all');
  const [selected, setSelected] = useState<ProblemBankEntry | null>(null);

  if (!squad) return null;

  const hasSelectedProblem = squad.selectedProblemId !== null;

  const industries = [...new Set(problems.map(p => p.industry))];

  const filtered = problems.filter(p => {
    if (search && !p.title.toLowerCase().includes(search.toLowerCase()) && !p.description.toLowerCase().includes(search.toLowerCase())) return false;
    if (industryFilter !== 'all' && p.industry !== industryFilter) return false;
    if (urgencyFilter !== 'all' && p.urgencyRating !== urgencyFilter) return false;
    return true;
  });

  const handleClaim = (problemId: string) => {
    claimProblem(problemId, squad.id);
    setSelected(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Problem Bank</h1>
        <p className="text-muted-foreground text-sm">Browse vetted problems and opportunities. Pick one to tackle during your forge phase.</p>
      </div>

      {hasSelectedProblem && (
        <Card className="border-green-300 bg-green-50">
          <CardContent className="pt-4">
            <p className="text-sm font-medium text-green-800">✅ Your squad has selected a problem. Focus on tackling it!</p>
            <p className="text-xs text-green-700 mt-1">{problems.find(p => p.id === squad.selectedProblemId)?.title}</p>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search problems..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={industryFilter} onValueChange={setIndustryFilter}>
          <SelectTrigger className="w-[200px]"><SelectValue placeholder="Industry" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Industries</SelectItem>
            {industries.map(i => <SelectItem key={i} value={i}>{i}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={urgencyFilter} onValueChange={setUrgencyFilter}>
          <SelectTrigger className="w-[160px]"><SelectValue placeholder="Urgency" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Urgency</SelectItem>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="critical">Critical</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Problem Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filtered.map(problem => (
          <Card key={problem.id} className={`cursor-pointer hover:shadow-md transition-shadow ${problem.status === 'claimed' ? 'opacity-60' : ''}`} onClick={() => setSelected(problem)}>
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between gap-2">
                <CardTitle className="text-sm leading-tight">{problem.title}</CardTitle>
                <Badge className={URGENCY_COLORS[problem.urgencyRating]}>{problem.urgencyRating}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-xs text-muted-foreground line-clamp-2">{problem.description}</p>
              <div className="flex flex-wrap gap-2 text-[10px]">
                <span className="flex items-center gap-1 text-muted-foreground"><TrendingUp className="h-3 w-3" />{problem.industry}</span>
                <span className="flex items-center gap-1 text-muted-foreground"><MapPin className="h-3 w-3" />{problem.geographicScope}</span>
                <span className="flex items-center gap-1 text-muted-foreground"><Users className="h-3 w-3" />{problem.targetDemographic.slice(0, 40)}...</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-muted-foreground">By {problem.submittedByName}</span>
                {problem.status === 'claimed' && <Badge variant="secondary" className="text-[10px]">Claimed</Badge>}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <AlertTriangle className="h-8 w-8 mx-auto mb-2" />
          <p>No problems match your filters.</p>
        </div>
      )}

      {/* Detail Dialog */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        {selected && (
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{selected.title}</DialogTitle>
              <DialogDescription>{selected.industry} · {selected.geographicScope}</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 text-sm">
              <div>
                <h4 className="font-semibold mb-1">Description</h4>
                <p className="text-muted-foreground">{selected.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-1">Market Size</h4>
                  <p className="text-muted-foreground">{selected.marketSize}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Urgency</h4>
                  <Badge className={URGENCY_COLORS[selected.urgencyRating]}>{selected.urgencyRating}</Badge>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-1">Target Demographic</h4>
                <p className="text-muted-foreground">{selected.targetDemographic}</p>
              </div>
              <div>
                <h4 className="font-semibold mb-1">Competitor Landscape</h4>
                <p className="text-muted-foreground">{selected.competitorLandscape}</p>
              </div>
              <div>
                <h4 className="font-semibold mb-1">Evidence & Proof</h4>
                <ul className="space-y-1">
                  {selected.evidenceLinks.map((link, i) => (
                    <li key={i} className="flex items-center gap-1 text-muted-foreground">
                      <ExternalLink className="h-3 w-3" /> {link}
                    </li>
                  ))}
                </ul>
              </div>
              <p className="text-xs text-muted-foreground">Submitted by {selected.submittedByName} on {selected.dateSubmitted}</p>
            </div>
            <DialogFooter>
              {!hasSelectedProblem && selected.status === 'available' && (
                <Button onClick={() => handleClaim(selected.id)} className="bg-gradient-to-r from-orange-500 to-amber-500 text-white">
                  Select This Problem
                </Button>
              )}
              {selected.status === 'claimed' && <p className="text-sm text-muted-foreground">This problem has been claimed.</p>}
              {hasSelectedProblem && selected.status === 'available' && <p className="text-sm text-muted-foreground">Your squad already has a problem selected.</p>}
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
