import { redirect } from 'next/navigation';
import { getSessionWorker } from '@/app/actions/auth';
import { AppShell } from '@/components/layout/AppShell';
import { WorkerProvider } from '@/components/providers/WorkerProvider';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const worker = await getSessionWorker();
  if (!worker) redirect('/login');

  return (
    <WorkerProvider worker={worker}>
      <AppShell worker={worker}>{children}</AppShell>
    </WorkerProvider>
  );
}
