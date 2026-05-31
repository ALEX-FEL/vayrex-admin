'use client';

import { useState, useMemo } from 'react';
import { StatusBadge } from '@/components/ui/status-badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Eye, PauseCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import Link from 'next/link';
import type { Tables } from '@/lib/supabase';

const PAGE_SIZE = 15;

interface ClientsTableProps {
  clients: Tables<'clients'>[];
}

export function ClientsTable({ clients }: ClientsTableProps) {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    return clients.filter((c) => {
      const name = `${c.first_name} ${c.last_name}`.toLowerCase();
      return search === '' || name.includes(search.toLowerCase()) || c.phone.includes(search) || c.email.toLowerCase().includes(search.toLowerCase());
    });
  }, [search, clients]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF', maximumFractionDigits: 0 }).format(amount);

  return (
    <>
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Rechercher un client..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="pl-9 h-9 text-sm"
        />
      </div>

      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-muted/40">
              <tr>
                {['Client', 'Téléphone', 'Email', 'Courses', 'Total dépensé', 'Date inscription', 'Statut', 'Actions'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {paginated.map((client) => (
                <tr key={client.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <img src={client.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${client.first_name}`} alt={client.first_name} className="h-8 w-8 rounded-full bg-muted" />
                      <p className="text-xs font-medium">{client.first_name} {client.last_name}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">{client.phone}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{client.email}</td>
                  <td className="px-4 py-3 text-xs font-semibold">{client.total_rides}</td>
                  <td className="px-4 py-3 text-xs font-semibold whitespace-nowrap">{formatCurrency(client.total_spent)}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">{format(new Date(client.created_at), 'dd/MM/yyyy', { locale: fr })}</td>
                  <td className="px-4 py-3"><StatusBadge status={client.status} /></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <Link href={`/clients/${client.id}`}>
                        <Button variant="ghost" size="icon" className="h-7 w-7"><Eye className="h-3.5 w-3.5" /></Button>
                      </Link>
                      {client.status === 'ACTIF' && (
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-amber-600 hover:text-amber-700"><PauseCircle className="h-3.5 w-3.5" /></Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between border-t border-border px-4 py-3">
          <p className="text-xs text-muted-foreground">{(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} sur {filtered.length}</p>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="icon" className="h-7 w-7" disabled={page === 1} onClick={() => setPage(page - 1)}><ChevronLeft className="h-3.5 w-3.5" /></Button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const p = Math.max(1, Math.min(totalPages - 4, page - 2)) + i;
              return <Button key={p} variant={p === page ? 'default' : 'outline'} size="icon" className="h-7 w-7 text-xs" onClick={() => setPage(p)}>{p}</Button>;
            })}
            <Button variant="outline" size="icon" className="h-7 w-7" disabled={page === totalPages} onClick={() => setPage(page + 1)}><ChevronRight className="h-3.5 w-3.5" /></Button>
          </div>
        </div>
      </div>
    </>
  );
}
