'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { StatusBadge } from '@/components/ui/status-badge';
import Link from 'next/link';
import {
  Eye,
  Navigation,
  XCircle,
  ChevronRight,
  Car,
  User,
  Clock,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import type { Ride } from '@/types';

interface RideActionsModalProps {
  ride: Ride | null;
  open: boolean;
  onClose: () => void;
  onCancelRide?: (rideId: string) => void;
  onOpenTrafic?: (ride: Ride) => void;
}

interface ActionItem {
  label: string;
  description: string;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  onClick?: () => void;
  href?: string;
  destructive?: boolean;
  disabled?: boolean;
}

export function RideActionsModal({
  ride,
  open,
  onClose,
  onCancelRide,
  onOpenTrafic,
}: RideActionsModalProps) {
  if (!ride) return null;

  const isActive = !['TERMINÉE', 'ANNULÉE'].includes(ride.status);
  const isInProgress = ['CHAUFFEUR_EN_ROUTE', 'COURSE_EN_COURS', 'ARRIVÉ', 'CHAUFFEUR_ASSIGNÉ'].includes(ride.status);
  const canCancel = !['TERMINÉE', 'ANNULÉE'].includes(ride.status);

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF', maximumFractionDigits: 0 }).format(amount);

  const actions: ActionItem[] = [
    {
      label: 'Voir les détails',
      description: 'Consulter la fiche complète de la course',
      icon: Eye,
      iconBg: 'bg-primary/10',
      iconColor: 'text-primary',
      href: `/courses/${ride.id}`,
    },
    {
      label: 'Voir le trafic',
      description: isActive
        ? 'Suivre le trajet en temps réel sur la carte'
        : 'Visualiser le trajet sur la carte',
      icon: Navigation,
      iconBg: 'bg-blue-50 dark:bg-blue-950/30',
      iconColor: 'text-blue-600',
      onClick: () => {
        onClose();
        onOpenTrafic?.(ride);
      },
    },
    ...(canCancel
      ? [
          {
            label: 'Annuler la course',
            description: 'Marquer cette course comme annulée',
            icon: XCircle,
            iconBg: 'bg-red-50 dark:bg-red-950/30',
            iconColor: 'text-destructive',
            destructive: true,
            onClick: () => {
              onCancelRide?.(ride.id);
              onClose();
            },
          },
        ]
      : []),
  ];

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-md w-full">
        <DialogHeader className="pb-3 border-b border-border">
          <DialogTitle className="text-sm font-bold">Actions — {ride.reference}</DialogTitle>
        </DialogHeader>

        {/* Ride summary */}
        <div className="rounded-xl bg-muted/50 p-3 space-y-2 -mt-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-card border border-border">
                <Car className="h-3.5 w-3.5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-xs font-semibold">{ride.vehicleType}</p>
                <p className="text-[10px] text-muted-foreground">{formatCurrency(ride.price)} · {ride.distance} km</p>
              </div>
            </div>
            <StatusBadge status={ride.status} />
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <User className="h-3 w-3 shrink-0" />
            <span className="truncate">{ride.clientName}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="h-3 w-3 shrink-0" />
            <span>{format(ride.createdAt, 'dd/MM/yyyy HH:mm', { locale: fr })}</span>
          </div>
          <div className="pt-1 space-y-1">
            <div className="flex items-center gap-1.5 text-xs">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
              <span className="text-muted-foreground truncate">{ride.departure}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs">
              <div className="h-1.5 w-1.5 rounded-full bg-red-500 shrink-0" />
              <span className="text-muted-foreground truncate">{ride.destination}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2">
          {actions.map((action) => {
            const Icon = action.icon;
            const sharedCls = cn(
              'w-full flex items-center gap-3 rounded-xl border p-3.5 text-left transition-all duration-150 group',
              action.destructive
                ? 'border-destructive/20 bg-destructive/5 hover:bg-destructive/10'
                : 'border-border bg-card hover:bg-muted/50',
              action.disabled && 'opacity-50 cursor-not-allowed pointer-events-none'
            );
            const inner = (
              <>
                <div className={cn('flex h-9 w-9 items-center justify-center rounded-lg shrink-0', action.iconBg)}>
                  <Icon className={cn('h-4 w-4', action.iconColor)} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={cn('text-sm font-medium', action.destructive ? 'text-destructive' : 'text-foreground')}>
                    {action.label}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{action.description}</p>
                </div>
                <ChevronRight className={cn('h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5', action.destructive ? 'text-destructive/50' : 'text-muted-foreground/50')} />
              </>
            );

            if (action.href) {
              return (
                <Link key={action.label} href={action.href} onClick={onClose} className={sharedCls}>
                  {inner}
                </Link>
              );
            }
            return (
              <button key={action.label} onClick={action.onClick} disabled={action.disabled} className={sharedCls}>
                {inner}
              </button>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
