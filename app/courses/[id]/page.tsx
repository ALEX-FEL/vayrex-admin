import { notFound } from 'next/navigation';
import Link from 'next/link';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { StatusBadge } from '@/components/ui/status-badge';
import { getRide, getVehicleTypes } from '@/lib/db';
import { Button } from '@/components/ui/button';
import { ArrowLeft, User, Car, Clock, MapPin, Navigation } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { RideTimeline } from './timeline';
import { cn } from '@/lib/utils';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: { id: string };
}

export default async function CourseDetailPage({ params }: PageProps) {
  const { id } = params;
  const ride = await getRide(id);
  if (!ride) notFound();

  const vehicleTypes = await getVehicleTypes();
  const vt = vehicleTypes.find((v) => v.id === ride.vehicle_type_id);

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF', maximumFractionDigits: 0 }).format(amount);

  return (
    <DashboardLayout>
      <div className="space-y-5 max-w-4xl">
        <div className="flex items-center gap-4">
          <Link href="/courses">
            <Button variant="outline" size="icon" className="h-8 w-8">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold text-foreground">{ride.reference}</h1>
              <StatusBadge status={ride.status} />
            </div>
            <p className="mt-0.5 text-sm text-muted-foreground">
              {format(new Date(ride.created_at), "dd MMMM yyyy 'à' HH:mm", { locale: fr })}
            </p>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            <div className="rounded-xl border border-border bg-card p-5">
              <h2 className="mb-4 text-sm font-semibold text-foreground">Informations générales</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-950/30">
                    <User className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Client</p>
                    <p className="mt-0.5 text-sm font-medium">{ride.client_name}</p>
                    <p className="text-xs text-muted-foreground">{ride.client_phone}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-950/30">
                    <User className="h-4 w-4 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Chauffeur</p>
                    <p className="mt-0.5 text-sm font-medium">{ride.driver_name ?? '—'}</p>
                    <p className="text-xs text-muted-foreground">{ride.driver_phone ?? '—'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 dark:bg-amber-950/30">
                    <Car className="h-4 w-4 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Type de véhicule</p>
                    <p className="mt-0.5 text-sm font-medium">{vt?.name ?? '—'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Durée estimée</p>
                    <p className="mt-0.5 text-sm font-medium">{ride.duration} min</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-5">
              <h2 className="mb-4 text-sm font-semibold text-foreground">Trajet</h2>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <MapPin className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Point de départ</p>
                    <p className="mt-0.5 text-sm font-medium">{ride.departure}</p>
                  </div>
                </div>
                <div className="ml-4 h-6 w-px border-l-2 border-dashed border-border" />
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-950/30">
                    <Navigation className="h-4 w-4 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Destination</p>
                    <p className="mt-0.5 text-sm font-medium">{ride.destination}</p>
                  </div>
                </div>
                <div className="mt-4 flex gap-6 rounded-lg bg-muted/50 px-4 py-3">
                  <div>
                    <p className="text-xs text-muted-foreground">Distance</p>
                    <p className="mt-0.5 text-sm font-semibold">{ride.distance} km</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Durée</p>
                    <p className="mt-0.5 text-sm font-semibold">{ride.duration} min</p>
                  </div>
                </div>
              </div>
            </div>

            <RideTimeline status={ride.status} />
          </div>

          <div className="space-y-4">
            <div className="rounded-xl border border-border bg-card p-5">
              <h2 className="mb-4 text-sm font-semibold text-foreground">Paiement</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">Montant</p>
                  <p className="text-lg font-bold text-foreground">{formatCurrency(ride.price)}</p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">Mode</p>
                  <span className={cn(
                    'rounded-full px-2.5 py-0.5 text-xs font-medium border',
                    ride.payment_method === 'CASH'
                      ? 'bg-amber-50 text-amber-700 border-amber-200'
                      : 'bg-blue-50 text-blue-700 border-blue-200'
                  )}>
                    {ride.payment_method === 'CASH' ? 'Cash' : 'Mobile Money'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
