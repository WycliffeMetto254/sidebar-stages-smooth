import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForgeAuth } from '@/contexts/ForgeAuthContext';
import { BusinessRole, BUSINESS_ROLE_LABELS } from '@/types/forge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Flame, Plus, Trash2 } from 'lucide-react';

interface MemberForm {
  name: string;
  email: string;
  password: string;
  businessRole: BusinessRole;
}

const emptyMember = (): MemberForm => ({ name: '', email: '', password: '', businessRole: 'ceo' });

export default function ForgeLoginPage() {
  const { login, registerSquad } = useForgeAuth();
  const navigate = useNavigate();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [squadName, setSquadName] = useState('');
  const [members, setMembers] = useState<MemberForm[]>([emptyMember(), emptyMember(), emptyMember()]);
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const err = login(email, password);
    if (err) { setError(err); return; }
    navigate('/forge/dashboard');
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!squadName.trim()) { setError('Squad name is required'); return; }

    const roles = members.map(m => m.businessRole);
    const uniqueRoles = new Set(roles);
    if (uniqueRoles.size !== roles.length) { setError('Each member must have a unique business role'); return; }

    for (const m of members) {
      if (!m.name || !m.email || !m.password) { setError('All member fields are required'); return; }
    }

    const err = registerSquad(squadName, members);
    if (err) { setError(err); return; }
    navigate('/forge/dashboard');
  };

  const updateMember = (index: number, field: keyof MemberForm, value: string) => {
    setMembers(prev => prev.map((m, i) => i === index ? { ...m, [field]: value } : m));
  };

  const addMember = () => {
    if (members.length >= 5) return;
    setMembers(prev => [...prev, emptyMember()]);
  };

  const removeMember = (index: number) => {
    if (members.length <= 3) return;
    setMembers(prev => prev.filter((_, i) => i !== index));
  };

  const usedRoles = members.map(m => m.businessRole);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-background to-amber-50 p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Flame className="h-8 w-8 text-orange-500" />
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
              The Forge
            </CardTitle>
          </div>
          <CardDescription>90-Day Venture Building Program</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-6">
            <Button
              type="button"
              variant={mode === 'login' ? 'default' : 'outline'}
              onClick={() => { setMode('login'); setError(''); }}
              className="flex-1"
            >
              Sign In
            </Button>
            <Button
              type="button"
              variant={mode === 'register' ? 'default' : 'outline'}
              onClick={() => { setMode('register'); setError(''); }}
              className="flex-1"
            >
              Register Squad
            </Button>
          </div>

          {mode === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="forge-email">Email</Label>
                <Input id="forge-email" type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="your@email.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="forge-password">Password</Label>
                <Input id="forge-password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
              </div>
              {error && <p className="text-sm text-destructive bg-destructive/10 p-2 rounded">{error}</p>}
              <Button type="submit" className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white">
                Enter The Forge
              </Button>
              <div className="text-xs text-muted-foreground border-t pt-3 space-y-1">
                <p className="font-medium">Demo — Phoenix Squad:</p>
                <p>alice@forge.com / password (CEO)</p>
                <p>brian@forge.com / password (CTO)</p>
              </div>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <Label>Squad Name</Label>
                <Input value={squadName} onChange={e => setSquadName(e.target.value)} placeholder="e.g. Phoenix Squad" required />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-semibold">Members ({members.length}/5)</Label>
                  {members.length < 5 && (
                    <Button type="button" variant="ghost" size="sm" onClick={addMember}>
                      <Plus className="h-4 w-4 mr-1" /> Add
                    </Button>
                  )}
                </div>

                {members.map((m, i) => (
                  <div key={i} className="border rounded-lg p-3 space-y-2 relative">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-muted-foreground">Member {i + 1}</span>
                      {members.length > 3 && (
                        <Button type="button" variant="ghost" size="sm" onClick={() => removeMember(i)}>
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                    <Input placeholder="Full Name" value={m.name} onChange={e => updateMember(i, 'name', e.target.value)} required />
                    <Input placeholder="Email" type="email" value={m.email} onChange={e => updateMember(i, 'email', e.target.value)} required />
                    <Input placeholder="Password" type="password" value={m.password} onChange={e => updateMember(i, 'password', e.target.value)} required />
                    <Select value={m.businessRole} onValueChange={v => updateMember(i, 'businessRole', v)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {(Object.keys(BUSINESS_ROLE_LABELS) as BusinessRole[]).map(role => (
                          <SelectItem key={role} value={role} disabled={usedRoles.includes(role) && m.businessRole !== role}>
                            {BUSINESS_ROLE_LABELS[role]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </div>

              {error && <p className="text-sm text-destructive bg-destructive/10 p-2 rounded">{error}</p>}
              <Button type="submit" className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white">
                Create Squad & Enter The Forge
              </Button>
            </form>
          )}

          <div className="mt-4 text-center">
            <a href="/" className="text-xs text-muted-foreground hover:text-foreground underline">
              ← Back to Vett & Venture platform
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
