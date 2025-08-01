import { AffirmationGenerator } from '@/components/dashboard/affirmation-generator';
import { NotificationsToggle } from '@/components/dashboard/notifications-toggle';
import { ProgressChart } from '@/components/dashboard/progress-chart';
import { WelcomeHeader } from '@/components/dashboard/welcome-header';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard | Recoverantastic',
};

export default function DashboardPage() {
  return (
    <div className="flex-1 space-y-8 p-4 pt-6 md:p-8">
      <WelcomeHeader />
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <AffirmationGenerator />
        </div>
        <div className="space-y-8">
          <NotificationsToggle />
        </div>
      </div>
      <ProgressChart />
    </div>
  );
}
