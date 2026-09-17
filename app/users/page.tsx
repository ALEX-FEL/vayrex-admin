'use client';

import { useState, useMemo } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { StatusBadge } from '@/components/ui/status-badge';
import { users as allUsers, userRoleLabels, getUserStats } from '@/lib/mock-data';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  Search, Plus, Pencil, Trash2, ChevronLeft, ChevronRight,
  Filter, Shield, ShieldCheck, ShieldAlert, ShieldX, UserCog, CheckCircle2, XCircle,
} from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { ColumnVisibilityToggle } from '@/components/ui/column-visibility-toggle';
import { UserFormModal, type UserFormData } from '@/components/modals/user-form-modal';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import type { User, UserRole, UserStatus } from '@/types';

const PAGE_SIZE = 12;

const ALL_COLUMNS = ['Utilisateur', 'Email', 'Téléphone', 'Rôle', 'Dernière connexion', 'Date création', 'Statut'];
const DEFAULT_HIDDEN = new Set<string>(['Téléphone']);

const roleIconMap: Record<UserRole, React.ElementType> = {
  ADMIN: ShieldCheck,
  MANAGER: Shield,
  DISPATCHER: ShieldAlert,
  SUPPORT: ShieldX,
};

const roleColorMap: Record<UserRole, string> = {
  ADMIN: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/30 dark:text-red-400 dark:border-red-800',
  MANAGER: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-800',
  DISPATCHER: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-800',
  SUPPORT: 'bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950/30 dark:text-teal-400 dark:border-teal-800',
};

