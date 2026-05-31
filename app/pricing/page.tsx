import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { getPricingConfig, getVehicleTypes } from '@/lib/db';
import { PricingClient } from './client';

export const dynamic = 'force-dynamic';

export default async function PricingPage() {
  const [config, vehicleTypes] = await Promise.all([getPricingConfig(), getVehicleTypes()]);

  return <PricingClient initialConfig={config} vehicleTypes={vehicleTypes} />;
}
