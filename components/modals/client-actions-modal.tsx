'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { StatusBadge } from '@/components/ui/status-badge';
import {
  PauseCircle,
  Play,
  ChevronRight,
  User,
  Mail,
  Phone,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Client, ClientStatus } from '@/types';
import { MotifModal } from './motif-modal';

interface ClientActionsModalProps {
  client: Client | null;
  open: boolean;
  onClose: () => void;
  onToggleStatus: (clientId: string, motif?: string) => void;
}

interface ActionItem {
  label: string;
  description: string;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  onClick: () => void;
  destructive?: boolean;
}

export function ClientActionsModal({
  client,
  open,
  onClose,
  onToggleStatus,
}: ClientActionsModalProps) {
  const [showMotif, setShowMotif] = useState(false);

  if (!client) return null;

  const handleSuspend = (motif: string) => {
    onToggleStatus(client.id, motif);
    setShowMotif(false);
    onClose();
  };

  const handleReactivate = () => {
    onToggleStatus(client.id);
    onClose();
  };

  const actions: ActionItem[] = client.status === 'ACTIF'
    ? [
        {
          label: 'Suspendre',
          description: 'Désactiver temporairement le compte',
          icon: PauseCircle,
          iconBg: 'bg-amber-50 dark:bg-amber-950/30',
          iconColor: 'text-amber-600',
          onClick: () => setShowMotif(true),
        },
      ]
    : [
        {
          label: 'Réactiver',
          description: 'Réactiver le compte client',
          icon: Play,
          iconBg: 'bg-emerald-50 dark:bg-emerald-950/30',
          iconColor: 'text-emerald-600',
          onClick: handleReactivate,
        },
      ];

  return (
    <>
      <Dialog open={open && !showMotif} onOpenChange={(v) => !v && onClose()}>
        <DialogContent className="max-w-md w-full">
          <DialogHeader className="pb-3 border-b border-border">
            <DialogTitle className="text-sm font-bold">Actions — {client.firstName} {client.lastName}</DialogTitle>
          </DialogHeader>

          {/* Client summary */}
          <div className="rounded-xl bg-muted/50 p-3 space-y-2 -mt-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <img src={client.avatar} alt={client.firstName} className="h-10 w-10 rounded-full bg-muted" />
                <div>
                  <p className="text-sm font-semibold">{client.firstName} {client.lastName}</p>
                  <p className="text-xs text-muted-foreground">{client.totalRides} courses</p>
                </div>
              </div>
              <StatusBadge status={client.status} />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Phone className="h-3 w-3 shrink-0" />
                <span>{client.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Mail className="h-3 w-3 shrink-0" />
                <span className="truncate">{client.email}</span>
              </div>
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
        open={showMotif}
        onClose={() => setShowMotif(false)}
        onConfirm={handleSuspend}
        title="Suspendre le client"
        description={`Vous allez suspendre le compte de ${client.firstName} ${client.lastName}. Cette action peut être annulée ultérieurement.`}
        confirmLabel="Suspendre"
      />
    </>
  );
}
