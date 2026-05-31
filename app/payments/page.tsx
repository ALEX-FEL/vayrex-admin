import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { StatCard } from '@/components/ui/stat-card';
import { PaymentMethodChart } from '@/components/charts/payment-method-chart';
import { getPayments, getPaymentStats, getPaymentMethodDistribution } from '@/lib/db';
import { CreditCard, TrendingUp, Banknote, Smartphone } from 'lucide-react';
import { PaymentsTable } from './table';

export const dynamic = 'force-dynamic';

export default async function PaymentsPage() {
  const [payments, stats, methodDist] = await Promise.all([
    getPayments(),
    getPaymentStats(),
    getPaymentMethodDistribution(),
  ]);

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF', maximumFractionDigits: 0 }).format(amount);

  return (
    <DashboardLayout>
      <div className="space-y-5">
        <div>
          <h1 className="text-xl font-bold text-foreground">Paiements</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">{payments.length} paiements trouvés</p>
        </div>

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard title="Revenu total" value={formatCurrency(stats.totalRevenue)} icon={CreditCard} iconBg="bg-primary/10" iconColor="text-primary" trend={24} />
          <StatCard title="Revenu du mois" value={formatCurrency(stats.monthRevenue)} icon={TrendingUp} iconBg="bg-emerald-50 dark:bg-emerald-950/30" iconColor="text-emerald-600" />
          <StatCard title="Total Cash" value={formatCurrency(stats.cashTotal)} icon={Banknote} iconBg="bg-amber-50 dark:bg-amber-950/30" iconColor="text-amber-600" />
          <StatCard title="Mobile Money" value={formatCurrency(stats.mobileTotal)} icon={Smartphone} iconBg="bg-blue-50 dark:bg-blue-950/30" iconColor="text-blue-600" />
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <PaymentsTable payments={payments} />
          </div>
          <div>
            <PaymentMethodChart data={methodDist} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
