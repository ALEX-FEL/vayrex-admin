'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Bell, Shield, Globe, Save } from 'lucide-react';
import type { Tables } from '@/lib/supabase';

interface SettingsClientProps {
  initialSettings: Tables<'app_settings'> | null;
}

export function SettingsClient({ initialSettings }: SettingsClientProps) {
  const [settings, setSettings] = useState({
    platform_name: initialSettings?.platform_name ?? 'VAYRIX',
    currency: initialSettings?.currency ?? 'XOF',
    sms_enabled: initialSettings?.sms_enabled ?? true,
    email_enabled: initialSettings?.email_enabled ?? false,
    session_duration: initialSettings?.session_duration ?? 60,
    two_factor_auth: initialSettings?.two_factor_auth ?? false,
  });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <DashboardLayout>
      <div className="space-y-5 max-w-2xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-foreground">Paramètres</h1>
            <p className="mt-0.5 text-sm text-muted-foreground">Configurez votre plateforme VAYRIX</p>
          </div>
          <Button onClick={handleSave} className="gap-2">
            <Save className="h-3.5 w-3.5" />
            {saved ? 'Sauvegardé !' : 'Sauvegarder'}
          </Button>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
              <Globe className="h-4 w-4 text-primary" />
            </div>
            <h2 className="text-sm font-semibold">Général</h2>
          </div>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs">Nom de la plateforme</Label>
              <Input value={settings.platform_name} onChange={(e) => setSettings({ ...settings, platform_name: e.target.value })} className="h-9 text-sm max-w-xs" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Devise</Label>
              <select value={settings.currency} onChange={(e) => setSettings({ ...settings, currency: e.target.value })} className="h-9 rounded-md border border-input bg-background px-3 text-sm max-w-xs w-full">
                <option value="XOF">XOF - Franc CFA</option>
                <option value="EUR">EUR - Euro</option>
                <option value="USD">USD - Dollar US</option>
                <option value="GHS">GHS - Cedi ghanéen</option>
              </select>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
              <Bell className="h-4 w-4 text-primary" />
            </div>
            <h2 className="text-sm font-semibold">Notifications</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-1">
              <div>
                <p className="text-sm font-medium">Notifications SMS</p>
                <p className="text-xs text-muted-foreground">Envoyer des SMS aux clients et chauffeurs</p>
              </div>
              <Switch checked={settings.sms_enabled} onCheckedChange={(v) => setSettings({ ...settings, sms_enabled: v })} />
            </div>
            <Separator />
            <div className="flex items-center justify-between py-1">
              <div>
                <p className="text-sm font-medium">Notifications email</p>
                <p className="text-xs text-muted-foreground">Envoyer des emails de confirmation</p>
              </div>
              <Switch checked={settings.email_enabled} onCheckedChange={(v) => setSettings({ ...settings, email_enabled: v })} />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
              <Shield className="h-4 w-4 text-primary" />
            </div>
            <h2 className="text-sm font-semibold">Sécurité</h2>
          </div>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs">Durée de session (minutes)</Label>
              <Input type="number" min={15} max={480} value={settings.session_duration} onChange={(e) => setSettings({ ...settings, session_duration: Number(e.target.value) })} className="h-9 text-sm max-w-xs" />
              <p className="text-[11px] text-muted-foreground">Les sessions admin expireront après {settings.session_duration} minutes d'inactivité</p>
            </div>
            <Separator />
            <div className="flex items-center justify-between py-1">
              <div>
                <p className="text-sm font-medium">Double authentification (2FA)</p>
                <p className="text-xs text-muted-foreground">Ajouter une couche de sécurité supplémentaire</p>
              </div>
              <Switch checked={settings.two_factor_auth} onCheckedChange={(v) => setSettings({ ...settings, two_factor_auth: v })} />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <h2 className="mb-3 text-sm font-semibold">Informations système</h2>
          <div className="space-y-2 text-xs">
            {[
              { label: 'Version', value: 'v1.0.0' },
              { label: 'Environnement', value: 'Production' },
              { label: 'Dernière mise à jour', value: '31 mai 2025' },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between py-1.5 border-b border-border last:border-0">
                <span className="text-muted-foreground">{label}</span>
                <span className="font-medium">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
