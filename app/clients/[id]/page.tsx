'use client';

import { use } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { StatusBadge } from '@/components/ui/status-badge';
import { clients, rides } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { ArrowLeft, PauseCircle } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function ClientProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const client = clients.find((c) => c.id === id);
  if (!client) notFound();

  const clientRides = rides.filter((r) => r.clientId === client.id).slice(0, 20);
  const totalSpent = clientRides
    .filter((r) => r.status === 'TERMINÉE')
    .reduce((sum, r) => sum + r.price, 0);

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
          {/* Profile */}
          <div className="space-y-4">
            <div className="rounded-xl border border-border bg-card p-5 text-center shadow-sm">
              <img src={client.avatar} alt={client.firstName} className="mx-auto h-20 w-20 rounded-full bg-muted object-cover" />
              <h2 className="mt-3 text-base font-bold">{client.firstName} {client.lastName}</h2>
              <p className="text-sm text-muted-foreground">{client.phone}</p>
              <p className="text-xs text-muted-foreground">{client.email}</p>
              <div className="mt-3">
                <StatusBadge status={client.status} />
              </div>
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
                  <span className="font-semibold">{client.totalRides}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Montant total</span>
                  <span className="font-semibold text-xs">{formatCurrency(client.totalSpent)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Inscrit le</span>
                  <span className="font-medium text-xs">{format(client.createdAt, 'dd/MM/yyyy', { locale: fr })}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Rides */}
          <div className="lg:col-span-2">
            <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
              <h3 className="mb-4 text-sm font-semibold">Historique des courses ({clientRides.length})</h3>
              {clientRides.length === 0 ? (
                <p className="text-sm text-muted-foreground">Aucune course pour ce client.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        {['Réf.', 'Chauffeur', 'Destination', 'Prix', 'Date', 'Statut'].map((h) => (
                          <th key={h} className="pb-2 pr-4 text-left text-xs font-medium text-muted-foreground whitespace-nowrap">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {clientRides.map((ride) => (
                        <tr key={ride.id} className="hover:bg-muted/30">
                          <td className="py-2.5 pr-4 font-mono text-xs text-primary">{ride.reference}</td>
                          <td className="py-2.5 pr-4 text-xs text-muted-foreground whitespace-nowrap">{ride.driverName ?? '—'}</td>
                          <td className="py-2.5 pr-4 text-xs text-muted-foreground max-w-[140px] truncate">{ride.destination}</td>
                          <td className="py-2.5 pr-4 text-xs font-semibold whitespace-nowrap">{formatCurrency(ride.price)}</td>
                          <td className="py-2.5 pr-4 text-xs text-muted-foreground whitespace-nowrap">
                            {format(ride.createdAt, 'dd/MM/yy', { locale: fr })}
                          </td>
                          <td className="py-2.5">
                            <StatusBadge status={ride.status} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
