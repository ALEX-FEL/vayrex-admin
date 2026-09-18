'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Bell, Moon, Sun, ChevronRight, Menu } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const breadcrumbMap: Record<string, string> = {
  dashboard: 'Dashboard',
  trafic: 'Trafic',
  courses: 'Courses',
  drivers: 'Chauffeurs',
  clients: 'Clients',
  payments: 'Paiements',
  'vehicle-types': 'Types de véhicules',
  pricing: 'Tarification',
  users: 'Utilisateurs',
  settings: 'Paramètres',
};

interface HeaderProps {
  onMenuClick?: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const pathname = usePathname() ?? '/';
  const { theme, setTheme } = useTheme();

  const segments = pathname.split('/').filter(Boolean);
  const crumbs = segments.map((seg, i) => ({
    label: breadcrumbMap[seg] ?? seg,
    href: '/' + segments.slice(0, i + 1).join('/'),
    isLast: i === segments.length - 1,
  }));

  return (
    <header className="fixed left-0 right-0 top-0 z-40 flex h-[60px] items-center justify-between border-b border-border bg-card/80 px-4 backdrop-blur-sm lg:left-60 lg:px-6">
      <div className="flex items-center gap-3">
        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 lg:hidden"
          onClick={onMenuClick}
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Breadcrumb - hidden on small screens */}
        <nav className="hidden items-center gap-1 text-sm sm:flex">
          <Link href="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">
            Accueil
          </Link>
          {crumbs.map((crumb) => (
            <span key={crumb.href} className="flex items-center gap-1">
              <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
              {crumb.isLast ? (
                <span className="font-medium text-foreground">{crumb.label}</span>
              ) : (
                <Link href={crumb.href} className="text-muted-foreground hover:text-foreground transition-colors">
                  {crumb.label}
                </Link>
              )}
            </span>
          ))}
        </nav>

        {/* Mobile page title */}
        <h1 className="text-sm font-semibold sm:hidden">
          {crumbs.length > 0 ? crumbs[crumbs.length - 1].label : 'Accueil'}
        </h1>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        >
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </Button>
        <Button variant="ghost" size="icon" className="relative h-8 w-8 text-muted-foreground">
          <Bell className="h-4 w-4" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-destructive" />
        </Button>
        <div className="ml-1 hidden items-center gap-2 rounded-md border border-border px-2.5 py-1.5 sm:flex">
          <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary">
            A
          </div>
          <span className="text-xs font-medium">Admin</span>
        </div>
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-[10px] font-bold text-primary sm:hidden">
          A
        </div>
      </div>
    </header>
  );
}
