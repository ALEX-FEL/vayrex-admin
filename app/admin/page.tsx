'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { ColumnVisibility, useColumnVisibility } from '@/components/ui/column-visibility';
import { adminUsers, actionHistory } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, ShieldCheck, UserCog, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import type { AdminRole, AdminUser } from '@/types';
import { cn } from '@/lib/utils';

const columnDefs = [
  { key: 'name', label: 'Nom' },
  { key: 'email', label: 'Email' },
  { key: 'role', label: 'Rôle' },
  { key: 'status', label: 'Statut' },
  { key: 'date', label: 'Date création' },
  { key: 'actions', label: 'Actions' },
];

const roleLabels: Record<AdminRole, { label: string; className: string }> = {
  ADMIN: { label: 'Admin', className: 'bg-primary/10 text-primary border-primary/20' },
  GESTIONNAIRE: { label: 'Gestionnaire', className: 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/30 dark:text-sky-400 dark:border-sky-800' },
};

export default function AdminPage() {
  const [users, setUsers] = useState<AdminUser[]>(adminUsers);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', role: 'GESTIONNAIRE' as AdminRole });
  const [tab, setTab] = useState('users');
  const { toggleColumn, isVisible } = useColumnVisibility(
    columnDefs.map((c) => c.key),
    ['status', 'date', 'actions']
  );

  const handleCreate = () => {
    const newUser: AdminUser = {
      id: `admin-${Date.now()}`,
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      role: form.role,
      isActive: true,
      createdAt: new Date(),
    };
    setUsers((prev) => [...prev, newUser]);
    setForm({ firstName: '', lastName: '', email: '', role: 'GESTIONNAIRE' });
    setIsDialogOpen(false);
  };

  const toggleActive = (id: string) => {
    setUsers((prev) => prev.map((u) => u.id === id ? { ...u, isActive: !u.isActive } : u));
  };

  return (
    <DashboardLayout>
      <div className="space-y-5 max-w-5xl">
        <div>
          <h1 className="text-xl font-bold text-foreground">Administrateurs</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">Gestion des utilisateurs et historique des actions</p>
        </div>

        <Tabs value={tab} onValueChange={setTab}>
          <TabsList>
            <TabsTrigger value="users" className="gap-2">
              <UserCog className="h-3.5 w-3.5" />
              Utilisateurs
            </TabsTrigger>
            <TabsTrigger value="history" className="gap-2">
              <Clock className="h-3.5 w-3.5" />
              Historique des actions
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="mt-4 space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">{users.length} utilisateurs</p>
              <div className="flex items-center gap-2">
                <ColumnVisibility columns={columnDefs} visibleColumns={Object.fromEntries(columnDefs.map((c) => [c.key, isVisible(c.key)]))} onToggle={toggleColumn} />
                <Button onClick={() => setIsDialogOpen(true)} size="sm" className="gap-2">
                  <Plus className="h-3.5 w-3.5" />
                  Ajouter un utilisateur
                </Button>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b border-border bg-muted/40">
                    <tr>
                      {isVisible('name') && <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap">Nom</th>}
                      {isVisible('email') && <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap">Email</th>}
                      {isVisible('role') && <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap">Rôle</th>}
                      {isVisible('status') && <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap">Statut</th>}
                      {isVisible('date') && <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap">Date création</th>}
                      {isVisible('actions') && <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap">Actions</th>}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {users.map((user) => {
                      const roleCfg = roleLabels[user.role];
                      return (
                        <tr key={user.id} className="hover:bg-muted/30 transition-colors">
                          {isVisible('name') && (
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2.5">
                                <div className={cn('flex h-8 w-8 items-center justify-center rounded-full', user.isActive ? 'bg-primary/10' : 'bg-muted')}>
                                  <ShieldCheck className={cn('h-4 w-4', user.isActive ? 'text-primary' : 'text-muted-foreground')} />
                                </div>
                                <div>
                                  <p className="text-xs font-medium">{user.firstName} {user.lastName}</p>
                                  <p className="text-[10px] text-muted-foreground">{user.id}</p>
                                </div>
                              </div>
                            </td>
                          )}
                          {isVisible('email') && <td className="px-4 py-3 text-xs text-muted-foreground">{user.email}</td>}
                          {isVisible('role') && (
                            <td className="px-4 py-3">
                              <span className={cn('rounded-full border px-2.5 py-0.5 text-xs font-medium', roleCfg.className)}>
                                {roleCfg.label}
                              </span>
                            </td>
                          )}
                          {isVisible('status') && (
                            <td className="px-4 py-3">
                              <span className={cn('rounded-full border px-2.5 py-0.5 text-xs font-medium',
                                user.isActive
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-800'
                                  : 'bg-muted text-muted-foreground border-border'
                              )}>
                                {user.isActive ? 'Actif' : 'Inactif'}
                              </span>
                            </td>
                          )}
                          {isVisible('date') && (
                            <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                              {format(user.createdAt, 'dd/MM/yyyy', { locale: fr })}
                            </td>
                          )}
                          {isVisible('actions') && (
                            <td className="px-4 py-3">
                              <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => toggleActive(user.id)}>
                                {user.isActive ? 'Désactiver' : 'Activer'}
                              </Button>
                            </td>
                          )}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="history" className="mt-4 space-y-4">
            <p className="text-sm text-muted-foreground">{actionHistory.length} actions enregistrées</p>
            <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b border-border bg-muted/40">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap">Date</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap">Utilisateur</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap">Action</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap">Cible</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {actionHistory.map((ah) => (
                      <tr key={ah.id} className="hover:bg-muted/30 transition-colors">
                        <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                          {format(ah.createdAt, 'dd/MM/yy HH:mm', { locale: fr })}
                        </td>
                        <td className="px-4 py-3 text-xs font-medium whitespace-nowrap">{ah.userName}</td>
                        <td className="px-4 py-3 text-xs">{ah.action}</td>
                        <td className="px-4 py-3 text-xs text-muted-foreground">{ah.target}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Create User Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Créer un utilisateur</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Prénom</Label>
                <Input
                  placeholder="Prénom"
                  value={form.firstName}
                  onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                  className="h-9 text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Nom</Label>
                <Input
                  placeholder="Nom"
                  value={form.lastName}
                  onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                  className="h-9 text-sm"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Email</Label>
              <Input
                type="email"
                placeholder="email@vayrix.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="h-9 text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Rôle</Label>
              <Select value={form.role} onValueChange={(v) => setForm({ ...form, role: v as AdminRole })}>
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                  <SelectItem value="GESTIONNAIRE">Gestionnaire</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Annuler</Button>
            <Button onClick={handleCreate} disabled={!form.firstName || !form.lastName || !form.email}>Créer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
