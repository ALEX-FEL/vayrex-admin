'use client';

import { useState, useMemo } from 'react';
import { StatusBadge } from '@/components/ui/status-badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Eye, CheckCircle, XCircle, PauseCircle, ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import Link from 'next/link';

const PAGE_SIZE = 12;

interface DriverWithVehicle {
  id: string;
  first_name: string;
  last_name: string;
  phone: string;
  avatar: string;
  vehicle_plate: string;
  vehicle_brand: string;
  vehicle_type?: { name: string } | null;
  total_rides: number;
  rating: number;
  status: 'EN_ATTENTE' | 'APPROUVÉ' | 'REFUSÉ' | 'SUSPENDU';
  is_online: boolean;
  created_at: string;
}

interface DriversTableProps {
  drivers: DriverWithVehicle[];
}

export function DriversTable({ drivers }: DriversTableProps) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    return drivers.filter((d) => {
      const name = `${d.first_name} ${d.last_name}`.toLowerCase();
      const matchSearch = search === '' || name.includes(search.toLowerCase()) || d.phone.includes(search) || d.vehicle_plate.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === 'ALL' || d.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [search, statusFilter, drivers]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <>
      <div className="flex gap-3">
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
      </div>

      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-muted/40">
              <tr>
                {['Chauffeur', 'Téléphone', 'Véhicule', 'Immatriculation', 'Note', 'Date inscription', 'Statut', 'En ligne', 'Actions'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {paginated.map((driver) => (
                <tr key={driver.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={driver.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${driver.first_name}`}
                        alt={driver.first_name}
                        className="h-8 w-8 rounded-full bg-muted object-cover"
                      />
                      <div>
                        <p className="text-xs font-medium">{driver.first_name} {driver.last_name}</p>
                        <p className="text-[10px] text-muted-foreground">{driver.total_rides} courses</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">{driver.phone}</td>
                  <td className="px-4 py-3 text-xs">
                    <span className="rounded-md bg-muted px-2 py-0.5 text-xs font-medium">
                      {driver.vehicle_type?.name ?? driver.vehicle_brand}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs">{driver.vehicle_plate}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                      <span className="text-xs font-medium">{driver.rating}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                    {format(new Date(driver.created_at), 'dd/MM/yyyy', { locale: fr })}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={driver.status} />
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex h-2 w-2 rounded-full ${driver.is_online ? 'bg-emerald-500' : 'bg-muted-foreground/30'}`} />
                  </td>
                  <td className="px-4 py-3">
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
    </>
  );
}
