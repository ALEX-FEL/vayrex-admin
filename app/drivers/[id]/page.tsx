'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { StatusBadge } from '@/components/ui/status-badge';
import { drivers, rides } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Star, FileText, CheckCircle, XCircle, PauseCircle } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF', maximumFractionDigits: 0 }).format(amount);

interface PageProps {
  params: { id: string };
}

export default function DriverProfilePage({ params }: PageProps) {
  const driver = useMemo(() => drivers.find((d) => d.id === params.id), [params.id]);
  const driverRides = useMemo(() => rides.filter((r) => r.driverId === params.id).slice(0, 50), [params.id]);

  if (!driver) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <p className="text-muted-foreground">Chauffeur non trouvé</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-5 max-w-5xl">
        <div className="flex items-center gap-3">
          <Link href="/drivers">
            <Button variant="outline" size="icon" className="h-8 w-8">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold text-foreground">Profil chauffeur</h1>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <div className="space-y-4">
            <div className="rounded-xl border border-border bg-card p-5 text-center shadow-sm">
              <img src={driver.avatar} alt={driver.firstName} className="mx-auto h-20 w-20 rounded-full bg-muted object-cover" />
              <h2 className="mt-3 text-base font-bold">{driver.firstName} {driver.lastName}</h2>
              <p className="text-sm text-muted-foreground">{driver.phone}</p>
              <div className="mt-2 flex items-center justify-center gap-1">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                <span className="text-sm font-semibold">{driver.rating}</span>
              </div>
              <div className="mt-3"><StatusBadge status={driver.status} /></div>
              <div className="mt-4 flex justify-center gap-2">
                {driver.status === 'EN_ATTENTE' && (
                  <>
                    <Button size="sm" className="gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white"><CheckCircle className="h-3.5 w-3.5" />Approuver</Button>
                    <Button size="sm" variant="destructive" className="gap-1.5"><XCircle className="h-3.5 w-3.5" />Refuser</Button>
                  </>
                )}
                {driver.status === 'APPROUVÉ' && (
                  <Button size="sm" variant="outline" className="gap-1.5 text-amber-600 border-amber-300"><PauseCircle className="h-3.5 w-3.5" />Suspendre</Button>
                )}
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
              <h3 className="mb-3 text-sm font-semibold">Statistiques</h3>
              <div className="space-y-2.5">
                <div className="flex justify-between text-sm"><span className="text-muted-foreground">Total courses</span><span className="font-semibold">{driver.totalRides}</span></div>
                <div className="flex justify-between text-sm"><span className="text-muted-foreground">Note</span><span className="font-semibold">{driver.rating}/5</span></div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Statut</span>
                  <span className={`text-xs font-medium ${driver.isOnline ? 'text-emerald-600' : 'text-muted-foreground'}`}>{driver.isOnline ? 'En ligne' : 'Hors ligne'}</span>
                </div>
                <div className="flex justify-between text-sm"><span className="text-muted-foreground">Inscrit le</span><span className="font-medium text-xs">{format(driver.createdAt, 'dd/MM/yyyy', { locale: fr })}</span></div>
              </div>
            </div>
          </div>

          <div className="space-y-4 lg:col-span-2">
            <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
              <h3 className="mb-4 text-sm font-semibold">Informations véhicule</h3>
              <div className="grid grid-cols-2 gap-4">
                {[{ label: 'Type', value: driver.vehicleType }, { label: 'Marque', value: driver.vehicleBrand }, { label: 'Couleur', value: driver.vehicleColor }, { label: 'Immatriculation', value: driver.vehiclePlate }].map(({ label, value }) => (
                  <div key={label} className="rounded-lg bg-muted/50 p-3">
                    <p className="text-xs text-muted-foreground">{label}</p>
                    <p className="mt-0.5 text-sm font-medium">{value || '—'}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
              <h3 className="mb-4 text-sm font-semibold">Documents</h3>
              <div className="space-y-2.5">
                {[{ label: "Carte nationale d'identité", value: driver.idCardNumber }, { label: 'Permis de conduire', value: driver.licenseNumber }, { label: 'Carte grise', value: `CG-${driver.vehiclePlate.replace(/\s/g, '')}` }].map(({ label, value }) => (
                  <div key={label} className="flex items-center justify-between rounded-lg border border-border px-3 py-2.5">
                    <div className="flex items-center gap-2.5">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs font-medium">{label}</p>
                        <p className="text-[11px] text-muted-foreground font-mono">{value}</p>
                      </div>
                    </div>
                    <span className="rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[10px] font-medium text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-800">Vérifié</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
              <h3 className="mb-4 text-sm font-semibold">Historique des courses ({driverRides.length})</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="border-b border-border">{['Réf.', 'Client', 'Destination', 'Prix', 'Date', 'Statut'].map((h) => (<th key={h} className="pb-2 pr-4 text-left text-xs font-medium text-muted-foreground whitespace-nowrap">{h}</th>))}</tr></thead>
                  <tbody className="divide-y divide-border">
                    {driverRides.map((ride) => (
                      <tr key={ride.id} className="hover:bg-muted/30">
                        <td className="py-2.5 pr-4 font-mono text-xs text-primary">{ride.reference}</td>
                        <td className="py-2.5 pr-4 text-xs font-medium whitespace-nowrap">{ride.clientName}</td>
                        <td className="py-2.5 pr-4 text-xs text-muted-foreground max-w-[140px] truncate">{ride.destination}</td>
                        <td className="py-2.5 pr-4 text-xs font-semibold whitespace-nowrap">{formatCurrency(ride.price)}</td>
                        <td className="py-2.5 pr-4 text-xs text-muted-foreground whitespace-nowrap">{format(ride.createdAt, 'dd/MM/yy', { locale: fr })}</td>
                        <td className="py-2.5"><StatusBadge status={ride.status} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
