import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function PitchCreatePage() {
  const { user } = useAuth();
  const { createPitch } = useData();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    companyName: '',
    tagline: '',
    problem: '',
    solution: '',
    marketSize: '',
    businessModel: '',
    team: '',
  });

  const set = (key: string, val: string) => setForm(prev => ({ ...prev, [key]: val }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const id = createPitch({ ...form, founderId: user.id });
    navigate(`/pitch/${id}`);
  };

  const fields: { key: keyof typeof form; label: string; type: 'input' | 'textarea'; placeholder: string }[] = [
    { key: 'companyName', label: 'Company Name', type: 'input', placeholder: 'Enter company name' },
    { key: 'tagline', label: 'Tagline', type: 'input', placeholder: 'One-line description of your venture' },
    { key: 'problem', label: 'Problem', type: 'textarea', placeholder: 'Describe the problem you are solving' },
    { key: 'solution', label: 'Solution', type: 'textarea', placeholder: 'Describe your proposed solution' },
    { key: 'marketSize', label: 'Market Size', type: 'textarea', placeholder: 'Total addressable market and growth potential' },
    { key: 'businessModel', label: 'Business Model', type: 'textarea', placeholder: 'How will you generate revenue?' },
    { key: 'team', label: 'Team', type: 'textarea', placeholder: 'Key team members and their backgrounds' },
  ];

  return (
    <div className="max-w-3xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Create Pitch Deck</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            {fields.map(f => (
              <div key={f.key} className="space-y-1.5">
                <Label htmlFor={f.key}>{f.label}</Label>
                {f.type === 'input' ? (
                  <Input
                    id={f.key}
                    value={form[f.key]}
                    onChange={e => set(f.key, e.target.value)}
                    placeholder={f.placeholder}
                    required
                  />
                ) : (
                  <Textarea
                    id={f.key}
                    value={form[f.key]}
                    onChange={e => set(f.key, e.target.value)}
                    placeholder={f.placeholder}
                    rows={3}
                    required
                  />
                )}
              </div>
            ))}
            <div className="flex gap-3 pt-2">
              <Button type="submit">Create Pitch</Button>
              <Button type="button" variant="outline" onClick={() => navigate('/dashboard')}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}