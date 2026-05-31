'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Plus, Pencil, Bike, Car, Crown } from 'lucide-react';
import type { Tables } from '@/lib/supabase';
import { cn } from '@/lib/utils';

const iconMap: Record<string, React.ReactNode> = {
  bike: <Bike className="h-5 w-5" />,
  car: <Car className="h-5 w-5" />,
  crown: <Crown className="h-5 w-5" />,
};

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF', maximumFractionDigits: 0 }).format(amount);

interface VehicleTypesTableProps {
  initialTypes: Tables<'vehicle_types'>[];
}

export function VehicleTypesTable({ initialTypes }: VehicleTypesTableProps) {
  const [types, setTypes] = useState(initialTypes);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingType, setEditingType] = useState<Tables<'vehicle_types'> | null>(null);
  const [form, setForm] = useState({
    name: '',
    description: '',
    icon: 'car',
    passenger_capacity: 4,
    minimum_price: 1000,
    price_per_km: 250,
    price_per_minute: 30,
    base_charge: 300,
    is_active: true,
  });

  const openAdd = () => {
    setEditingType(null);
    setForm({ name: '', description: '', icon: 'car', passenger_capacity: 4, minimum_price: 1000, price_per_km: 250, price_per_minute: 30, base_charge: 300, is_active: true });
    setIsDialogOpen(true);
  };

  const openEdit = (vt: Tables<'vehicle_types'>) => {
    setEditingType(vt);
    setForm({
      name: vt.name,
      description: vt.description,
      icon: vt.icon,
      passenger_capacity: vt.passenger_capacity,
      minimum_price: vt.minimum_price,
      price_per_km: vt.price_per_km,
      price_per_minute: vt.price_per_minute,
      base_charge: vt.base_charge,
      is_active: vt.is_active,
    });
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (editingType) {
      setTypes((prev) => prev.map((t) => t.id === editingType.id ? { ...t, ...form } : t));
    } else {
      const newType = { ...form, id: `new-${Date.now()}`, created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
      setTypes((prev) => [...prev, newType as Tables<'vehicle_types'>]);
    }
    setIsDialogOpen(false);
  };

  const toggleActive = (id: string) => {
    setTypes((prev) => prev.map((t) => t.id === id ? { ...t, is_active: !t.is_active } : t));
  };

  return (
    <>
      <Button onClick={openAdd} className="gap-2 mb-4"><Plus className="h-4 w-4" />Ajouter un type</Button>

      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-muted/40">
              <tr>
                {['Icône', 'Nom', 'Description', 'Passagers', 'Prix min.', 'Prix/km', 'Prix/min', 'Prise en charge', 'Statut', 'Actions'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {types.map((vt) => (
                <tr key={vt.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3">
                    <div className={cn('flex h-9 w-9 items-center justify-center rounded-lg', vt.is_active ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground')}>
                      {iconMap[vt.icon] ?? <Car className="h-5 w-5" />}
                    </div>
                  </td>
                  <td className="px-4 py-3 font-semibold text-xs">{vt.name}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground max-w-[200px] truncate">{vt.description}</td>
                  <td className="px-4 py-3 text-xs text-center">{vt.passenger_capacity}</td>
                  <td className="px-4 py-3 text-xs font-medium whitespace-nowrap">{formatCurrency(vt.minimum_price)}</td>
                  <td className="px-4 py-3 text-xs whitespace-nowrap">{formatCurrency(vt.price_per_km)}</td>
                  <td className="px-4 py-3 text-xs whitespace-nowrap">{formatCurrency(vt.price_per_minute)}</td>
                  <td className="px-4 py-3 text-xs whitespace-nowrap">{formatCurrency(vt.base_charge)}</td>
                  <td className="px-4 py-3">
                    <Switch checked={vt.is_active} onCheckedChange={() => toggleActive(vt.id)} />
                  </td>
                  <td className="px-4 py-3">
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(vt)}>
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingType ? 'Modifier le type' : 'Ajouter un type de véhicule'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Nom</Label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="h-9 text-sm" placeholder="ex: Standard" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Icône</Label>
                <select value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm">
                  <option value="bike">Moto</option>
                  <option value="car">Voiture</option>
                  <option value="crown">Premium</option>
                </select>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Description</Label>
              <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="text-sm resize-none" rows={2} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Passagers</Label>
                <Input type="number" value={form.passenger_capacity} onChange={(e) => setForm({ ...form, passenger_capacity: Number(e.target.value) })} className="h-9 text-sm" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Prix minimum (XOF)</Label>
                <Input type="number" value={form.minimum_price} onChange={(e) => setForm({ ...form, minimum_price: Number(e.target.value) })} className="h-9 text-sm" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Prix par km (XOF)</Label>
                <Input type="number" value={form.price_per_km} onChange={(e) => setForm({ ...form, price_per_km: Number(e.target.value) })} className="h-9 text-sm" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Prix par minute (XOF)</Label>
                <Input type="number" value={form.price_per_minute} onChange={(e) => setForm({ ...form, price_per_minute: Number(e.target.value) })} className="h-9 text-sm" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Frais de prise en charge (XOF)</Label>
                <Input type="number" value={form.base_charge} onChange={(e) => setForm({ ...form, base_charge: Number(e.target.value) })} className="h-9 text-sm" />
              </div>
              <div className="flex items-center gap-3 pt-5">
                <Switch checked={form.is_active} onCheckedChange={(v) => setForm({ ...form, is_active: v })} />
                <Label className="text-xs">{form.is_active ? 'Actif' : 'Inactif'}</Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Annuler</Button>
            <Button onClick={handleSave}>{editingType ? 'Sauvegarder' : 'Ajouter'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
