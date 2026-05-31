import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { getAppSettings } from '@/lib/db';
import { SettingsClient } from './client';

export const dynamic = 'force-dynamic';

export default async function SettingsPage() {
  const settings = await getAppSettings();

  return <SettingsClient initialSettings={settings} />;
}
