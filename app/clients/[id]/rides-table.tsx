'use client';

import { StatusBadge } from '@/components/ui/status-badge';
import type { Tables } from '@/lib/supabase';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface ClientRidesTableProps {
  rides: Tables<'rides'>[];
}

export function ClientRidesTable({ rides }: ClientRidesTableProps) {
  if (rides.length === 0) {
    return <p className="text-sm text-muted-foreground">Aucune course pour ce client.</p>;
  }

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF', maximumFractionDigits: 0 }).format(amount);

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border">
            {['Réf.', 'Chauffeur', 'Destination', 'Prix', 'Date', 'Statut'].map((h) => (
              <th key={h} className="pb-2 pr-4 text-left text-xs font-medium text-muted-foreground whitespace-nowrap">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {rides.map((ride) => (
            <tr key={ride.id} className="hover:bg-muted/30">
              <td className="py-2.5 pr-4 font-mono text-xs text-primary">{ride.reference}</td>
              <td className="py-2.5 pr-4 text-xs text-muted-foreground whitespace-nowrap">{ride.driver_name ?? '—'}</td>
              <td className="py-2.5 pr-4 text-xs text-muted-foreground max-w-[140px] truncate">{ride.destination}</td>
              <td className="py-2.5 pr-4 text-xs font-semibold whitespace-nowrap">{formatCurrency(ride.price)}</td>
              <td className="py-2.5 pr-4 text-xs text-muted-foreground whitespace-nowrap">{format(new Date(ride.created_at), 'dd/MM/yy', { locale: fr })}</td>
              <td className="py-2.5"><StatusBadge status={ride.status} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
