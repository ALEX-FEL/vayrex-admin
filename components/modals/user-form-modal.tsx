'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import type { User, UserRole, UserStatus } from '@/types';
import { userRoleLabels } from '@/lib/mock-data';
import { cn } from '@/lib/utils';

interface UserFormModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (user: UserFormData) => void;
  editingUser: User | null;
}

export interface UserFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: UserRole;
  status: UserStatus;
}

const emptyForm: UserFormData = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  role: 'SUPPORT',
  status: 'ACTIF',
};

export function UserFormModal({ open, onClose, onSave, editingUser }: UserFormModalProps) {
  const [form, setForm] = useState<UserFormData>(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (editingUser) {
      setForm({
        firstName: editingUser.firstName,
        lastName: editingUser.lastName,
        email: editingUser.email,
        phone: editingUser.phone,
        role: editingUser.role,
        status: editingUser.status,
      });
    } else {
      setForm(emptyForm);
    }
    setErrors({});
  }, [editingUser, open]);

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!form.firstName.trim()) e.firstName = 'Le prénom est obligatoire';
    if (!form.lastName.trim()) e.lastName = 'Le nom est obligatoire';
    if (!form.email.trim()) e.email = 'L\'email est obligatoire';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Email invalide';
    if (!form.phone.trim()) e.phone = 'Le téléphone est obligatoire';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      onSave(form);
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-md w-full">
        <DialogHeader className="pb-3 border-b border-border">
          <DialogTitle className="text-sm font-bold">
            {editingUser ? 'Modifier l\'utilisateur' : 'Créer un utilisateur'}
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-1">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Prénom <span className="text-destructive">*</span></Label>
              <Input
                value={form.firstName}
                onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                className={cn('h-9 text-sm', errors.firstName && 'border-destructive')}
                placeholder="Jean"
              />
              {errors.firstName && <p className="text-xs text-destructive">{errors.firstName}</p>}
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Nom <span className="text-destructive">*</span></Label>
              <Input
                value={form.lastName}
                onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                className={cn('h-9 text-sm', errors.lastName && 'border-destructive')}
                placeholder="Kouassi"
              />
              {errors.lastName && <p className="text-xs text-destructive">{errors.lastName}</p>}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">Email <span className="text-destructive">*</span></Label>
            <Input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className={cn('h-9 text-sm', errors.email && 'border-destructive')}
              placeholder="jean.kouassi@vayrix.com"
            />
            {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">Téléphone <span className="text-destructive">*</span></Label>
            <Input
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className={cn('h-9 text-sm', errors.phone && 'border-destructive')}
              placeholder="+225 0700000000"
            />
            {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Rôle</Label>
              <Select value={form.role} onValueChange={(v) => setForm({ ...form, role: v as UserRole })}>
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(userRoleLabels) as UserRole[]).map((r) => (
                    <SelectItem key={r} value={r}>{userRoleLabels[r]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Statut</Label>
              <div className="flex items-center gap-3 h-9 rounded-md border border-input bg-background px-3">
                <Switch
                  checked={form.status === 'ACTIF'}
                  onCheckedChange={(v) => setForm({ ...form, status: v ? 'ACTIF' : 'INACTIF' })}
                />
                <span className="text-sm">{form.status === 'ACTIF' ? 'Actif' : 'Inactif'}</span>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} className="text-sm">Annuler</Button>
          <Button onClick={handleSubmit} className="text-sm">
            {editingUser ? 'Sauvegarder' : 'Créer'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
