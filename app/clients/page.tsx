'use client';

import { useState, useMemo } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { StatusBadge } from '@/components/ui/status-badge';
import { ColumnVisibility, useColumnVisibility } from '@/components/ui/column-visibility';
import { clients } from '@/lib/mock-data';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Eye, CirclePause as PauseCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import Link from 'next/link';

const PAGE_SIZE = 15;

const columnDefs = [
  { key: 'client', label: 'Client' },
  { key: 'phone', label: 'Téléphone' },
  { key: 'email', label: 'Email' },
  { key: 'rides', label: 'Courses' },
  { key: 'spent', label: 'Total dépensé' },
  { key: 'date', label: 'Date inscription' },
  { key: 'status', label: 'Statut' },
  { key: 'actions', label: 'Actions' },
];

export default function ClientsPage() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const { toggleColumn, isVisible } = useColumnVisibility(
    columnDefs.map((c) => c.key),
    ['status', 'actions', 'date']
  );

  const filtered = useMemo(() => {
    return clients.filter((c) => {
      const name = `${c.firstName} ${c.lastName}`.toLowerCase();
      return search === '' || name.includes(search.toLowerCase()) || c.phone.includes(search) || c.email.toLowerCase().includes(search.toLowerCase());
    });
  }, [search]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF', maximumFractionDigits: 0 }).format(amount);

  return (
    <DashboardLayout>
      <div className="space-y-5">
        <div>
          <h1 className="text-xl font-bold text-foreground">Clients</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">{filtered.length} clients trouvés</p>
        </div>

        <div className="flex gap-3 items-center">
          <div className="relative max-w-sm flex-1">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Rechercher un client..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="pl-9 h-9 text-sm"
            />
          </div>
          <ColumnVisibility columns={columnDefs} visibleColumns={Object.fromEntries(columnDefs.map((c) => [c.key, isVisible(c.key)]))} onToggle={toggleColumn} />
        </div>

        <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-border bg-muted/40">
                <tr>
                  {isVisible('client') && <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap">Client</th>}
                  {isVisible('phone') && <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap">Téléphone</th>}
                  {isVisible('email') && <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap">Email</th>}
                  {isVisible('rides') && <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap">Courses</th>}
                  {isVisible('spent') && <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap">Total dépensé</th>}
                  {isVisible('date') && <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap">Date inscription</th>}
                  {isVisible('status') && <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap">Statut</th>}
                  {isVisible('actions') && <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {paginated.map((client) => (
                  <tr key={client.id} className="hover:bg-muted/30 transition-colors">
                    {isVisible('client') && <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <img src={client.avatar} alt={client.firstName} className="h-8 w-8 rounded-full bg-muted" />
                        <p className="text-xs font-medium">{client.firstName} {client.lastName}</p>
                      </div>
                    </td>}
                    {isVisible('phone') && <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">{client.phone}</td>}
                    {isVisible('email') && <td className="px-4 py-3 text-xs text-muted-foreground">{client.email}</td>}
                    {isVisible('rides') && <td className="px-4 py-3 text-xs font-semibold">{client.totalRides}</td>}
                    {isVisible('spent') && <td className="px-4 py-3 text-xs font-semibold whitespace-nowrap">{formatCurrency(client.totalSpent)}</td>}
                    {isVisible('date') && <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                      {format(client.createdAt, 'dd/MM/yyyy', { locale: fr })}
                    </td>}
                    {isVisible('status') && <td className="px-4 py-3">
                      <StatusBadge status={client.status} />
                    </td>}
                    {isVisible('actions') && <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <Link href={`/clients/${client.id}`}>
                          <Button variant="ghost" size="icon" className="h-7 w-7">
                            <Eye className="h-3.5 w-3.5" />
                          </Button>
                        </Link>
                        {client.status === 'ACTIF' && (
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-amber-600 hover:text-amber-700">
                            <PauseCircle className="h-3.5 w-3.5" />
                          </Button>
                        )}
                      </div>
                    </td>}
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
    </DashboardLayout>
  );
}
