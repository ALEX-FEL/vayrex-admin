'use client';

import { CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Tables } from '@/lib/supabase';

type RideStatus = Tables<'rides'>['status'];

const timelineSteps: { status: RideStatus; label: string }[] = [
  { status: 'EN_ATTENTE', label: 'En attente' },
  { status: 'CHAUFFEUR_ASSIGNÉ', label: 'Chauffeur assigné' },
  { status: 'CHAUFFEUR_EN_ROUTE', label: 'Chauffeur en route' },
  { status: 'ARRIVÉ', label: 'Chauffeur arrivé' },
  { status: 'COURSE_EN_COURS', label: 'Course en cours' },
  { status: 'TERMINÉE', label: 'Course terminée' },
];

const statusOrder: Record<RideStatus, number> = {
  EN_ATTENTE: 0,
  CHAUFFEUR_ASSIGNÉ: 1,
  CHAUFFEUR_EN_ROUTE: 2,
  ARRIVÉ: 3,
  COURSE_EN_COURS: 4,
  TERMINÉE: 5,
  ANNULÉE: -1,
};

interface RideTimelineProps {
  status: RideStatus;
}

export function RideTimeline({ status }: RideTimelineProps) {
  if (status === 'ANNULÉE') {
    return (
      <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive font-medium">
        Cette course a été annulée.
      </div>
    );
  }

  const currentStep = statusOrder[status];

  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <h2 className="mb-5 text-sm font-semibold text-foreground">Progression de la course</h2>
      <div className="space-y-3">
        {timelineSteps.map((step, idx) => {
          const isDone = currentStep > idx;
          const isCurrent = currentStep === idx;
          return (
            <div key={step.status} className="flex items-center gap-3">
              <div className={cn(
                'flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold',
                isDone ? 'bg-primary text-white' : isCurrent ? 'bg-primary/20 text-primary ring-2 ring-primary' : 'bg-muted text-muted-foreground'
              )}>
                {isDone ? <CheckCircle2 className="h-4 w-4" /> : idx + 1}
              </div>
              <span className={cn('text-sm', isDone || isCurrent ? 'font-medium text-foreground' : 'text-muted-foreground')}>
                {step.label}
              </span>
              {isCurrent && (
                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">En cours</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
