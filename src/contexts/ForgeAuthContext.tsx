import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { SquadMember, Squad } from '@/types/forge';
import { MOCK_SQUAD_MEMBERS, MOCK_SQUADS } from '@/data/forgeMockData';

interface ForgeAuthContextType {
  member: Omit<SquadMember, 'password'> | null;
  squad: Squad | null;
  allSquads: Squad[];
  login: (email: string, password: string) => string | null;
  registerSquad: (squadName: string, members: Omit<SquadMember, 'id' | 'squadId'>[]) => string | null;
  logout: () => void;
}

const ForgeAuthContext = createContext<ForgeAuthContextType | null>(null);

export function useForgeAuth() {
  const ctx = useContext(ForgeAuthContext);
  if (!ctx) throw new Error('useForgeAuth must be used within ForgeAuthProvider');
  return ctx;
}

export function ForgeAuthProvider({ children }: { children: ReactNode }) {
  const [members, setMembers] = useState<SquadMember[]>(() => {
    const stored = localStorage.getItem('forge_members');
    if (stored) {
      const saved = JSON.parse(stored) as Omit<SquadMember, 'password'>[];
      return saved.map(s => {
        const mock = MOCK_SQUAD_MEMBERS.find(m => m.id === s.id);
        return { ...s, password: mock?.password ?? '' } as SquadMember;
      });
    }
    return [...MOCK_SQUAD_MEMBERS];
  });

  const [squads, setSquads] = useState<Squad[]>(() => {
    const stored = localStorage.getItem('forge_squads');
    return stored ? JSON.parse(stored) : [...MOCK_SQUADS];
  });

  const [member, setMember] = useState<Omit<SquadMember, 'password'> | null>(() => {
    const stored = localStorage.getItem('forge_current_member');
    return stored ? JSON.parse(stored) : null;
  });

  useEffect(() => {
    const safe = members.map(({ password, ...u }) => u);
    localStorage.setItem('forge_members', JSON.stringify(safe));
  }, [members]);

  useEffect(() => {
    localStorage.setItem('forge_squads', JSON.stringify(squads));
  }, [squads]);

  useEffect(() => {
    if (member) localStorage.setItem('forge_current_member', JSON.stringify(member));
    else localStorage.removeItem('forge_current_member');
  }, [member]);

  const login = (email: string, password: string): string | null => {
    const found = members.find(m => m.email === email && m.password === password);
    if (!found) return 'Invalid email or password';
    const { password: _, ...safe } = found;
    setMember(safe);
    return null;
  };

  const registerSquad = (squadName: string, newMembers: Omit<SquadMember, 'id' | 'squadId'>[]): string | null => {
    if (newMembers.length < 3 || newMembers.length > 5) return 'A squad needs 3-5 members';
    if (squads.some(s => s.name.toLowerCase() === squadName.toLowerCase())) return 'Squad name already taken';

    const squadId = `squad-${Date.now()}`;
    const createdMembers: SquadMember[] = newMembers.map((m, i) => ({
      ...m,
      id: `sm-${Date.now()}-${i}`,
      squadId,
    }));

    const newSquad: Squad = {
      id: squadId,
      name: squadName,
      members: createdMembers,
      selectedProblemId: null,
      forgeStartDate: new Date().toISOString(),
      forgeDay: 1,
    };

    setMembers(prev => [...prev, ...createdMembers]);
    setSquads(prev => [...prev, newSquad]);

    const { password: _, ...safe } = createdMembers[0];
    setMember(safe);
    return null;
  };

  const logout = () => setMember(null);

  const squad = member ? squads.find(s => s.id === member.squadId) ?? null : null;

  return (
    <ForgeAuthContext.Provider value={{ member, squad, allSquads: squads, login, registerSquad, logout }}>
      {children}
    </ForgeAuthContext.Provider>
  );
}
