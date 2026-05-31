'use client';

import { useState, useMemo } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { StatusBadge } from '@/components/ui/status-badge';
import { StatCard } from '@/components/ui/stat-card';
import { PaymentMethodChart } from '@/components/charts/payment-method-chart';
import { payments, getPaymentStats } from '@/lib/mock-data';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, ChevronLeft, ChevronRight, CreditCard, TrendingUp, Banknote, Smartphone } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const PAGE_SIZE = 15;

export default function PaymentsPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [methodFilter, setMethodFilter] = useState('ALL');
  const [page, setPage] = useState(1);

  const stats = getPaymentStats();

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF', maximumFractionDigits: 0 }).format(amount);

  const filtered = useMemo(() => {
    return payments.filter((p) => {
      const matchSearch = search === '' || p.reference.toLowerCase().includes(search.toLowerCase()) ||
        p.clientName.toLowerCase().includes(search.toLowerCase()) ||
        p.driverName.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === 'ALL' || p.status === statusFilter;
      const matchMethod = methodFilter === 'ALL' || p.method === methodFilter;
      return matchSearch && matchStatus && matchMethod;
    });
  }, [search, statusFilter, methodFilter]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <DashboardLayout>
      <div className="space-y-5">
        <div>
          <h1 className="text-xl font-bold text-foreground">Paiements</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">{filtered.length} paiements trouvés</p>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard title="Revenu total" value={formatCurrency(stats.totalRevenue)} icon={CreditCard} iconBg="bg-primary/10" iconColor="text-primary" trend={24} />
          <StatCard title="Revenu du mois" value={formatCurrency(stats.monthRevenue)} icon={TrendingUp} iconBg="bg-emerald-50 dark:bg-emerald-950/30" iconColor="text-emerald-600" />
          <StatCard title="Total Cash" value={formatCurrency(stats.cashTotal)} icon={Banknote} iconBg="bg-amber-50 dark:bg-amber-950/30" iconColor="text-amber-600" />
          <StatCard title="Mobile Money" value={formatCurrency(stats.mobileTotal)} icon={Smartphone} iconBg="bg-blue-50 dark:bg-blue-950/30" iconColor="text-blue-600" />
        </div>

        <div className="grid gap-4 lg:grid-cols-1">
          <div className="lg:col-span-2 space-y-4">
            {/* Filters */}
            <div className="flex gap-3">
              <div className="relative flex-1 max-w-xs">
                <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Rechercher un paiement..."
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                  className="pl-9 h-9 text-sm"
                />
              </div>
              <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1); }}>
                <SelectTrigger className="w-36 h-9 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Tous</SelectItem>
                  <SelectItem value="PAYÉ">Payé</SelectItem>
                  <SelectItem value="EN_ATTENTE">En attente</SelectItem>
                </SelectContent>
              </Select>
              <Select value={methodFilter} onValueChange={(v) => { setMethodFilter(v); setPage(1); }}>
                <SelectTrigger className="w-40 h-9 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Tous les modes</SelectItem>
                  <SelectItem value="CASH">Cash</SelectItem>
                  <SelectItem value="MOBILE_MONEY">Mobile Money</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Table */}
            <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b border-border bg-muted/40">
                    <tr>
                      {['Référence', 'Client', 'Chauffeur', 'Montant', 'Mode', 'Date', 'Statut'].map((h) => (
                        <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {paginated.map((payment) => (
                      <tr key={payment.id} className="hover:bg-muted/30 transition-colors">
                        <td className="px-4 py-3 font-mono text-xs font-medium text-primary">{payment.reference}</td>
                        <td className="px-4 py-3 text-xs font-medium whitespace-nowrap">{payment.clientName}</td>
                        <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">{payment.driverName || '—'}</td>
                        <td className="px-4 py-3 text-xs font-bold whitespace-nowrap">{formatCurrency(payment.amount)}</td>
                        <td className="px-4 py-3">
                          <span className={`rounded-full border px-2 py-0.5 text-xs font-medium ${
                            payment.method === 'CASH'
                              ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-800'
                              : 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-800'
                          }`}>
                            {payment.method === 'CASH' ? 'Cash' : 'Mobile Money'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                          {format(payment.createdAt, 'dd/MM/yy HH:mm', { locale: fr })}
                        </td>
                        <td className="px-4 py-3">
                          <StatusBadge status={payment.status} />
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

          {/* Chart */}
          {/* <div>
            <PaymentMethodChart />
          </div> */}
        </div>
      </div>
    </DashboardLayout>
  );
}
