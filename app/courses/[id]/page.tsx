'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { StatusBadge } from '@/components/ui/status-badge';
import { rides, vehicleTypes } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { ArrowLeft, User, Car, Clock, MapPin, Navigation, CheckCircle2 } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF', maximumFractionDigits: 0 }).format(amount);

interface PageProps {
  params: { id: string };
}

export default function CourseDetailPage({ params }: PageProps) {
  const ride = useMemo(() => rides.find((r) => r.id === params.id), [params.id]);
  const vt = useMemo(() => vehicleTypes.find((v) => v.name === ride?.vehicleType), [ride]);

  const timelineSteps = [
    { status: 'EN_ATTENTE', label: 'En attente' },
    { status: 'CHAUFFEUR_ASSIGNÉ', label: 'Chauffeur assigné' },
    { status: 'CHAUFFEUR_EN_ROUTE', label: 'Chauffeur en route' },
    { status: 'ARRIVÉ', label: 'Chauffeur arrivé' },
    { status: 'COURSE_EN_COURS', label: 'Course en cours' },
    { status: 'TERMINÉE', label: 'Course terminée' },
  ];

  const statusOrder: Record<string, number> = {
    EN_ATTENTE: 0, CHAUFFEUR_ASSIGNÉ: 1, CHAUFFEUR_EN_ROUTE: 2, ARRIVÉ: 3, COURSE_EN_COURS: 4, TERMINÉE: 5, ANNULÉE: -1
  };

  if (!ride) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <p className="text-muted-foreground">Course non trouvée</p>
        </div>
      </DashboardLayout>
    );
  }

  const currentStep = statusOrder[ride.status];

  return (
    <DashboardLayout>
      <div className="space-y-5 max-w-4xl">
        <div className="flex items-center gap-4">
          <Link href="/courses">
            <Button variant="outline" size="icon" className="h-8 w-8"><ArrowLeft className="h-4 w-4" /></Button>
          </Link>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold text-foreground">{ride.reference}</h1>
              <StatusBadge status={ride.status} />
            </div>
            <p className="mt-0.5 text-sm text-muted-foreground">{format(ride.createdAt, "dd MMMM yyyy 'à' HH:mm", { locale: fr })}</p>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            <div className="rounded-xl border border-border bg-card p-5">
              <h2 className="mb-4 text-sm font-semibold text-foreground">Informations générales</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-950/30"><User className="h-4 w-4 text-blue-600" /></div>
                  <div><p className="text-xs text-muted-foreground">Client</p><p className="mt-0.5 text-sm font-medium">{ride.clientName}</p><p className="text-xs text-muted-foreground">{ride.clientPhone}</p></div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-950/30"><User className="h-4 w-4 text-emerald-600" /></div>
                  <div><p className="text-xs text-muted-foreground">Chauffeur</p><p className="mt-0.5 text-sm font-medium">{ride.driverName ?? '—'}</p><p className="text-xs text-muted-foreground">{ride.driverPhone ?? '—'}</p></div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 dark:bg-amber-950/30"><Car className="h-4 w-4 text-amber-600" /></div>
                  <div><p className="text-xs text-muted-foreground">Type de véhicule</p><p className="mt-0.5 text-sm font-medium">{vt?.name ?? '—'}</p></div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted"><Clock className="h-4 w-4 text-muted-foreground" /></div>
                  <div><p className="text-xs text-muted-foreground">Durée estimée</p><p className="mt-0.5 text-sm font-medium">{ride.duration} min</p></div>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-5">
              <h2 className="mb-4 text-sm font-semibold text-foreground">Trajet</h2>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10"><MapPin className="h-4 w-4 text-primary" /></div>
                  <div><p className="text-xs text-muted-foreground">Point de départ</p><p className="mt-0.5 text-sm font-medium">{ride.departure}</p></div>
                </div>
                <div className="ml-4 h-6 w-px border-l-2 border-dashed border-border" />
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-950/30"><Navigation className="h-4 w-4 text-emerald-600" /></div>
                  <div><p className="text-xs text-muted-foreground">Destination</p><p className="mt-0.5 text-sm font-medium">{ride.destination}</p></div>
                </div>
                <div className="mt-4 flex gap-6 rounded-lg bg-muted/50 px-4 py-3">
                  <div><p className="text-xs text-muted-foreground">Distance</p><p className="mt-0.5 text-sm font-semibold">{ride.distance} km</p></div>
                  <div><p className="text-xs text-muted-foreground">Durée</p><p className="mt-0.5 text-sm font-semibold">{ride.duration} min</p></div>
                </div>
              </div>
            </div>

            {ride.status === 'ANNULÉE' ? (
              <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive font-medium">Cette course a été annulée.</div>
            ) : (
              <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
                <h2 className="mb-5 text-sm font-semibold text-foreground">Progression de la course</h2>
                <div className="space-y-3">
                  {timelineSteps.map((step, idx) => {
                    const isDone = currentStep > idx;
                    const isCurrent = currentStep === idx;
                    return (
                      <div key={step.status} className="flex items-center gap-3">
                        <div className={cn('flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold', isDone ? 'bg-primary text-white' : isCurrent ? 'bg-primary/20 text-primary ring-2 ring-primary' : 'bg-muted text-muted-foreground')}>
                          {isDone ? <CheckCircle2 className="h-4 w-4" /> : idx + 1}
                        </div>
                        <span className={cn('text-sm', isDone || isCurrent ? 'font-medium text-foreground' : 'text-muted-foreground')}>{step.label}</span>
                        {isCurrent && <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">En cours</span>}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
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
                  <span className={cn('rounded-full px-2.5 py-0.5 text-xs font-medium border', ride.paymentMethod === 'CASH' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-blue-50 text-blue-700 border-blue-200')}>
                    {ride.paymentMethod === 'CASH' ? 'Cash' : 'Mobile Money'}
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
