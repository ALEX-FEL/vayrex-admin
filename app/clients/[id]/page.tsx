'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { StatusBadge } from '@/components/ui/status-badge';
import { clients, rides } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, CirclePause as PauseCircle, KeyRound, Check } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function ClientProfilePage() {
  const params = useParams();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const client = clients.find((c) => c.id === id);
  const [clientData, setClientData] = useState(client);
  const [motif, setMotif] = useState('');
  const [showMotifDialog, setShowMotifDialog] = useState(false);
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [resetDone, setResetDone] = useState(false);

  if (!clientData) return <div className="p-5 text-center text-muted-foreground">Client non trouvé</div>;

  const clientRides = rides.filter((r) => r.clientId === clientData.id).slice(0, 20);

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF', maximumFractionDigits: 0 }).format(amount);

  const handleSuspend = () => {
    if (!motif.trim()) return;
    setClientData((prev) => {
      if (!prev) return prev;
      return { ...prev, status: 'SUSPENDU' as const, motif };
    });
    setMotif('');
    setShowMotifDialog(false);
  };

  return (
    <DashboardLayout>
      <div className="space-y-5 max-w-4xl">
        <div className="flex items-center gap-3">
          <Link href="/clients">
            <Button variant="outline" size="icon" className="h-8 w-8">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold text-foreground">Profil client</h1>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {/* Profile */}
          <div className="space-y-4">
            <div className="rounded-xl border border-border bg-card p-5 text-center shadow-sm">
              <img src={clientData.avatar} alt={clientData.firstName} className="mx-auto h-20 w-20 rounded-full bg-muted object-cover" />
              <h2 className="mt-3 text-base font-bold">{clientData.firstName} {clientData.lastName}</h2>
              <p className="text-sm text-muted-foreground">{clientData.phone}</p>
              <p className="text-xs text-muted-foreground">{clientData.email}</p>
              <div className="mt-3">
                <StatusBadge status={clientData.status} />
              </div>
              {clientData.motif && (
                <div className="mt-2 rounded-md bg-destructive/10 border border-destructive/20 px-3 py-2 text-xs text-destructive">
                  Motif : {clientData.motif}
                </div>
              )}
              {clientData.status === 'ACTIF' && (
                <Button variant="outline" size="sm" className="mt-4 gap-1.5 text-amber-600 border-amber-300 w-full" onClick={() => setShowMotifDialog(true)}>
                  <PauseCircle className="h-3.5 w-3.5" />
                  Suspendre
                </Button>
              )}
              <Button variant="outline" size="sm" className="mt-2 gap-1.5 w-full" onClick={() => { setShowResetDialog(true); setResetDone(false); }}>
                <KeyRound className="h-3.5 w-3.5" />
                Réinitialiser mot de passe
              </Button>
            </div>

            <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
              <h3 className="mb-3 text-sm font-semibold">Résumé</h3>
              <div className="space-y-2.5">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total courses</span>
                  <span className="font-semibold">{clientData.totalRides}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Montant total</span>
                  <span className="font-semibold text-xs">{formatCurrency(clientData.totalSpent)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Inscrit le</span>
                  <span className="font-medium text-xs">{format(clientData.createdAt, 'dd/MM/yyyy', { locale: fr })}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Rides */}
          <div className="lg:col-span-2">
            <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
              <h3 className="mb-4 text-sm font-semibold">Historique des courses ({clientRides.length})</h3>
              {clientRides.length === 0 ? (
                <p className="text-sm text-muted-foreground">Aucune course pour ce client.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        {['Réf.', 'Chauffeur', 'Destination', 'Prix', 'Date', 'Statut'].map((h) => (
                          <th key={h} className="pb-2 pr-4 text-left text-xs font-medium text-muted-foreground whitespace-nowrap">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {clientRides.map((ride) => (
                        <tr key={ride.id} className="hover:bg-muted/30">
                          <td className="py-2.5 pr-4 font-mono text-xs text-primary">{ride.reference}</td>
                          <td className="py-2.5 pr-4 text-xs text-muted-foreground whitespace-nowrap">{ride.driverName ?? '—'}</td>
                          <td className="py-2.5 pr-4 text-xs text-muted-foreground max-w-[140px] truncate">{ride.destination}</td>
                          <td className="py-2.5 pr-4 text-xs font-semibold whitespace-nowrap">{formatCurrency(ride.price)}</td>
                          <td className="py-2.5 pr-4 text-xs text-muted-foreground whitespace-nowrap">
                            {format(ride.createdAt, 'dd/MM/yy', { locale: fr })}
                          </td>
                          <td className="py-2.5">
                            <StatusBadge status={ride.status} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Motif Dialog */}
      <Dialog open={showMotifDialog} onOpenChange={(open) => { if (!open) { setShowMotifDialog(false); setMotif(''); } }}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Suspendre le client</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div className="space-y-1.5">
              <Label className="text-xs">Motif de suspension</Label>
              <Input
                placeholder="Entrez le motif..."
                value={motif}
                onChange={(e) => setMotif(e.target.value)}
                className="h-9 text-sm"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setShowMotifDialog(false); setMotif(''); }}>Annuler</Button>
            <Button
              variant="destructive"
              onClick={handleSuspend}
              disabled={!motif.trim()}
            >
              Suspendre
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reset Password Dialog */}
      <Dialog open={showResetDialog} onOpenChange={setShowResetDialog}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Réinitialiser le mot de passe</DialogTitle>
          </DialogHeader>
          {resetDone ? (
            <div className="flex flex-col items-center gap-3 py-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950/30">
                <Check className="h-6 w-6 text-emerald-600" />
              </div>
              <p className="text-sm text-center">Un email de réinitialisation a été envoyé à <span className="font-medium">{clientData.email}</span></p>
            </div>
          ) : (
            <>
              <p className="text-sm text-muted-foreground py-2">
                Voulez-vous réinitialiser le mot de passe de <span className="font-medium text-foreground">{clientData.firstName} {clientData.lastName}</span> ? Un email de réinitialisation sera envoyé.
              </p>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowResetDialog(false)}>Annuler</Button>
                <Button onClick={() => setResetDone(true)} className="gap-1.5">
                  <KeyRound className="h-3.5 w-3.5" />
                  Réinitialiser
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
