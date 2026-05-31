'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard,
  Car,
  Users,
  UserCheck,
  CreditCard,
  Truck,
  Settings,
  ChevronRight,
  Zap,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/courses', label: 'Courses', icon: Car },
  { href: '/drivers', label: 'Chauffeurs', icon: UserCheck },
  { href: '/clients', label: 'Clients', icon: Users },
  { href: '/payments', label: 'Paiements', icon: CreditCard },
  { href: '/vehicle-types', label: 'Types de véhicules', icon: Truck },
  { href: '/pricing', label: 'Tarification', icon: Zap },
  { href: '/settings', label: 'Paramètres', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-50 flex w-60 flex-col border-r border-border bg-card">
      {/* Logo */}
      <div className="flex h-[60px] items-center gap-2.5 border-b border-border px-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
          <Car className="h-4 w-4 text-white" />
        </div>
        <div>
          <p className="text-sm font-bold tracking-wide text-foreground">VAYRIX</p>
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Admin v1</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 scrollbar-hide">
        <div className="space-y-0.5 px-2">
          {navItems.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href || pathname.startsWith(`${href}/`);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'group flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-all duration-150',
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                )}
              >
                <Icon className={cn('h-4 w-4 shrink-0', isActive ? 'text-primary' : '')} />
                <span className="flex-1">{label}</span>
                {isActive && <ChevronRight className="h-3.5 w-3.5 opacity-60" />}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="border-t border-border px-4 py-3">
        <p className="text-[11px] text-muted-foreground">© 2025 VAYRIX Platform</p>
      </div>
    </aside>
  );
}
