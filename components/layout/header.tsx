'use client';

import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Bell, Moon, Sun, ChevronRight, CheckCheck } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { notifications as initialNotifications } from '@/lib/mock-data';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const breadcrumbMap: Record<string, string> = {
  dashboard: 'Dashboard',
  courses: 'Courses',
  drivers: 'Chauffeurs',
  clients: 'Clients',
  payments: 'Paiements',
  'vehicle-types': 'Types de véhicules',
  pricing: 'Tarification',
  settings: 'Paramètres',
  tickets: 'Tickets',
  admin: 'Administrateurs',
};

const notifTypeIcon: Record<string, string> = {
  DRIVER_PENDING: '🚗',
  HELP_REQUEST: '💬',
  RIDE_CANCELLED: '❌',
  TICKET_REPLY: '↩️',
};

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [notifs, setNotifs] = useState(initialNotifications);
  const [showNotifs, setShowNotifs] = useState(false);

  const unreadCount = notifs.filter((n) => !n.isRead).length;

  const segments = pathname.split('/').filter(Boolean);
  const crumbs = segments.map((seg, i) => ({
    label: breadcrumbMap[seg] ?? seg,
    href: '/' + segments.slice(0, i + 1).join('/'),
    isLast: i === segments.length - 1,
  }));

  const markAllRead = () => {
    setNotifs((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const handleNotifClick = (link: string) => {
    setShowNotifs(false);
    router.push(link);
  };

  return (
    <header className="fixed left-60 right-0 top-0 z-40 flex h-[60px] items-center justify-between border-b border-border bg-card/80 px-6 backdrop-blur-sm">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1 text-sm">
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

        {/* Notifications */}
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="relative h-8 w-8 text-muted-foreground"
            onClick={() => setShowNotifs(!showNotifs)}
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute right-0.5 top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[9px] font-bold text-white">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </Button>

          {showNotifs && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowNotifs(false)} />
              <div className="absolute right-0 top-10 z-50 w-80 rounded-lg border border-border bg-card shadow-lg">
                <div className="flex items-center justify-between border-b border-border px-4 py-3">
                  <h3 className="text-sm font-semibold">Notifications</h3>
                  {unreadCount > 0 && (
                    <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs text-primary" onClick={markAllRead}>
                      <CheckCheck className="h-3.5 w-3.5" />
                      Tout marquer lu
                    </Button>
                  )}
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifs.length === 0 ? (
                    <p className="px-4 py-6 text-center text-xs text-muted-foreground">Aucune notification</p>
                  ) : (
                    notifs.map((notif) => (
                      <button
                        key={notif.id}
                        onClick={() => handleNotifClick(notif.link)}
                        className={cn(
                          'flex w-full items-start gap-3 border-b border-border px-4 py-3 text-left hover:bg-muted/50 transition-colors',
                          !notif.isRead && 'bg-primary/5'
                        )}
                      >
                        <span className="mt-0.5 text-sm">{notifTypeIcon[notif.type] || '🔔'}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className={cn('text-xs', notif.isRead ? 'font-medium text-muted-foreground' : 'font-semibold text-foreground')}>
                              {notif.title}
                            </p>
                            {!notif.isRead && <span className="h-1.5 w-1.5 rounded-full bg-primary" />}
                          </div>
                          <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">{notif.description}</p>
                          <p className="mt-1 text-[10px] text-muted-foreground">
                            {format(notif.createdAt, "dd MMM 'à' HH:mm", { locale: fr })}
                          </p>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        <div className="ml-2 flex items-center gap-2 rounded-md border border-border px-2.5 py-1.5">
          <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary">
            A
          </div>
          <span className="text-xs font-medium">Admin</span>
        </div>
      </div>
    </header>
  );
}
