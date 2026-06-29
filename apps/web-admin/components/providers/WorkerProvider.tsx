'use client';

import { createContext, useContext } from 'react';
import type { WorkerProfile } from '@bodega-angelito/services';

interface WorkerContextValue {
  worker: WorkerProfile;
}

const WorkerContext = createContext<WorkerContextValue | null>(null);

export function WorkerProvider({
  worker,
  children,
}: {
  worker: WorkerProfile;
  children: React.ReactNode;
}) {
  return <WorkerContext.Provider value={{ worker }}>{children}</WorkerContext.Provider>;
}

export function useWorker() {
  const ctx = useContext(WorkerContext);
  if (!ctx) throw new Error('useWorker debe usarse dentro de WorkerProvider');
  return ctx.worker;
}
