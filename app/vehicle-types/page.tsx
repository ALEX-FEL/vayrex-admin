import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { getVehicleTypes } from '@/lib/db';
import { VehicleTypesTable } from './table';

export const dynamic = 'force-dynamic';

export default async function VehicleTypesPage() {
  const vehicleTypes = await getVehicleTypes();

  return (
    <DashboardLayout>
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-foreground">Types de véhicules</h1>
            <p className="mt-0.5 text-sm text-muted-foreground">{vehicleTypes.length} types configurés</p>
          </div>
        </div>
        <VehicleTypesTable initialTypes={vehicleTypes} />
      </div>
    </DashboardLayout>
  );
}
