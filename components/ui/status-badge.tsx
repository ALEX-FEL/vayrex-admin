import { cn } from '@/lib/utils';
import type { RideStatus, DriverStatus, ClientStatus, PaymentStatus } from '@/types';

type AnyStatus = RideStatus | DriverStatus | ClientStatus | PaymentStatus;

const statusConfig: Record<string, { label: string; className: string }> = {
  EN_ATTENTE: { label: 'En attente', className: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-800' },
  'CHAUFFEUR_ASSIGNÉ': { label: 'Chauffeur assigné', className: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-800' },
  CHAUFFEUR_EN_ROUTE: { label: 'En route', className: 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/30 dark:text-sky-400 dark:border-sky-800' },
  ARRIVÉ: { label: 'Arrivé', className: 'bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950/30 dark:text-teal-400 dark:border-teal-800' },
  COURSE_EN_COURS: { label: 'En cours', className: 'bg-primary/10 text-primary border-primary/20 dark:bg-primary/20 dark:text-primary' },
  TERMINÉE: { label: 'Terminée', className: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-800' },
  ANNULÉE: { label: 'Annulée', className: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/30 dark:text-red-400 dark:border-red-800' },
  APPROUVÉ: { label: 'Approuvé', className: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-800' },
  REFUSÉ: { label: 'Refusé', className: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/30 dark:text-red-400 dark:border-red-800' },
  SUSPENDU: { label: 'Suspendu', className: 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/30 dark:text-orange-400 dark:border-orange-800' },
  ACTIF: { label: 'Actif', className: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-800' },
  PAYÉ: { label: 'Payé', className: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-800' },
};

interface StatusBadgeProps {
  status: AnyStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status] ?? { label: status, className: 'bg-gray-100 text-gray-600 border-gray-200' };
  return (
    <span className={cn('inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium', config.className, className)}>
      {config.label}
    </span>
  );
}
