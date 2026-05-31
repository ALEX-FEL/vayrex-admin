import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  iconColor?: string;
  iconBg?: string;
  trend?: number;
  subtitle?: string;
}

export function StatCard({
  title,
  value,
  icon: Icon,
  iconColor = 'text-primary',
  iconBg = 'bg-primary/10',
  trend,
  subtitle,
}: StatCardProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {title}
          </p>
          <p className="mt-2 text-2xl font-bold text-foreground">{value}</p>
          {subtitle && (
            <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>
          )}
          {trend !== undefined && (
            <div className={cn('mt-2 flex items-center gap-1 text-xs font-medium', trend >= 0 ? 'text-emerald-600' : 'text-destructive')}>
              {trend >= 0 ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
              <span>{Math.abs(trend)}% ce mois</span>
            </div>
          )}
        </div>
        <div className={cn('flex h-10 w-10 items-center justify-center rounded-lg', iconBg)}>
          <Icon className={cn('h-5 w-5', iconColor)} />
        </div>
      </div>
    </div>
  );
}
