import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ProblemBankEntry, ForgeTodo, ForgeKPI, LetterOfIntent } from '@/types/forge';
import { MOCK_PROBLEM_BANK, MOCK_FORGE_TODOS, MOCK_FORGE_KPIS, MOCK_LOIS } from '@/data/forgeMockData';

interface ForgeDataContextType {
  problems: ProblemBankEntry[];
  todos: ForgeTodo[];
  kpis: ForgeKPI[];
  lois: LetterOfIntent[];
  claimProblem: (problemId: string, squadId: string) => void;
  toggleTodo: (todoId: string) => void;
  updateKPI: (kpiId: string, newValue: number) => void;
  addLOI: (loi: Omit<LetterOfIntent, 'id'>) => void;
  verifyLOI: (loiId: string) => void;
}

const ForgeDataContext = createContext<ForgeDataContextType | null>(null);

export function useForgeData() {
  const ctx = useContext(ForgeDataContext);
  if (!ctx) throw new Error('useForgeData must be used within ForgeDataProvider');
  return ctx;
}

export function ForgeDataProvider({ children }: { children: ReactNode }) {
  const [problems, setProblems] = useState<ProblemBankEntry[]>(() => {
    const s = localStorage.getItem('forge_problems');
    return s ? JSON.parse(s) : [...MOCK_PROBLEM_BANK];
  });
  const [todos, setTodos] = useState<ForgeTodo[]>(() => {
    const s = localStorage.getItem('forge_todos');
    return s ? JSON.parse(s) : [...MOCK_FORGE_TODOS];
  });
  const [kpis, setKPIs] = useState<ForgeKPI[]>(() => {
    const s = localStorage.getItem('forge_kpis');
    return s ? JSON.parse(s) : [...MOCK_FORGE_KPIS];
  });
  const [lois, setLOIs] = useState<LetterOfIntent[]>(() => {
    const s = localStorage.getItem('forge_lois');
    return s ? JSON.parse(s) : [...MOCK_LOIS];
  });

  useEffect(() => { localStorage.setItem('forge_problems', JSON.stringify(problems)); }, [problems]);
  useEffect(() => { localStorage.setItem('forge_todos', JSON.stringify(todos)); }, [todos]);
  useEffect(() => { localStorage.setItem('forge_kpis', JSON.stringify(kpis)); }, [kpis]);
  useEffect(() => { localStorage.setItem('forge_lois', JSON.stringify(lois)); }, [lois]);

  const claimProblem = (problemId: string, squadId: string) => {
    setProblems(prev => prev.map(p =>
      p.id === problemId ? { ...p, status: 'claimed' as const, claimedBySquadId: squadId } : p
    ));
  };

  const toggleTodo = (todoId: string) => {
    setTodos(prev => prev.map(t =>
      t.id === todoId ? { ...t, completed: !t.completed } : t
    ));
  };

  const updateKPI = (kpiId: string, newValue: number) => {
    setKPIs(prev => prev.map(k =>
      k.id === kpiId ? { ...k, current: newValue } : k
    ));
  };

  const addLOI = (loi: Omit<LetterOfIntent, 'id'>) => {
    setLOIs(prev => [...prev, { ...loi, id: `loi-${Date.now()}` }]);
  };

  const verifyLOI = (loiId: string) => {
    setLOIs(prev => prev.map(l =>
      l.id === loiId ? { ...l, verified: true } : l
    ));
  };

  return (
    <ForgeDataContext.Provider value={{ problems, todos, kpis, lois, claimProblem, toggleTodo, updateKPI, addLOI, verifyLOI }}>
      {children}
    </ForgeDataContext.Provider>
  );
}
