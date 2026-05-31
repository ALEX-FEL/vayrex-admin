import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { getDrivers } from '@/lib/db';
import { DriversTable } from './table';

export const dynamic = 'force-dynamic';

export default async function DriversPage() {
  const drivers = await getDrivers();

  return (
    <DashboardLayout>
      <div className="space-y-5">
        <div>
          <h1 className="text-xl font-bold text-foreground">Chauffeurs</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">{drivers.length} chauffeurs trouvés</p>
        </div>
        <DriversTable drivers={drivers} />
      </div>
    </DashboardLayout>
  );
}
