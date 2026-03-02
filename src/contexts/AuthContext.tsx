import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Role } from '@/types';
import { MOCK_USERS } from '@/data/mockData';

interface AuthState {
  user: Omit<User, 'password'> | null;
  login: (email: string, password: string, role: Role) => string | null;
  register: (name: string, email: string, password: string) => string | null;
  logout: () => void;
  allUsers: Omit<User, 'password'>[];
}

const AuthContext = createContext<AuthState | null>(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  // Passwords are kept only in memory, never persisted to localStorage
  const [users, setUsers] = useState<User[]>(() => {
    const stored = localStorage.getItem('vett_users');
    if (stored) {
      const savedUsers: Omit<User, 'password'>[] = JSON.parse(stored);
      // Merge saved users with mock passwords (mock users only)
      return savedUsers.map(su => {
        const mock = MOCK_USERS.find(m => m.id === su.id);
        return { ...su, password: mock?.password ?? '' } as User;
      });
    }
    return [...MOCK_USERS];
  });

  const [user, setUser] = useState<Omit<User, 'password'> | null>(() => {
    const stored = localStorage.getItem('vett_session');
    return stored ? JSON.parse(stored) : null;
  });

  // Store users WITHOUT passwords in localStorage
  useEffect(() => {
    const safeUsers = users.map(({ password, ...u }) => u);
    localStorage.setItem('vett_users', JSON.stringify(safeUsers));
  }, [users]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('vett_session', JSON.stringify(user));
    } else {
      localStorage.removeItem('vett_session');
    }
  }, [user]);

  const login = (email: string, password: string, role: Role): string | null => {
    const found = users.find(u => u.email === email && u.role === role);
    if (!found) {
      if (role === 'founder') return 'No founder account found. Please register first.';
      return 'Account not found in system. Analysts must be pre-registered.';
    }
    if (found.password !== password) return 'Invalid password.';
    const { password: _, ...safe } = found;
    setUser(safe);
    return null;
  };

  const register = (name: string, email: string, password: string): string | null => {
    if (users.find(u => u.email === email)) return 'Email already exists.';
    if (!name.trim()) return 'Name is required.';
    if (!email.trim()) return 'Email is required.';
    if (password.length < 6) return 'Password must be at least 6 characters.';
    const newUser: User = {
      id: `founder-${Date.now()}`,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      role: 'founder',
      password,
    };
    setUsers(prev => [...prev, newUser]);
    const { password: _, ...safe } = newUser;
    setUser(safe);
    return null;
  };

  const logout = () => setUser(null);

  const allUsers = users.map(({ password, ...u }) => u);

  return (
    <AuthContext.Provider value={{ user, login, register, logout, allUsers }}>
      {children}
    </AuthContext.Provider>
  );
}