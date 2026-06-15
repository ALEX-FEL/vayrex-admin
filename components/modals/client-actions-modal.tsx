'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { StatusBadge } from '@/components/ui/status-badge';
import Link from 'next/link';
import { Eye, PauseCircle, PlayCircle, ChevronRight, User, Phone, Mail } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import type { Client } from '@/types';

interface ClientActionsModalProps {
  client: Client | null;
  open: boolean;
  onClose: () => void;
  onToggleStatus?: (clientId: string) => void;
}

export function ClientActionsModal({
  client,
  open,
  onClose,
  onToggleStatus,
}: ClientActionsModalProps) {
  if (!client) return null;

  const isActive = client.status === 'ACTIF';

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF', maximumFractionDigits: 0 }).format(amount);

  const actions = [
    {
      label: 'Voir le profil',
      description: 'Consulter la fiche complète du client',
      icon: Eye,
      iconBg: 'bg-primary/10',
      iconColor: 'text-primary',
      href: `/clients/${client.id}`,
    },
    {
      label: isActive ? 'Suspendre le compte' : 'Réactiver le compte',
      description: isActive
        ? 'Empêcher temporairement ce client d\'utiliser la plateforme'
        : 'Permettre à ce client d\'utiliser à nouveau la plateforme',
      icon: isActive ? PauseCircle : PlayCircle,
      iconBg: isActive ? 'bg-amber-50 dark:bg-amber-950/30' : 'bg-emerald-50 dark:bg-emerald-950/30',
      iconColor: isActive ? 'text-amber-600' : 'text-emerald-600',
      destructive: isActive,
      onClick: () => {
        onToggleStatus?.(client.id);
        onClose();
      },
    },
  ] as const;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-md w-full">
        <DialogHeader className="pb-3 border-b border-border">
          <DialogTitle className="text-sm font-bold">Actions — Client</DialogTitle>
        </DialogHeader>

        {/* Client summary */}
        <div className="rounded-xl bg-muted/50 p-3 space-y-2 -mt-1">
          <div className="flex items-center gap-3">
            <img
              src={client.avatar}
              alt={client.firstName}
              className="h-10 w-10 rounded-full bg-muted shrink-0"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">{client.firstName} {client.lastName}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <StatusBadge status={client.status} />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Phone className="h-3 w-3 shrink-0" />
            <span>{client.phone}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Mail className="h-3 w-3 shrink-0" />
            <span className="truncate">{client.email}</span>
          </div>
          <div className="flex gap-4 pt-1">
            <div>
              <p className="text-[10px] text-muted-foreground">Courses</p>
              <p className="text-xs font-semibold">{client.totalRides}</p>
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground">Total dépensé</p>
              <p className="text-xs font-semibold">{formatCurrency(client.totalSpent)}</p>
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground">Inscrit le</p>
              <p className="text-xs font-semibold">{format(client.createdAt, 'dd/MM/yyyy', { locale: fr })}</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2">
          {actions.map((action) => {
            const Icon = action.icon;
            const sharedCls = cn(
              'w-full flex items-center gap-3 rounded-xl border p-3.5 text-left transition-all duration-150 group',
              'destructive' in action && action.destructive
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

            if ('href' in action) {
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
