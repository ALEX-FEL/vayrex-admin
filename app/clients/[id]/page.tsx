import { notFound } from 'next/navigation';
import Link from 'next/link';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { StatusBadge } from '@/components/ui/status-badge';
import { getClient, getRidesByClient } from '@/lib/db';
import { Button } from '@/components/ui/button';
import { ArrowLeft, PauseCircle } from 'lucide-react';
import { format } from 'date-fns';
import { ClientRidesTable } from './rides-table';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: { id: string };
}

export default async function ClientProfilePage({ params }: PageProps) {
  const { id } = params;
  const client = await getClient(id);
  if (!client) notFound();

  const rides = await getRidesByClient(client.id);

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF', maximumFractionDigits: 0 }).format(amount);

  return (
    <DashboardLayout>
      <div className="space-y-5 max-w-4xl">
        <div className="flex items-center gap-3">
          <Link href="/clients">
            <Button variant="outline" size="icon" className="h-8 w-8">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold text-foreground">Profil client</h1>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <div className="space-y-4">
            <div className="rounded-xl border border-border bg-card p-5 text-center shadow-sm">
              <img src={client.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${client.first_name}`} alt={client.first_name} className="mx-auto h-20 w-20 rounded-full bg-muted object-cover" />
              <h2 className="mt-3 text-base font-bold">{client.first_name} {client.last_name}</h2>
              <p className="text-sm text-muted-foreground">{client.phone}</p>
              <p className="text-xs text-muted-foreground">{client.email}</p>
              <div className="mt-3"><StatusBadge status={client.status} /></div>
              {client.status === 'ACTIF' && (
                <Button variant="outline" size="sm" className="mt-4 gap-1.5 text-amber-600 border-amber-300 w-full">
                  <PauseCircle className="h-3.5 w-3.5" />
                  Suspendre
                </Button>
              )}
            </div>

            <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
              <h3 className="mb-3 text-sm font-semibold">Résumé</h3>
              <div className="space-y-2.5">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total courses</span>
                  <span className="font-semibold">{client.total_rides}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Montant total</span>
                  <span className="font-semibold text-xs">{formatCurrency(client.total_spent)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Inscrit le</span>
                  <span className="font-medium text-xs">{format(new Date(client.created_at), 'dd/MM/yyyy')}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
              <h3 className="mb-4 text-sm font-semibold">Historique des courses ({rides.length})</h3>
              <ClientRidesTable rides={rides} />
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
