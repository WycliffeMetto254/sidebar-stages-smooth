import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Pitch, AppNotification, Stage, Meeting, DiligenceData } from '@/types';
import { DEFAULT_MILESTONES, ANALYSIS_THRESHOLD } from '@/data/mockData';
import { generateBootcampDays } from '@/data/bootcampStructure';

interface DataState {
  pitches: Pitch[];
  notifications: AppNotification[];
  createPitch: (pitch: Omit<Pitch, 'id' | 'stage' | 'analysisScores' | 'meetings' | 'diligenceData' | 'contractSignedFounder' | 'contractSignedAnalyst' | 'bootcampProgress' | 'milestones' | 'escrowBalance' | 'assignedAnalystId' | 'assignedBySeniorId'>) => string;
  updatePitchFields: (id: string, fields: Partial<Pick<Pitch, 'companyName' | 'tagline' | 'problem' | 'solution' | 'marketSize' | 'businessModel' | 'team'>>) => void;
  submitForAnalysis: (pitchId: string) => void;
  assignPitch: (pitchId: string, analystId: string, seniorId: string) => void;
  updateMeetingAgenda: (pitchId: string, meetingId: string, agenda: string[], founderId: string) => void;
  approveMeeting: (pitchId: string, meetingId: string) => void;
  rejectMeeting: (pitchId: string, meetingId: string) => void;
  submitDiligence: (pitchId: string, data: Omit<DiligenceData, 'verified'>) => void;
  verifyDiligence: (pitchId: string) => void;
  signContract: (pitchId: string, signer: 'founder' | 'analyst') => void;
  toggleBootcampDay: (pitchId: string, dayIndex: number) => void;
  completeMilestone: (pitchId: string, milestoneId: string) => void;
  approveMilestone: (pitchId: string, milestoneId: string) => void;
  markNotificationRead: (notificationId: string) => void;
  getNotificationsForUser: (userId: string) => AppNotification[];
}

const DataContext = createContext<DataState | null>(null);

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be inside DataProvider');
  return ctx;
}

function generateAgenda(pitch: Pitch): string[] {
  return [
    `Review company overview: ${pitch.companyName}`,
    `Discuss problem statement and market opportunity`,
    `Evaluate proposed solution: ${pitch.solution.slice(0, 60)}...`,
    `Analyze business model and revenue projections`,
    `Assess team capabilities and execution readiness`,
    `Review AI analysis scores and address identified gaps`,
    `Define due diligence requirements and next steps`,
  ];
}

