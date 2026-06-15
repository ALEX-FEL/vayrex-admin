'use client';

import { useState, useMemo } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { StatusBadge } from '@/components/ui/status-badge';
import { drivers as allDrivers } from '@/lib/mock-data';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, MoreHorizontal, ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { DriverActionsModal } from '@/components/modals/driver-actions-modal';
import { ColumnVisibilityToggle } from '@/components/ui/column-visibility-toggle';
import type { Driver, DriverStatus } from '@/types';

const PAGE_SIZE = 12;

const ALL_COLUMNS = ['Chauffeur', 'Téléphone', 'Véhicule', 'Immatriculation', 'Note', 'Date inscription', 'Statut', 'En ligne', 'Motif'];
const DEFAULT_HIDDEN = new Set(['En ligne', 'Motif']);

export default function DriversPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [page, setPage] = useState(1);
  const [drivers, setDrivers] = useState<Driver[]>(allDrivers);
  const [actionsDriver, setActionsDriver] = useState<Driver | null>(null);
  const [hiddenColumns, setHiddenColumns] = useState<Set<string>>(DEFAULT_HIDDEN);

  const filtered = useMemo(() => {
    return drivers.filter((d) => {
      const name = `${d.firstName} ${d.lastName}`.toLowerCase();
      const matchSearch = search === '' || name.includes(search.toLowerCase()) || d.phone.includes(search) || d.vehiclePlate.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === 'ALL' || d.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [search, statusFilter, drivers]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const updateStatus = (driverId: string, status: DriverStatus, motif?: string) => {
    setDrivers((prev) => prev.map((d) => d.id === driverId ? { ...d, status, motif: motif ?? d.motif } : d));
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
          <h1 className="text-xl font-bold text-foreground">Chauffeurs</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">{filtered.length} chauffeurs trouvés</p>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1 sm:max-w-sm">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Rechercher un chauffeur..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="pl-9 h-9 text-sm"
            />
          </div>
          <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1); }}>
            <SelectTrigger className="w-full h-9 text-sm sm:w-44">
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
          <ColumnVisibilityToggle
            columns={ALL_COLUMNS}
            hidden={hiddenColumns}
            onToggle={toggleColumn}
            locked={['Chauffeur', 'Statut']}
          />
        </div>

        {/* Table */}
        <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <table className="w-full min-w-[700px] text-sm">
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
                {paginated.map((driver) => (
                  <tr
                    key={driver.id}
                    className="hover:bg-muted/30 transition-colors cursor-pointer"
                    onClick={() => window.location.href = `/drivers/${driver.id}`}
                  >
                    {!hiddenColumns.has('Chauffeur') && (
                      <td className="px-4 py-3">
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
                      </td>
                    )}
                    {!hiddenColumns.has('Téléphone') && (
                      <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">{driver.phone}</td>
                    )}
                    {!hiddenColumns.has('Véhicule') && (
                      <td className="px-4 py-3 text-xs">
                        <span className="rounded-md bg-muted px-2 py-0.5 text-xs font-medium">{driver.vehicleType}</span>
                      </td>
                    )}
                    {!hiddenColumns.has('Immatriculation') && (
                      <td className="px-4 py-3 font-mono text-xs">{driver.vehiclePlate}</td>
                    )}
                    {!hiddenColumns.has('Note') && (
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                          <span className="text-xs font-medium">{driver.rating}</span>
                        </div>
                      </td>
                    )}
                    {!hiddenColumns.has('Date inscription') && (
                      <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                        {format(driver.createdAt, 'dd/MM/yyyy', { locale: fr })}
                      </td>
                    )}
                    {!hiddenColumns.has('Statut') && (
                      <td className="px-4 py-3">
                        <StatusBadge status={driver.status} />
                      </td>
                    )}
                    {!hiddenColumns.has('En ligne') && (
                      <td className="px-4 py-3">
                        <span className={`inline-flex h-2 w-2 rounded-full ${driver.isOnline ? 'bg-emerald-500' : 'bg-muted-foreground/30'}`} />
                      </td>
                    )}
                    {!hiddenColumns.has('Motif') && (
                      <td className="px-4 py-3 text-xs text-muted-foreground max-w-[120px] truncate">
                        {driver.motif || '—'}
                      </td>
                    )}
                    <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => setActionsDriver(driver)}
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

      <DriverActionsModal
        driver={actionsDriver}
        open={!!actionsDriver}
        onClose={() => setActionsDriver(null)}
        onApprove={(id) => updateStatus(id, 'APPROUVÉ')}
        onReject={(id, motif) => updateStatus(id, 'REFUSÉ', motif)}
        onSuspend={(id, motif) => updateStatus(id, 'SUSPENDU', motif)}
        onReactivate={(id) => updateStatus(id, 'APPROUVÉ')}
      />
    </DashboardLayout>
  );
}
