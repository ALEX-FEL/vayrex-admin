'use client';

import { useState, useMemo } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { StatusBadge } from '@/components/ui/status-badge';
import { ColumnVisibility, useColumnVisibility } from '@/components/ui/column-visibility';
import { rides } from '@/lib/mock-data';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Download, Circle as XCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useRouter } from 'next/navigation';
import type { RideStatus } from '@/types';

const PAGE_SIZE = 15;

const statusOptions: { value: string; label: string }[] = [
  { value: 'ALL', label: 'Tous les statuts' },
  { value: 'EN_ATTENTE', label: 'En attente' },
  { value: 'CHAUFFEUR_ASSIGNÉ', label: 'Chauffeur assigné' },
  { value: 'CHAUFFEUR_EN_ROUTE', label: 'En route' },
  { value: 'ARRIVÉ', label: 'Arrivé' },
  { value: 'COURSE_EN_COURS', label: 'En cours' },
  { value: 'TERMINÉE', label: 'Terminée' },
  { value: 'ANNULÉE', label: 'Annulée' },
];

const columnDefs = [
  { key: 'reference', label: 'Référence' },
  { key: 'client', label: 'Client' },
  { key: 'driver', label: 'Chauffeur' },
  { key: 'vehicle', label: 'Véhicule' },
  { key: 'departure', label: 'Départ' },
  { key: 'destination', label: 'Destination' },
  { key: 'distance', label: 'Distance' },
  { key: 'price', label: 'Prix' },
  { key: 'date', label: 'Date' },
  { key: 'status', label: 'Statut' },
  { key: 'actions', label: 'Actions' },
];

export default function CoursesPage() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [page, setPage] = useState(1);
  const { toggleColumn, isVisible } = useColumnVisibility(
    columnDefs.map((c) => c.key),
    ['distance', 'price', 'date']
  );

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF', maximumFractionDigits: 0 }).format(amount);

  const filtered = useMemo(() => {
    return rides.filter((r) => {
      const matchSearch =
        search === '' ||
        r.reference.toLowerCase().includes(search.toLowerCase()) ||
        r.clientName.toLowerCase().includes(search.toLowerCase()) ||
        (r.driverName ?? '').toLowerCase().includes(search.toLowerCase()) ||
        r.departure.toLowerCase().includes(search.toLowerCase()) ||
        r.destination.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === 'ALL' || r.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [search, statusFilter]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const exportCSV = () => {
    const headers = ['Référence', 'Client', 'Chauffeur', 'Type véhicule', 'Départ', 'Destination', 'Distance (km)', 'Prix (XOF)', 'Date', 'Statut'];
    const rows = filtered.map((r) => [
      r.reference, r.clientName, r.driverName ?? '—', r.vehicleType, r.departure, r.destination,
      r.distance, r.price, format(r.createdAt, 'dd/MM/yyyy HH:mm'), r.status,
    ]);
    const csv = [headers, ...rows].map((row) => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'courses.csv';
    a.click();
  };

  return (
    <DashboardLayout>
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-foreground">Courses</h1>
            <p className="mt-0.5 text-sm text-muted-foreground">{filtered.length} courses trouvées</p>
          </div>
          <Button onClick={exportCSV} variant="outline" size="sm" className="gap-2">
            <Download className="h-3.5 w-3.5" />
            Exporter CSV
          </Button>
        </div>

        {/* Filters */}
        <div className="flex gap-3 items-center">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Rechercher par référence, client..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="pl-9 h-9 text-sm"
            />
          </div>
          <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1); }}>
            <SelectTrigger className="w-48 h-9 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((o) => (
                <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
              ))}
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
                  {isVisible('reference') && <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap">Référence</th>}
                  {isVisible('client') && <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap">Client</th>}
                  {isVisible('driver') && <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap">Chauffeur</th>}
                  {isVisible('vehicle') && <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap">Véhicule</th>}
                  {isVisible('departure') && <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap">Départ</th>}
                  {isVisible('destination') && <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap">Destination</th>}
                  {isVisible('distance') && <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap">Distance</th>}
                  {isVisible('price') && <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap">Prix</th>}
                  {isVisible('date') && <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap">Date</th>}
                  {isVisible('status') && <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap">Statut</th>}
                  {isVisible('actions') && <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {paginated.map((ride) => (
                  <tr key={ride.id} className="hover:bg-muted/30 transition-colors cursor-pointer" onClick={() => router.push(`/courses/${ride.id}`)}>
                    {isVisible('reference') && <td className="px-4 py-3 font-mono text-xs font-medium text-primary">{ride.reference}</td>}
                    {isVisible('client') && <td className="px-4 py-3 whitespace-nowrap font-medium text-xs">{ride.clientName}</td>}
                    {isVisible('driver') && <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">{ride.driverName ?? '—'}</td>}
                    {isVisible('vehicle') && <td className="px-4 py-3 text-xs whitespace-nowrap">
                      <span className="rounded-md bg-muted px-2 py-0.5 text-xs font-medium">{ride.vehicleType}</span>
                    </td>}
                    {isVisible('departure') && <td className="px-4 py-3 text-xs text-muted-foreground max-w-[120px] truncate">{ride.departure}</td>}
                    {isVisible('destination') && <td className="px-4 py-3 text-xs text-muted-foreground max-w-[120px] truncate">{ride.destination}</td>}
                    {isVisible('distance') && <td className="px-4 py-3 text-xs whitespace-nowrap">{ride.distance} km</td>}
                    {isVisible('price') && <td className="px-4 py-3 text-xs font-semibold whitespace-nowrap">{formatCurrency(ride.price)}</td>}
                    {isVisible('date') && <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                      {format(ride.createdAt, 'dd/MM/yy HH:mm', { locale: fr })}
                    </td>}
                    {isVisible('status') && <td className="px-4 py-3">
                      <StatusBadge status={ride.status} />
                    </td>}
                    {isVisible('actions') && <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                      {ride.status !== 'TERMINÉE' && ride.status !== 'ANNULÉE' && (
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive">
                          <XCircle className="h-3.5 w-3.5" />
                        </Button>
                      )}
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
              <Button
                variant="outline"
                size="icon"
                className="h-7 w-7"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
              >
                <ChevronLeft className="h-3.5 w-3.5" />
              </Button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const p = Math.max(1, Math.min(totalPages - 4, page - 2)) + i;
                return (
                  <Button
                    key={p}
                    variant={p === page ? 'default' : 'outline'}
                    size="icon"
                    className="h-7 w-7 text-xs"
                    onClick={() => setPage(p)}
                  >
                    {p}
                  </Button>
                );
              })}
              <Button
                variant="outline"
                size="icon"
                className="h-7 w-7"
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
              >
                <ChevronRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
