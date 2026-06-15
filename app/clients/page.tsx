'use client';

import { useState, useMemo } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { StatusBadge } from '@/components/ui/status-badge';
import { clients as allClients } from '@/lib/mock-data';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, MoreHorizontal, ChevronLeft, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { ClientActionsModal } from '@/components/modals/client-actions-modal';
import { ColumnVisibilityToggle } from '@/components/ui/column-visibility-toggle';
import type { Client, ClientStatus } from '@/types';

const PAGE_SIZE = 15;

const ALL_COLUMNS = ['Client', 'Téléphone', 'Email', 'Courses', 'Total dépensé', 'Date inscription', 'Statut', 'Motif'];
const DEFAULT_HIDDEN = new Set(['Courses', 'Total dépensé', 'Motif']);

export default function ClientsPage() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [clients, setClients] = useState<Client[]>(allClients);
  const [actionsClient, setActionsClient] = useState<Client | null>(null);
  const [hiddenColumns, setHiddenColumns] = useState<Set<string>>(DEFAULT_HIDDEN);

  const filtered = useMemo(() => {
    return clients.filter((c) => {
      const name = `${c.firstName} ${c.lastName}`.toLowerCase();
      return search === '' || name.includes(search.toLowerCase()) || c.phone.includes(search) || c.email.toLowerCase().includes(search.toLowerCase());
    });
  }, [search, clients]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF', maximumFractionDigits: 0 }).format(amount);

  const handleToggleStatus = (clientId: string, motif?: string) => {
    setClients((prev) =>
      prev.map((c) =>
        c.id === clientId
          ? { ...c, status: (c.status === 'ACTIF' ? 'SUSPENDU' : 'ACTIF') as ClientStatus, motif: motif ?? c.motif }
          : c
      )
    );
  };

  const toggleColumn = (col: string) => {
    setHiddenColumns((prev) => {
      const next = new Set(prev);
      if (next.has(col)) next.delete(col);
      else next.add(col);
      return next;
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-5">
        <div>
          <h1 className="text-xl font-bold text-foreground">Clients</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">{filtered.length} clients trouvés</p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1 sm:max-w-sm">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Rechercher un client..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="pl-9 h-9 text-sm"
            />
          </div>
          <ColumnVisibilityToggle
            columns={ALL_COLUMNS}
            hidden={hiddenColumns}
            onToggle={toggleColumn}
            locked={['Client', 'Statut']}
          />
        </div>

        <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <table className="w-full min-w-[500px] text-sm">
              <thead className="border-b border-border bg-muted/40">
                <tr>
                  {ALL_COLUMNS.filter((c) => !hiddenColumns.has(c)).map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {paginated.map((client) => (
                  <tr
                    key={client.id}
                    className="hover:bg-muted/30 transition-colors cursor-pointer"
                    onClick={() => window.location.href = `/clients/${client.id}`}
                  >
                    {!hiddenColumns.has('Client') && (
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <img src={client.avatar} alt={client.firstName} className="h-8 w-8 rounded-full bg-muted" />
                          <p className="text-xs font-medium">{client.firstName} {client.lastName}</p>
                        </div>
                      </td>
                    )}
                    {!hiddenColumns.has('Téléphone') && (
                      <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">{client.phone}</td>
                    )}
                    {!hiddenColumns.has('Email') && (
                      <td className="px-4 py-3 text-xs text-muted-foreground">{client.email}</td>
                    )}
                    {!hiddenColumns.has('Courses') && (
                      <td className="px-4 py-3 text-xs font-semibold">{client.totalRides}</td>
                    )}
                    {!hiddenColumns.has('Total dépensé') && (
                      <td className="px-4 py-3 text-xs font-semibold whitespace-nowrap">{formatCurrency(client.totalSpent)}</td>
                    )}
                    {!hiddenColumns.has('Date inscription') && (
                      <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                        {format(client.createdAt, 'dd/MM/yyyy', { locale: fr })}
                      </td>
                    )}
                    {!hiddenColumns.has('Statut') && (
                      <td className="px-4 py-3">
                        <StatusBadge status={client.status} />
                      </td>
                    )}
                    {!hiddenColumns.has('Motif') && (
                      <td className="px-4 py-3 text-xs text-muted-foreground max-w-[120px] truncate">
                        {client.motif || '—'}
                      </td>
                    )}
                    <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => setActionsClient(client)}
                        title="Actions"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between border-t border-border px-4 py-3">
            <p className="text-xs text-muted-foreground">
              {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} sur {filtered.length}
            </p>
            <div className="flex items-center gap-1">
              <Button variant="outline" size="icon" className="h-7 w-7" disabled={page === 1} onClick={() => setPage(page - 1)}>
                <ChevronLeft className="h-3.5 w-3.5" />
              </Button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const p = Math.max(1, Math.min(totalPages - 4, page - 2)) + i;
                return (
                  <Button key={p} variant={p === page ? 'default' : 'outline'} size="icon" className="h-7 w-7 text-xs" onClick={() => setPage(p)}>
                    {p}
                  </Button>
                );
              })}
              <Button variant="outline" size="icon" className="h-7 w-7" disabled={page === totalPages} onClick={() => setPage(page + 1)}>
                <ChevronRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <ClientActionsModal
        client={actionsClient}
        open={!!actionsClient}
        onClose={() => setActionsClient(null)}
        onToggleStatus={handleToggleStatus}
      />
    </DashboardLayout>
  );
}
