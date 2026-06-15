'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { StatusBadge } from '@/components/ui/status-badge';
import Link from 'next/link';
import {
  Eye,
  XCircle,
  PauseCircle,
  Play,
  CheckCircle,
  ChevronRight,
  Car,
  Star,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Driver, DriverStatus } from '@/types';
import { MotifModal } from './motif-modal';

interface DriverActionsModalProps {
  driver: Driver | null;
  open: boolean;
  onClose: () => void;
  onApprove: (driverId: string) => void;
  onReject: (driverId: string, motif: string) => void;
  onSuspend: (driverId: string, motif: string) => void;
  onReactivate: (driverId: string) => void;
}

interface ActionItem {
  label: string;
  description: string;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  onClick?: () => void;
  destructive?: boolean;
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
  const [showMotif, setShowMotif] = useState<'suspend' | 'reject' | null>(null);

  if (!driver) return null;

  const handleSuspend = (motif: string) => {
    onSuspend(driver.id, motif);
    setShowMotif(null);
    onClose();
  };

  const handleReject = (motif: string) => {
    onReject(driver.id, motif);
    setShowMotif(null);
    onClose();
  };

  const actions: ActionItem[] = [
    ...(driver.status === 'EN_ATTENTE'
      ? [
          {
            label: 'Approuver',
            description: 'Valider le compte chauffeur',
            icon: CheckCircle,
            iconBg: 'bg-emerald-50 dark:bg-emerald-950/30',
            iconColor: 'text-emerald-600',
            onClick: () => {
              onApprove(driver.id);
              onClose();
            },
          },
          {
            label: 'Refuser',
            description: 'Rejeter la demande d\'inscription',
            icon: XCircle,
            iconBg: 'bg-red-50 dark:bg-red-950/30',
            iconColor: 'text-destructive',
            destructive: true,
            onClick: () => setShowMotif('reject'),
          },
        ]
      : []),
    ...(driver.status === 'APPROUVÉ'
      ? [
          {
            label: 'Suspendre',
            description: 'Désactiver temporairement le compte',
            icon: PauseCircle,
            iconBg: 'bg-amber-50 dark:bg-amber-950/30',
            iconColor: 'text-amber-600',
            onClick: () => setShowMotif('suspend'),
          },
        ]
      : []),
    ...(driver.status === 'SUSPENDU'
      ? [
          {
            label: 'Réactiver',
            description: 'Réactiver le compte chauffeur',
            icon: Play,
            iconBg: 'bg-emerald-50 dark:bg-emerald-950/30',
            iconColor: 'text-emerald-600',
            onClick: () => {
              onReactivate(driver.id);
              onClose();
            },
          },
        ]
      : []),
  ];

  return (
    <>
      <Dialog open={open && !showMotif} onOpenChange={(v) => !v && onClose()}>
        <DialogContent className="max-w-md w-full">
          <DialogHeader className="pb-3 border-b border-border">
            <DialogTitle className="text-sm font-bold">Actions — {driver.firstName} {driver.lastName}</DialogTitle>
          </DialogHeader>

          {/* Driver summary */}
          <div className="rounded-xl bg-muted/50 p-3 space-y-2 -mt-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <img src={driver.avatar} alt={driver.firstName} className="h-10 w-10 rounded-full bg-muted object-cover" />
                <div>
                  <p className="text-sm font-semibold">{driver.firstName} {driver.lastName}</p>
                  <p className="text-xs text-muted-foreground">{driver.phone}</p>
                </div>
              </div>
              <StatusBadge status={driver.status} />
            </div>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Car className="h-3 w-3" />
                <span>{driver.vehicleType}</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                <span>{driver.rating}</span>
              </div>
              <span className="font-mono">{driver.vehiclePlate}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-2">
            {actions.map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.label}
                  onClick={action.onClick}
                  className={cn(
                    'w-full flex items-center gap-3 rounded-xl border p-3.5 text-left transition-all duration-150 group',
                    action.destructive
                      ? 'border-destructive/20 bg-destructive/5 hover:bg-destructive/10'
                      : 'border-border bg-card hover:bg-muted/50'
                  )}
                >
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
                </button>
              );
            })}

            {/* Voir le profil removed - row is clickable */}
          </div>
        </DialogContent>
      </Dialog>

      <MotifModal
        open={showMotif === 'suspend'}
        onClose={() => setShowMotif(null)}
        onConfirm={handleSuspend}
        title="Suspendre le chauffeur"
        description={`Vous allez suspendre le compte de ${driver.firstName} ${driver.lastName}. Cette action peut être annulée ultérieurement.`}
        confirmLabel="Suspendre"
      />

      <MotifModal
        open={showMotif === 'reject'}
        onClose={() => setShowMotif(null)}
        onConfirm={handleReject}
        title="Refuser le chauffeur"
        description={`Vous allez refuser la demande d'inscription de ${driver.firstName} ${driver.lastName}.`}
        confirmLabel="Refuser"
        destructive
      />
    </>
  );
}