export function DataProvider({ children }: { children: ReactNode }) {
  const [pitches, setPitches] = useState<Pitch[]>(() => {
    const stored = localStorage.getItem('vett_pitches');
    return stored ? JSON.parse(stored) : [];
  });

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const stored = localStorage.getItem('vett_notifications');
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem('vett_pitches', JSON.stringify(pitches));
  }, [pitches]);

  useEffect(() => {
    localStorage.setItem('vett_notifications', JSON.stringify(notifications));
  }, [notifications]);

  const addNotification = useCallback((userId: string, message: string, pitchId: string, tab?: string) => {
    setNotifications(prev => [{
      id: `notif-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      userId,
      message,
      pitchId,
      tab,
      read: false,
      createdAt: new Date().toISOString(),
    }, ...prev]);
  }, []);

  const createPitch = (data: Omit<Pitch, 'id' | 'stage' | 'analysisScores' | 'meetings' | 'diligenceData' | 'contractSignedFounder' | 'contractSignedAnalyst' | 'bootcampProgress' | 'milestones' | 'escrowBalance' | 'assignedAnalystId' | 'assignedBySeniorId'>): string => {
    const id = `pitch-${Date.now()}`;
    const pitch: Pitch = {
      ...data,
      id,
      stage: 'idea',
      analysisScores: null,
      meetings: [],
      diligenceData: null,
      contractSignedFounder: false,
      contractSignedAnalyst: false,
      bootcampProgress: [],
      milestones: [],
      escrowBalance: 0,
      assignedAnalystId: null,
      assignedBySeniorId: null,
    };
    setPitches(prev => [...prev, pitch]);
    return id;
  };

  const updatePitchFields = (id: string, fields: Partial<Pick<Pitch, 'companyName' | 'tagline' | 'problem' | 'solution' | 'marketSize' | 'businessModel' | 'team'>>) => {
    setPitches(prev => prev.map(p => p.id === id ? { ...p, ...fields } : p));
  };

  const submitForAnalysis = (pitchId: string) => {
    const scores = {
      problemClarity: Math.floor(Math.random() * 35) + 55,
      marketViability: Math.floor(Math.random() * 35) + 55,
      feasibility: Math.floor(Math.random() * 35) + 55,
      revenueLogic: Math.floor(Math.random() * 35) + 55,
      executionReadiness: Math.floor(Math.random() * 35) + 55,
      overall: 0,
    };
    scores.overall = Math.round(
      (scores.problemClarity + scores.marketViability + scores.feasibility + scores.revenueLogic + scores.executionReadiness) / 5
    );

    setPitches(prev => prev.map(p =>
      p.id === pitchId
        ? {
            ...p,
            analysisScores: scores,
            stage: (scores.overall >= ANALYSIS_THRESHOLD ? 'awaiting_assignment' : 'analysis') as Stage,
          }
        : p
    ));
  };

  const assignPitch = (pitchId: string, analystId: string, seniorId: string) => {
    setPitches(prev => prev.map(p => {
      if (p.id !== pitchId) return p;
      const meeting: Meeting = {
        id: `meeting-${Date.now()}`,
        pitchId,
        agenda: generateAgenda(p),
        outcome: 'pending',
        date: new Date(Date.now() + 7 * 86400000).toISOString(),
      };
      addNotification(p.founderId, `Your pitch "${p.companyName}" has been assigned to an analyst. A validation meeting has been scheduled.`, pitchId, 'meeting');
      return {
        ...p,
        assignedAnalystId: analystId,
        assignedBySeniorId: seniorId,
        stage: 'validation' as Stage,
        meetings: [meeting],
      };
    }));
  };

  const updateMeetingAgenda = (pitchId: string, meetingId: string, agenda: string[], founderId: string) => {
    setPitches(prev => prev.map(p =>
      p.id === pitchId
        ? { ...p, meetings: p.meetings.map(m => m.id === meetingId ? { ...m, agenda } : m) }
        : p
    ));
    addNotification(founderId, 'The meeting agenda for your pitch has been updated.', pitchId, 'meeting');
  };

  const approveMeeting = (pitchId: string, meetingId: string) => {
    setPitches(prev => prev.map(p =>
      p.id === pitchId
        ? {
            ...p,
            stage: 'diligence' as Stage,
            meetings: p.meetings.map(m => m.id === meetingId ? { ...m, outcome: 'approved' as const } : m),
          }
        : p
    ));
  };

  const rejectMeeting = (pitchId: string, meetingId: string) => {
    setPitches(prev => prev.map(p =>
      p.id === pitchId
        ? { ...p, meetings: p.meetings.map(m => m.id === meetingId ? { ...m, outcome: 'rejected' as const } : m) }
        : p
    ));
  };

  const submitDiligence = (pitchId: string, data: Omit<DiligenceData, 'verified'>) => {
    setPitches(prev => prev.map(p =>
      p.id === pitchId ? { ...p, diligenceData: { ...data, verified: false } } : p
    ));
  };

  const verifyDiligence = (pitchId: string) => {
    setPitches(prev => prev.map(p =>
      p.id === pitchId && p.diligenceData
        ? { ...p, diligenceData: { ...p.diligenceData, verified: true }, stage: 'contract' as Stage }
        : p
    ));
  };

  const signContract = (pitchId: string, signer: 'founder' | 'analyst') => {
    setPitches(prev => prev.map(p => {
      if (p.id !== pitchId) return p;
      const updated = { ...p };
      if (signer === 'founder') updated.contractSignedFounder = true;
      if (signer === 'analyst') updated.contractSignedAnalyst = true;
      if (updated.contractSignedFounder && updated.contractSignedAnalyst) {
        updated.stage = 'bootcamp';
        updated.bootcampProgress = generateBootcampDays();
        updated.milestones = JSON.parse(JSON.stringify(DEFAULT_MILESTONES));
        updated.escrowBalance = DEFAULT_MILESTONES.reduce((s, m) => s + m.trancheAmount, 0);
      }
      return updated;
    }));
  };

  const toggleBootcampDay = (pitchId: string, dayIndex: number) => {
    setPitches(prev => prev.map(p => {
      if (p.id !== pitchId) return p;
      const progress = p.bootcampProgress.map((d, i) =>
        i === dayIndex ? { ...d, completed: !d.completed } : d
      );
      const allDone = progress.every(d => d.completed);
      return { ...p, bootcampProgress: progress, stage: allDone ? 'funding' as Stage : p.stage };
    }));
  };

  const completeMilestone = (pitchId: string, milestoneId: string) => {
    setPitches(prev => prev.map(p =>
      p.id === pitchId
        ? { ...p, milestones: p.milestones.map(m => m.id === milestoneId ? { ...m, completed: true } : m) }
        : p
    ));
  };

  const approveMilestone = (pitchId: string, milestoneId: string) => {
    setPitches(prev => prev.map(p => {
      if (p.id !== pitchId) return p;
      const milestones = p.milestones.map(m =>
        m.id === milestoneId ? { ...m, approved: true } : m
      );
      const ms = milestones.find(m => m.id === milestoneId);
      const newEscrow = ms ? p.escrowBalance - ms.trancheAmount : p.escrowBalance;
      return { ...p, milestones, escrowBalance: Math.max(0, newEscrow) };
    }));
  };

  const markNotificationRead = (notificationId: string) => {
    setNotifications(prev => prev.map(n =>
      n.id === notificationId ? { ...n, read: true } : n
    ));
  };

  const getNotificationsForUser = useCallback((userId: string) => {
    return notifications.filter(n => n.userId === userId);
  }, [notifications]);

  return (
    <DataContext.Provider value={{
      pitches, notifications, createPitch, updatePitchFields, submitForAnalysis,
      assignPitch, updateMeetingAgenda, approveMeeting, rejectMeeting,
      submitDiligence, verifyDiligence, signContract, toggleBootcampDay,
      completeMilestone, approveMilestone, markNotificationRead, getNotificationsForUser,
    }}>
      {children}
    </DataContext.Provider>
  );
}