import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Role, ROLE_LABELS } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

export default function LoginPage() {
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [role, setRole] = useState<Role>('founder');
  const [name, setName] = useState('');
  const [email, setEmail] = useState(() => localStorage.getItem('vett_remember_email') || '');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(!!localStorage.getItem('vett_remember_email'));
  const [error, setError] = useState('');

  // Restore remembered role
  useState(() => {
    const savedRole = localStorage.getItem('vett_remember_role') as Role | null;
    if (savedRole) setRole(savedRole);
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (rememberMe) {
      localStorage.setItem('vett_remember_email', email);
      localStorage.setItem('vett_remember_role', role);
    } else {
      localStorage.removeItem('vett_remember_email');
      localStorage.removeItem('vett_remember_role');
    }

    if (mode === 'register') {
      const err = register(name, email, password);
      if (err) { setError(err); return; }
    } else {
      const err = login(email, password, role);
      if (err) { setError(err); return; }
    }

    navigate('/dashboard');
  };

  const canRegister = role === 'founder';

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Vett & Venture</CardTitle>
          <CardDescription>Venture Operations Platform</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Role</Label>
              <Select value={role} onValueChange={(v: Role) => { setRole(v); setMode('login'); setError(''); }}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="founder">Founder</SelectItem>
                  <SelectItem value="analyst">Analyst</SelectItem>
                  <SelectItem value="senior_analyst">Senior Analyst</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {canRegister && (
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={mode === 'login' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => { setMode('login'); setError(''); }}
                  className="flex-1"
                >
                  Sign In
                </Button>
                <Button
                  type="button"
                  variant={mode === 'register' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => { setMode('register'); setError(''); }}
                  className="flex-1"
                >
                  Register
                </Button>
              </div>
            )}

            {!canRegister && (
              <p className="text-xs text-muted-foreground bg-muted p-2 rounded">
                {ROLE_LABELS[role]} accounts are pre-registered. Contact your administrator for access.
              </p>
            )}

            {mode === 'register' && (
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" value={name} onChange={e => setName(e.target.value)} required />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                id="remember"
                checked={rememberMe}
                onCheckedChange={(c) => setRememberMe(!!c)}
              />
              <Label htmlFor="remember" className="text-sm font-normal cursor-pointer">Remember me</Label>
            </div>

            {error && (
              <p className="text-sm text-destructive bg-destructive/10 p-2 rounded">{error}</p>
            )}

            <Button type="submit" className="w-full">
              {mode === 'register' ? 'Create Account' : 'Sign In'}
            </Button>

            {role !== 'founder' && (
              <div className="text-xs text-muted-foreground space-y-1 border-t pt-3">
                <p className="font-medium">Demo credentials:</p>
                <p>Analyst: analyst@vett.com / password</p>
                <p>Senior Analyst: senior@vett.com / password</p>
              </div>
            )}
          </form>
          <div className="mt-4 text-center border-t pt-4">
            <a href="/forge" className="text-sm text-primary hover:underline font-medium">
              🔥 Student Squad? Enter The Forge →
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}