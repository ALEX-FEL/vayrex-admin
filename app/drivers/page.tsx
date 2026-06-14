'use client';

import { useState, useMemo } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { StatusBadge } from '@/components/ui/status-badge';
import { ColumnVisibility, useColumnVisibility } from '@/components/ui/column-visibility';
import { drivers } from '@/lib/mock-data';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Eye, CircleCheck as CheckCircle, Circle as XCircle, CirclePause as PauseCircle, ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import Link from 'next/link';

const PAGE_SIZE = 12;

const columnDefs = [
  { key: 'driver', label: 'Chauffeur' },
  { key: 'phone', label: 'Téléphone' },
  { key: 'vehicle', label: 'Véhicule' },
  { key: 'plate', label: 'Immatriculation' },
  { key: 'rating', label: 'Note' },
  { key: 'date', label: 'Date inscription' },
  { key: 'status', label: 'Statut' },
  { key: 'online', label: 'En ligne' },
  { key: 'actions', label: 'Actions' },
];

export default function DriversPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [page, setPage] = useState(1);
  const { toggleColumn, isVisible } = useColumnVisibility(
    columnDefs.map((c) => c.key),
    ['online', 'status', 'actions']
  );

  const filtered = useMemo(() => {
    return drivers.filter((d) => {
      const name = `${d.firstName} ${d.lastName}`.toLowerCase();
      const matchSearch = search === '' || name.includes(search.toLowerCase()) || d.phone.includes(search) || d.vehiclePlate.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === 'ALL' || d.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [search, statusFilter]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <DashboardLayout>
      <div className="space-y-5">
        <div>
          <h1 className="text-xl font-bold text-foreground">Chauffeurs</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">{filtered.length} chauffeurs trouvés</p>
        </div>

        {/* Filters */}
        <div className="flex gap-3 items-center">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Rechercher un chauffeur..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="pl-9 h-9 text-sm"
            />
          </div>
          <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1); }}>
            <SelectTrigger className="w-44 h-9 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Tous les statuts</SelectItem>
              <SelectItem value="EN_ATTENTE">En attente</SelectItem>
              <SelectItem value="APPROUVÉ">Approuvé</SelectItem>
              <SelectItem value="REFUSÉ">Refusé</SelectItem>
              <SelectItem value="SUSPENDU">Suspendu</SelectItem>
            </SelectContent>
          </Select>
          <ColumnVisibility columns={columnDefs} visibleColumns={Object.fromEntries(columnDefs.map((c) => [c.key, isVisible(c.key)]))} onToggle={toggleColumn} />
        </div>

        {/* Table */}
        <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-border bg-muted/40">
                <tr>
                  {isVisible('driver') && <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap">Chauffeur</th>}
                  {isVisible('phone') && <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap">Téléphone</th>}
                  {isVisible('vehicle') && <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap">Véhicule</th>}
                  {isVisible('plate') && <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap">Immatriculation</th>}
                  {isVisible('rating') && <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap">Note</th>}
                  {isVisible('date') && <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap">Date inscription</th>}
                  {isVisible('status') && <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap">Statut</th>}
                  {isVisible('online') && <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap">En ligne</th>}
                  {isVisible('actions') && <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {paginated.map((driver) => (
                  <tr key={driver.id} className="hover:bg-muted/30 transition-colors">
                    {isVisible('driver') && <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={driver.avatar}
                          alt={driver.firstName}
                          className="h-8 w-8 rounded-full bg-muted object-cover"
                        />
                        <div>
                          <p className="text-xs font-medium">{driver.firstName} {driver.lastName}</p>
                          <p className="text-[10px] text-muted-foreground">{driver.totalRides} courses</p>
                        </div>
                      </div>
                    </td>}
                    {isVisible('phone') && <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">{driver.phone}</td>}
                    {isVisible('vehicle') && <td className="px-4 py-3 text-xs">
                      <span className="rounded-md bg-muted px-2 py-0.5 text-xs font-medium">{driver.vehicleType}</span>
                    </td>}
                    {isVisible('plate') && <td className="px-4 py-3 font-mono text-xs">{driver.vehiclePlate}</td>}
                    {isVisible('rating') && <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                        <span className="text-xs font-medium">{driver.rating}</span>
                      </div>
                    </td>}
                    {isVisible('date') && <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                      {format(driver.createdAt, 'dd/MM/yyyy', { locale: fr })}
                    </td>}
                    {isVisible('status') && <td className="px-4 py-3">
                      <StatusBadge status={driver.status} />
                    </td>}
                    {isVisible('online') && <td className="px-4 py-3">
                      <span className={`inline-flex h-2 w-2 rounded-full ${driver.isOnline ? 'bg-emerald-500' : 'bg-muted-foreground/30'}`} />
                    </td>}
                    {isVisible('actions') && <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <Link href={`/drivers/${driver.id}`}>
                          <Button variant="ghost" size="icon" className="h-7 w-7">
                            <Eye className="h-3.5 w-3.5" />
                          </Button>
                        </Link>
                        {driver.status === 'EN_ATTENTE' && (
                          <>
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-emerald-600 hover:text-emerald-700">
                              <CheckCircle className="h-3.5 w-3.5" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive">
                              <XCircle className="h-3.5 w-3.5" />
                            </Button>
                          </>
                        )}
                        {driver.status === 'APPROUVÉ' && (
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

          {/* Pagination */}
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