export default function UsersPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIF' | 'INACTIF'>('ALL');
  const [selectedRoles, setSelectedRoles] = useState<Set<UserRole>>(new Set());
  const [page, setPage] = useState(1);
  const [users, setUsers] = useState<User[]>(allUsers);
  const [hiddenColumns, setHiddenColumns] = useState<Set<string>>(DEFAULT_HIDDEN);
  const [formOpen, setFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deleteUser, setDeleteUser] = useState<User | null>(null);

  const stats = getUserStats();

  const filtered = useMemo(() => {
    return users.filter((u) => {
      const name = `${u.firstName} ${u.lastName}`.toLowerCase();
      const matchSearch = search === '' || name.includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()) || u.phone.includes(search);
      const matchStatus = statusFilter === 'ALL' || u.status === statusFilter;
      const matchRole = selectedRoles.size === 0 || selectedRoles.has(u.role);
      return matchSearch && matchStatus && matchRole;
    });
  }, [search, statusFilter, selectedRoles, users]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const toggleColumn = (col: string) => {
    setHiddenColumns((prev) => {
      const next = new Set(prev);
      if (next.has(col)) next.delete(col);
      else next.add(col);
      return next;
    });
  };

  const toggleRole = (role: UserRole) => {
    setSelectedRoles((prev) => {
      const next = new Set(prev);
      if (next.has(role)) next.delete(role);
      else next.add(role);
      return next;
    });
    setPage(1);
  };

  const handleToggleStatus = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId
          ? { ...u, status: (u.status === 'ACTIF' ? 'INACTIF' : 'ACTIF') as UserStatus }
          : u
      )
    );
  };

  const handleSave = (data: UserFormData) => {
    if (editingUser) {
      setUsers((prev) =>
        prev.map((u) => (u.id === editingUser.id ? { ...u, ...data } : u))
      );
    } else {
      const newUser: User = {
        ...data,
        id: `user-${Date.now()}`,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.firstName}${Date.now()}`,
        createdAt: new Date(),
        lastLogin: null,
      };
      setUsers((prev) => [newUser, ...prev]);
    }
  };

  const handleDelete = () => {
    if (deleteUser) {
      setUsers((prev) => prev.filter((u) => u.id !== deleteUser.id));
      setDeleteUser(null);
    }
  };

  const openCreate = () => {
    setEditingUser(null);
    setFormOpen(true);
  };

  const openEdit = (user: User) => {
    setEditingUser(user);
    setFormOpen(true);
  };

  return (
    <DashboardLayout>
      <div className="space-y-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-bold text-foreground">Utilisateurs</h1>
            <p className="mt-0.5 text-sm text-muted-foreground">{filtered.length} utilisateurs trouvés</p>
          </div>
          <Button onClick={openCreate} className="gap-2 w-full sm:w-auto">
            <Plus className="h-4 w-4" />
            Ajouter un utilisateur
          </Button>
        </div>

        {/* KPI cards */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          <div className="rounded-xl border border-border bg-card p-3 sm:p-4 shadow-sm flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
              <UserCog className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-lg font-bold leading-none">{stats.total}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">Total</p>
            </div>
          </div>
          <div className="rounded-xl border border-border bg-card p-3 sm:p-4 shadow-sm flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-950/30">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            </div>
            <div>
              <p className="text-lg font-bold leading-none">{stats.actifs}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">Actifs</p>
            </div>
          </div>
          <div className="rounded-xl border border-border bg-card p-3 sm:p-4 shadow-sm flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800/40">
              <XCircle className="h-4 w-4 text-gray-500" />
            </div>
            <div>
              <p className="text-lg font-bold leading-none">{stats.inactifs}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">Inactifs</p>
            </div>
          </div>
          <div className="rounded-xl border border-border bg-card p-3 sm:p-4 shadow-sm flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-950/30">
              <Shield className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <p className="text-lg font-bold leading-none">{stats.parRole.filter((r) => r.role === 'ADMIN').map((r) => r.count)[0]}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">Admins</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1 sm:max-w-sm">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Rechercher un utilisateur..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="pl-9 h-9 text-sm"
            />
          </div>

          {/* Role multi-select */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1.5 h-9 text-sm whitespace-nowrap">
                <Filter className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Rôles</span>
                {selectedRoles.size > 0 && (
                  <span className="rounded-full bg-primary/15 px-1.5 py-0.5 text-[10px] font-semibold text-primary">
                    {selectedRoles.size}
                  </span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-52 p-3">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                Filtrer par rôle
              </p>
              <div className="space-y-2">
                {(Object.keys(userRoleLabels) as UserRole[]).map((role) => (
                  <div key={role} className="flex items-center gap-2.5">
                    <Checkbox
                      id={`role-${role}`}
                      checked={selectedRoles.has(role)}
                      onCheckedChange={() => toggleRole(role)}
                      className="h-3.5 w-3.5"
                    />
                    <Label htmlFor={`role-${role}`} className="text-xs cursor-pointer select-none flex items-center gap-1.5">
                      {userRoleLabels[role]}
                    </Label>
                  </div>
                ))}
                {selectedRoles.size > 0 && (
                  <button
                    onClick={() => setSelectedRoles(new Set())}
                    className="text-xs text-primary hover:underline mt-2"
                  >
                    Réinitialiser
                  </button>
                )}
              </div>
            </PopoverContent>
          </Popover>

          {/* Status filter */}
          <div className="flex rounded-lg border border-border bg-muted/40 p-0.5">
            {(['ALL', 'ACTIF', 'INACTIF'] as const).map((s) => (
              <button
                key={s}
                onClick={() => { setStatusFilter(s); setPage(1); }}
                className={cn(
                  'rounded-md px-3 py-1.5 text-xs font-medium transition-all whitespace-nowrap',
                  statusFilter === s ? 'bg-card shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {s === 'ALL' ? 'Tous' : s === 'ACTIF' ? 'Actifs' : 'Inactifs'}
              </button>
            ))}
          </div>

          <ColumnVisibilityToggle
            columns={ALL_COLUMNS}
            hidden={hiddenColumns}
            onToggle={toggleColumn}
            locked={['Utilisateur', 'Statut']}
          />
        </div>

        {/* Table */}
        <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <table className="w-full min-w-[700px] text-sm">
              <thead className="border-b border-border bg-muted/40">
                <tr>
                  {ALL_COLUMNS.filter((c) => !hiddenColumns.has(c)).map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {paginated.map((user) => {
                  const RoleIcon = roleIconMap[user.role];
                  return (
                    <tr key={user.id} className="hover:bg-muted/30 transition-colors">
                      {!hiddenColumns.has('Utilisateur') && (
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2.5">
                            <img src={user.avatar} alt={user.firstName} className="h-8 w-8 rounded-full bg-muted" />
                            <div>
                              <p className="text-xs font-medium">{user.firstName} {user.lastName}</p>
                              <p className="text-[10px] text-muted-foreground">ID: {user.id}</p>
                            </div>
                          </div>
                        </td>
                      )}
                      {!hiddenColumns.has('Email') && (
                        <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">{user.email}</td>
                      )}
                      {!hiddenColumns.has('Téléphone') && (
                        <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">{user.phone}</td>
                      )}
                      {!hiddenColumns.has('Rôle') && (
                        <td className="px-4 py-3">
                          <span className={cn('inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium', roleColorMap[user.role])}>
                            <RoleIcon className="h-3 w-3" />
                            {userRoleLabels[user.role]}
                          </span>
                        </td>
                      )}
                      {!hiddenColumns.has('Dernière connexion') && (
                        <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                          {user.lastLogin ? format(user.lastLogin, 'dd/MM/yy HH:mm', { locale: fr }) : 'Jamais'}
                        </td>
                      )}
                      {!hiddenColumns.has('Date création') && (
                        <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                          {format(user.createdAt, 'dd/MM/yyyy', { locale: fr })}
                        </td>
                      )}
                      {!hiddenColumns.has('Statut') && (
                        <td className="px-4 py-3">
                          <button
                            onClick={() => handleToggleStatus(user.id)}
                            className="transition-transform hover:scale-105 cursor-pointer"
                            title={user.status === 'ACTIF' ? 'Cliquer pour désactiver' : 'Cliquer pour activer'}
                          >
                            <StatusBadge status={user.status} />
                          </button>
                        </td>
                      )}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950/30"
                            onClick={() => openEdit(user)}
                            title="Modifier"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => setDeleteUser(user)}
                            title="Supprimer"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
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

      {/* User Form Modal */}
      <UserFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSave={handleSave}
        editingUser={editingUser}
      />

      {/* Delete Confirmation */}
      <Dialog open={!!deleteUser} onOpenChange={(v) => !v && setDeleteUser(null)}>
        <DialogContent className="max-w-md w-full">
          <DialogHeader className="pb-3 border-b border-border">
            <DialogTitle className="text-sm font-bold">Supprimer l'utilisateur</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground py-2">
            Êtes-vous sûr de vouloir supprimer le compte de{' '}
            <span className="font-semibold text-foreground">
              {deleteUser?.firstName} {deleteUser?.lastName}
            </span>{' '}
            ? Cette action est irréversible.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteUser(null)} className="text-sm">Annuler</Button>
            <Button variant="destructive" onClick={handleDelete} className="text-sm">Supprimer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
