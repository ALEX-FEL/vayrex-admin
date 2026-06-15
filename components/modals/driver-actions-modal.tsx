'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { StatusBadge } from '@/components/ui/status-badge';
import Link from 'next/link';
import {
  Eye,
  CheckCircle,
  XCircle,
  PauseCircle,
  PlayCircle,
  ChevronRight,
  Phone,
  Car,
  Star,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import type { Driver } from '@/types';

interface DriverActionsModalProps {
  driver: Driver | null;
  open: boolean;
  onClose: () => void;
  onApprove?: (driverId: string) => void;
  onReject?: (driverId: string) => void;
  onSuspend?: (driverId: string) => void;
  onReactivate?: (driverId: string) => void;
}

export function DriverActionsModal({
  driver,
  open,
  onClose,
  onApprove,
  onReject,
  onSuspend,
  onReactivate,
}: DriverActionsModalProps) {
  if (!driver) return null;

  type ActionItem = {
    label: string;
    description: string;
    icon: React.ElementType;
    iconBg: string;
    iconColor: string;
    destructive?: boolean;
    href?: string;
    onClick?: () => void;
  };

  const actions: ActionItem[] = [
    {
      label: 'Voir le profil',
      description: 'Consulter la fiche complète du chauffeur',
      icon: Eye,
      iconBg: 'bg-primary/10',
      iconColor: 'text-primary',
      href: `/drivers/${driver.id}`,
    },
    ...(driver.status === 'EN_ATTENTE'
      ? [
          {
            label: 'Approuver',
            description: 'Autoriser ce chauffeur à opérer sur la plateforme',
            icon: CheckCircle,
            iconBg: 'bg-emerald-50 dark:bg-emerald-950/30',
            iconColor: 'text-emerald-600',
            onClick: () => { onApprove?.(driver.id); onClose(); },
          },
          {
            label: 'Refuser',
            description: 'Rejeter la demande d\'inscription de ce chauffeur',
            icon: XCircle,
            iconBg: 'bg-red-50 dark:bg-red-950/30',
            iconColor: 'text-destructive',
            destructive: true,
            onClick: () => { onReject?.(driver.id); onClose(); },
          },
        ]
      : []),
    ...(driver.status === 'APPROUVÉ'
      ? [
          {
            label: 'Suspendre',
            description: 'Désactiver temporairement ce chauffeur',
            icon: PauseCircle,
            iconBg: 'bg-amber-50 dark:bg-amber-950/30',
            iconColor: 'text-amber-600',
            destructive: true,
            onClick: () => { onSuspend?.(driver.id); onClose(); },
          },
        ]
      : []),
    ...(driver.status === 'SUSPENDU'
      ? [
          {
            label: 'Réactiver',
            description: 'Permettre à ce chauffeur d\'opérer à nouveau',
            icon: PlayCircle,
            iconBg: 'bg-emerald-50 dark:bg-emerald-950/30',
            iconColor: 'text-emerald-600',
            onClick: () => { onReactivate?.(driver.id); onClose(); },
          },
        ]
      : []),
  ];

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-md w-full">
        <DialogHeader className="pb-3 border-b border-border">
          <DialogTitle className="text-sm font-bold">Actions — Chauffeur</DialogTitle>
        </DialogHeader>

        {/* Driver summary */}
        <div className="rounded-xl bg-muted/50 p-3 space-y-2 -mt-1">
          <div className="flex items-center gap-3">
            <img
              src={driver.avatar}
              alt={driver.firstName}
              className="h-10 w-10 rounded-full bg-muted object-cover shrink-0"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">{driver.firstName} {driver.lastName}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <StatusBadge status={driver.status} />
                <span className={cn(
                  'inline-flex items-center gap-1 text-[10px] font-medium',
                  driver.isOnline ? 'text-emerald-600' : 'text-muted-foreground'
                )}>
                  <span className={cn('h-1.5 w-1.5 rounded-full', driver.isOnline ? 'bg-emerald-500' : 'bg-muted-foreground/40')} />
                  {driver.isOnline ? 'En ligne' : 'Hors ligne'}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Phone className="h-3 w-3 shrink-0" />
            <span>{driver.phone}</span>
          </div>
          <div className="flex gap-4 pt-1">
            <div className="flex items-center gap-1">
              <Car className="h-3 w-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">{driver.vehicleType} — {driver.vehiclePlate}</span>
            </div>
          </div>
          <div className="flex gap-4 pt-0.5">
            <div>
              <p className="text-[10px] text-muted-foreground">Courses</p>
              <p className="text-xs font-semibold">{driver.totalRides}</p>
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground">Note</p>
              <div className="flex items-center gap-0.5">
                <Star className="h-2.5 w-2.5 fill-amber-400 text-amber-400" />
                <p className="text-xs font-semibold">{driver.rating}</p>
              </div>
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground">Inscrit le</p>
              <p className="text-xs font-semibold">{format(driver.createdAt, 'dd/MM/yyyy', { locale: fr })}</p>
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
                ? 'border-amber-200 dark:border-amber-800/50 bg-amber-50/50 dark:bg-amber-950/20 hover:bg-amber-50 dark:hover:bg-amber-950/30'
                : 'border-border bg-card hover:bg-muted/50'
            );
            const inner = (
              <>
                <div className={cn('flex h-9 w-9 items-center justify-center rounded-lg shrink-0', action.iconBg)}>
                  <Icon className={cn('h-4 w-4', action.iconColor)} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{action.label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{action.description}</p>
                </div>
                <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground/50 transition-transform group-hover:translate-x-0.5" />
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
              <button key={action.label} onClick={action.onClick} className={sharedCls}>
                {inner}
              </button>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
