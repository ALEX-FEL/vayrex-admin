'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { vehicleTypes } from '@/lib/mock-data';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calculator } from 'lucide-react';

const formatCurrency = (amount: number) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF', maximumFractionDigits: 0 }).format(amount);

export default function PricingPage() {
  const [config, setConfig] = useState({ defaultMinimumPrice: 1000, baseCharge: 300, platformCommission: 15 });
  const [simDistance, setSimDistance] = useState(5);
  const [simVehicleId, setSimVehicleId] = useState(vehicleTypes.find((v) => v.isActive)?.id ?? vehicleTypes[0]?.id);
  const [saved, setSaved] = useState(false);

  const selectedVehicle = vehicleTypes.find((v) => v.id === simVehicleId);
  const estimatedPrice = selectedVehicle ? Math.max(config.defaultMinimumPrice, config.baseCharge + simDistance * selectedVehicle.pricePerKm) : 0;
  const commission = Math.round(estimatedPrice * (config.platformCommission / 100));
  const driverAmount = estimatedPrice - commission;

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  return (
    <DashboardLayout>
      <div className="space-y-5 max-w-3xl">
        <div><h1 className="text-xl font-bold text-foreground">Tarification</h1><p className="mt-0.5 text-sm text-muted-foreground">Configurez les paramètres de calcul des prix de courses</p></div>
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <h2 className="mb-4 text-sm font-semibold">Paramètres globaux</h2>
            <div className="space-y-4">
              <div className="space-y-1.5"><Label className="text-xs">Prix minimum par défaut (XOF)</Label><Input type="number" value={config.defaultMinimumPrice} onChange={(e) => setConfig({ ...config, defaultMinimumPrice: Number(e.target.value) })} className="h-9 text-sm" /></div>
              <div className="space-y-1.5"><Label className="text-xs">Frais de prise en charge (XOF)</Label><Input type="number" value={config.baseCharge} onChange={(e) => setConfig({ ...config, baseCharge: Number(e.target.value) })} className="h-9 text-sm" /></div>
              <div className="space-y-1.5"><Label className="text-xs">Commission plateforme (%)</Label><Input type="number" min={0} max={100} value={config.platformCommission} onChange={(e) => setConfig({ ...config, platformCommission: Number(e.target.value) })} className="h-9 text-sm" /></div>
              <Button onClick={handleSave} className="w-full">{saved ? 'Sauvegardé !' : 'Sauvegarder les paramètres'}</Button>
            </div>
          </div>
          <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-4"><Calculator className="h-4 w-4 text-primary" /><h2 className="text-sm font-semibold">Simulateur de prix</h2></div>
            <div className="space-y-4">
              <div className="space-y-1.5"><Label className="text-xs">Distance (km)</Label><Input type="number" min={1} max={100} value={simDistance} onChange={(e) => setSimDistance(Number(e.target.value))} className="h-9 text-sm" /></div>
              <div className="space-y-1.5"><Label className="text-xs">Type de véhicule</Label>
                <Select value={simVehicleId} onValueChange={setSimVehicleId}>
                  <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                  <SelectContent>{vehicleTypes.filter((v) => v.isActive).map((v) => (<SelectItem key={v.id} value={v.id}>{v.name}</SelectItem>))}</SelectContent>
                </Select>
              </div>
              <div className="rounded-lg bg-muted/50 p-4 space-y-2">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Détail du calcul</h3>
                <div className="flex justify-between text-xs"><span className="text-muted-foreground">Frais de base</span><span>{formatCurrency(config.baseCharge)}</span></div>
                <div className="flex justify-between text-xs"><span className="text-muted-foreground">{simDistance} km x {formatCurrency(selectedVehicle?.pricePerKm ?? 0)}/km</span><span>{formatCurrency(simDistance * (selectedVehicle?.pricePerKm ?? 0))}</span></div>
                <div className="border-t border-border pt-2 flex justify-between text-xs font-semibold"><span>Prix estimé</span><span>{formatCurrency(estimatedPrice)}</span></div>
              </div>
              <div className="rounded-lg border-2 border-primary/20 bg-primary/5 p-4">
                <div className="grid grid-cols-2 gap-2">
                  <div className="rounded-md bg-background p-2"><p className="text-[10px] text-muted-foreground">Chauffeur</p><p className="text-sm font-semibold text-emerald-600">{formatCurrency(driverAmount)}</p></div>
                  <div className="rounded-md bg-background p-2"><p className="text-[10px] text-muted-foreground">Commission ({config.platformCommission}%)</p><p className="text-sm font-semibold text-primary">{formatCurrency(commission)}</p></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <h2 className="mb-4 text-sm font-semibold">Tarifs par type de véhicule</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border">{['Type', 'Prix minimum', 'Prix/km', 'Prix/min', 'Prise en charge', 'Statut'].map((h) => (<th key={h} className="pb-2 pr-6 text-left text-xs font-semibold text-muted-foreground">{h}</th>))}</tr></thead>
              <tbody className="divide-y divide-border">
                {vehicleTypes.map((vt) => (
                  <tr key={vt.id} className="hover:bg-muted/30">
                    <td className="py-3 pr-6 font-semibold text-xs">{vt.name}</td>
                    <td className="py-3 pr-6 text-xs">{formatCurrency(vt.minimumPrice)}</td>
                    <td className="py-3 pr-6 text-xs">{formatCurrency(vt.pricePerKm)}</td>
                    <td className="py-3 pr-6 text-xs">{formatCurrency(vt.pricePerMinute)}</td>
                    <td className="py-3 pr-6 text-xs">{formatCurrency(vt.baseCharge)}</td>
                    <td className="py-3"><span className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${vt.isActive ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-muted text-muted-foreground border-border'}`}>{vt.isActive ? 'Actif' : 'Inactif'}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
