import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { getClients } from '@/lib/db';
import { ClientsTable } from './table';

export const dynamic = 'force-dynamic';

export default async function ClientsPage() {
  const clients = await getClients();

  return (
    <DashboardLayout>
      <div className="space-y-5">
        <div>
          <h1 className="text-xl font-bold text-foreground">Clients</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">{clients.length} clients trouvés</p>
        </div>
        <ClientsTable clients={clients} />
      </div>
    </DashboardLayout>
  );
}
