import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { StatCard } from '@/components/ui/stat-card';
import { StatusBadge } from '@/components/ui/status-badge';
import { RidesEvolutionChart } from '@/components/charts/rides-evolution';
import { VehicleDistributionChart } from '@/components/charts/vehicle-distribution';
import { RideStatusChart } from '@/components/charts/ride-status-chart';
import {
  getDashboardStats,
  getRides,
  getMonthlyRidesData,
  getVehicleTypeDistribution,
  getRideStatusDistribution,
} from '@/lib/db';
import { Users, UserCheck, Car, CreditCard, CheckCircle, XCircle, Activity } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const [stats, recentRides, monthlyData, vehicleDist, statusDist] = await Promise.all([
    getDashboardStats(),
    getRides(10),
    getMonthlyRidesData(),
    getVehicleTypeDistribution(),
    getRideStatusDistribution(),
  ]);

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF', maximumFractionDigits: 0 }).format(amount);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-bold text-foreground">Tableau de bord</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">Vue d'ensemble de la plateforme VAYRIX</p>
        </div>

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard title="Total clients" value={stats.totalClients} icon={Users} iconBg="bg-blue-50 dark:bg-blue-950/30" iconColor="text-blue-600" trend={12} />
          <StatCard title="Total chauffeurs" value={stats.totalDrivers} icon={UserCheck} iconBg="bg-emerald-50 dark:bg-emerald-950/30" iconColor="text-emerald-600" trend={5} />
          <StatCard title="Chauffeurs actifs" value={stats.activeDrivers} icon={Activity} iconBg="bg-teal-50 dark:bg-teal-950/30" iconColor="text-teal-600" subtitle="En ligne maintenant" />
          <StatCard title="Total courses" value={stats.totalRides} icon={Car} iconBg="bg-primary/10" iconColor="text-primary" trend={18} />
        </div>

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard title="Courses du jour" value={stats.todayRides} icon={Car} iconBg="bg-sky-50 dark:bg-sky-950/30" iconColor="text-sky-600" />
          <StatCard title="Courses terminées" value={stats.completedRides} icon={CheckCircle} iconBg="bg-emerald-50 dark:bg-emerald-950/30" iconColor="text-emerald-600" />
          <StatCard title="Courses annulées" value={stats.cancelledRides} icon={XCircle} iconBg="bg-red-50 dark:bg-red-950/30" iconColor="text-destructive" />
          <StatCard title="Revenus estimés" value={formatCurrency(stats.estimatedRevenue)} icon={CreditCard} iconBg="bg-amber-50 dark:bg-amber-950/30" iconColor="text-amber-600" trend={24} />
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2"><RidesEvolutionChart data={monthlyData} /></div>
          <div><VehicleDistributionChart data={vehicleDist} /></div>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <div className="lg:col-span-1"><RideStatusChart data={statusDist} /></div>
          <div className="lg:col-span-2 rounded-xl border border-border bg-card p-5 shadow-sm">
            <h3 className="mb-4 text-sm font-semibold text-foreground">Activité récente</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    {['Heure', 'Client', 'Chauffeur', 'Destination', 'Montant', 'Statut'].map((h) => (
                      <th key={h} className="pb-2 pr-4 text-left text-xs font-medium text-muted-foreground">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {recentRides.map((ride) => (
                    <tr key={ride.id} className="hover:bg-muted/40 transition-colors">
                      <td className="py-2.5 pr-4 text-xs text-muted-foreground whitespace-nowrap">{format(new Date(ride.created_at), 'HH:mm', { locale: fr })}</td>
                      <td className="py-2.5 pr-4 font-medium text-xs whitespace-nowrap">{ride.client_name}</td>
                      <td className="py-2.5 pr-4 text-xs text-muted-foreground whitespace-nowrap">{ride.driver_name ?? '—'}</td>
                      <td className="py-2.5 pr-4 text-xs text-muted-foreground max-w-[140px] truncate">{ride.destination}</td>
                      <td className="py-2.5 pr-4 text-xs font-semibold whitespace-nowrap">{formatCurrency(ride.price)}</td>
                      <td className="py-2.5"><StatusBadge status={ride.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
