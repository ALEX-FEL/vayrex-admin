'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { StatusBadge } from '@/components/ui/status-badge';
import { drivers, rides } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Star, FileText, CircleCheck as CheckCircle, Circle as XCircle, CirclePause as PauseCircle, Download, ChevronDown } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import type { DocumentVerificationStatus } from '@/types';
import { cn } from '@/lib/utils';

const docStatusConfig: Record<DocumentVerificationStatus, { label: string; className: string }> = {
  EN_ATTENTE: { label: 'En attente', className: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-800' },
  'VÉRIFIÉ': { label: 'Vérifié', className: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-800' },
  REFUSÉ: { label: 'Refusé', className: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/30 dark:text-red-400 dark:border-red-800' },
};

export default function DriverProfilePage() {
  const params = useParams();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const driver = drivers.find((d) => d.id === id);
  const [driverData, setDriverData] = useState(driver);
  const [motifDialog, setMotifDialog] = useState<'suspend' | 'refuse' | null>(null);
  const [motif, setMotif] = useState('');
  const [openDocMenu, setOpenDocMenu] = useState<string | null>(null);

  if (!driverData) return <div className="p-5 text-center text-muted-foreground">Chauffeur non trouvé</div>;

  const driverRides = rides.filter((r) => r.driverId === driverData.id).slice(0, 20);

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF', maximumFractionDigits: 0 }).format(amount);

  const updateDocStatus = (docId: string, newStatus: DocumentVerificationStatus) => {
    setDriverData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        documents: prev.documents.map((doc) =>
          doc.id === docId ? { ...doc, verificationStatus: newStatus } : doc
        ),
      };
    });
    setOpenDocMenu(null);
  };

  const handleMotifConfirm = () => {
    if (!motif.trim()) return;
    setDriverData((prev) => {
      if (!prev) return prev;
      if (motifDialog === 'suspend') return { ...prev, status: 'SUSPENDU' as const, motif };
      if (motifDialog === 'refuse') return { ...prev, status: 'REFUSÉ' as const, motif };
      return prev;
    });
    setMotif('');
    setMotifDialog(null);
  };

  return (
    <DashboardLayout>
      <div className="space-y-5 max-w-5xl">
        <div className="flex items-center gap-3">
          <Link href="/drivers">
            <Button variant="outline" size="icon" className="h-8 w-8">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold text-foreground">Profil chauffeur</h1>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {/* Profile Card */}
          <div className="space-y-4">
            <div className="rounded-xl border border-border bg-card p-5 text-center shadow-sm">
              <img
                src={driverData.avatar}
                alt={driverData.firstName}
                className="mx-auto h-20 w-20 rounded-full bg-muted object-cover"
              />
              <h2 className="mt-3 text-base font-bold">{driverData.firstName} {driverData.lastName}</h2>
              <p className="text-sm text-muted-foreground">{driverData.phone}</p>
              <div className="mt-2 flex items-center justify-center gap-1">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                <span className="text-sm font-semibold">{driverData.rating}</span>
              </div>
              <div className="mt-3">
                <StatusBadge status={driverData.status} />
              </div>
              {driverData.motif && (
                <div className="mt-2 rounded-md bg-destructive/10 border border-destructive/20 px-3 py-2 text-xs text-destructive">
                  Motif : {driverData.motif}
                </div>
              )}
              <div className="mt-4 flex justify-center gap-2">
                {driverData.status === 'EN_ATTENTE' && (
                  <>
                    <Button size="sm" className="gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white">
                      <CheckCircle className="h-3.5 w-3.5" />
                      Approuver
                    </Button>
                    <Button size="sm" variant="destructive" className="gap-1.5" onClick={() => setMotifDialog('refuse')}>
                      <XCircle className="h-3.5 w-3.5" />
                      Refuser
                    </Button>
                  </>
                )}
                {driverData.status === 'APPROUVÉ' && (
                  <Button size="sm" variant="outline" className="gap-1.5 text-amber-600 border-amber-300" onClick={() => setMotifDialog('suspend')}>
                    <PauseCircle className="h-3.5 w-3.5" />
                    Suspendre
                  </Button>
                )}
              </div>
            </div>

            {/* Stats */}
            <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
              <h3 className="mb-3 text-sm font-semibold">Statistiques</h3>
              <div className="space-y-2.5">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total courses</span>
                  <span className="font-semibold">{driverData.totalRides}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Note</span>
                  <span className="font-semibold">{driverData.rating}/5</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Statut</span>
                  <span className={`text-xs font-medium ${driverData.isOnline ? 'text-emerald-600' : 'text-muted-foreground'}`}>
                    {driverData.isOnline ? 'En ligne' : 'Hors ligne'}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Inscrit le</span>
                  <span className="font-medium text-xs">{format(driverData.createdAt, 'dd/MM/yyyy', { locale: fr })}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content */}
          <div className="space-y-4 lg:col-span-2">
            {/* Vehicle Info */}
            <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
              <h3 className="mb-4 text-sm font-semibold">Informations véhicule</h3>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Type', value: driverData.vehicleType },
                  { label: 'Marque', value: driverData.vehicleBrand },
                  { label: 'Couleur', value: driverData.vehicleColor },
                  { label: 'Immatriculation', value: driverData.vehiclePlate },
                ].map(({ label, value }) => (
                  <div key={label} className="rounded-lg bg-muted/50 p-3">
                    <p className="text-xs text-muted-foreground">{label}</p>
                    <p className="mt-0.5 text-sm font-medium">{value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Documents */}
            <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
              <h3 className="mb-4 text-sm font-semibold">Documents</h3>
              <div className="space-y-2.5">
                {driverData.documents.map((doc) => {
                  const cfg = docStatusConfig[doc.verificationStatus];
                  return (
                    <div key={doc.id} className="flex items-center justify-between rounded-lg border border-border px-3 py-2.5">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
                        <div className="min-w-0">
                          <p className="text-xs font-medium">{doc.label}</p>
                          <p className="text-[11px] text-muted-foreground font-mono truncate">{doc.value}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 gap-1 text-xs"
                          onClick={() => {
                            const a = document.createElement('a');
                            a.href = doc.fileUrl;
                            a.download = `${doc.label}_${doc.value}.pdf`;
                            a.click();
                          }}
                        >
                          <Download className="h-3 w-3" />
                          <span className="hidden sm:inline">Télécharger</span>
                        </Button>
                        <div className="relative">
                          <button
                            onClick={() => setOpenDocMenu(openDocMenu === doc.id ? null : doc.id)}
                            className={cn(
                              'inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium cursor-pointer',
                              cfg.className
                            )}
                          >
                            {cfg.label}
                            <ChevronDown className="h-3 w-3" />
                          </button>
                          {openDocMenu === doc.id && (
                            <div className="absolute right-0 top-8 z-10 w-36 rounded-md border border-border bg-card shadow-lg">
                              {doc.verificationStatus === 'EN_ATTENTE' && (
                                <>
                                  <button
                                    onClick={() => updateDocStatus(doc.id, 'VÉRIFIÉ')}
                                    className="flex w-full items-center gap-2 px-3 py-2 text-xs hover:bg-muted/50 text-emerald-700"
                                  >
                                    <CheckCircle className="h-3.5 w-3.5" />
                                    Vérifié
                                  </button>
                                  <button
                                    onClick={() => updateDocStatus(doc.id, 'REFUSÉ')}
                                    className="flex w-full items-center gap-2 px-3 py-2 text-xs hover:bg-muted/50 text-red-700"
                                  >
                                    <XCircle className="h-3.5 w-3.5" />
                                    Refusé
                                  </button>
                                </>
                              )}
                              {doc.verificationStatus === 'VÉRIFIÉ' && (
                                <button
                                  onClick={() => updateDocStatus(doc.id, 'REFUSÉ')}
                                  className="flex w-full items-center gap-2 px-3 py-2 text-xs hover:bg-muted/50 text-red-700"
                                >
                                  <XCircle className="h-3.5 w-3.5" />
                                  Refusé
                                </button>
                              )}
                              {doc.verificationStatus === 'REFUSÉ' && (
                                <button
                                  onClick={() => updateDocStatus(doc.id, 'VÉRIFIÉ')}
                                  className="flex w-full items-center gap-2 px-3 py-2 text-xs hover:bg-muted/50 text-emerald-700"
                                >
                                  <CheckCircle className="h-3.5 w-3.5" />
                                  Vérifié
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Ride History */}
            <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
              <h3 className="mb-4 text-sm font-semibold">Historique des courses ({driverRides.length})</h3>
              {driverRides.length === 0 ? (
                <p className="text-sm text-muted-foreground">Aucune course pour ce chauffeur.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        {['Réf.', 'Client', 'Destination', 'Prix', 'Date', 'Statut'].map((h) => (
                          <th key={h} className="pb-2 pr-4 text-left text-xs font-medium text-muted-foreground whitespace-nowrap">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {driverRides.map((ride) => (
                        <tr key={ride.id} className="hover:bg-muted/30">
                          <td className="py-2.5 pr-4 font-mono text-xs text-primary">{ride.reference}</td>
                          <td className="py-2.5 pr-4 text-xs font-medium whitespace-nowrap">{ride.clientName}</td>
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
      <Dialog open={motifDialog !== null} onOpenChange={(open) => { if (!open) { setMotifDialog(null); setMotif(''); } }}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>
              {motifDialog === 'suspend' ? 'Suspendre le chauffeur' : 'Refuser le chauffeur'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div className="space-y-1.5">
              <Label className="text-xs">Motif {motifDialog === 'suspend' ? 'de suspension' : 'de refus'}</Label>
              <Input
                placeholder="Entrez le motif..."
                value={motif}
                onChange={(e) => setMotif(e.target.value)}
                className="h-9 text-sm"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setMotifDialog(null); setMotif(''); }}>Annuler</Button>
            <Button
              variant={motifDialog === 'refuse' ? 'destructive' : 'default'}
              onClick={handleMotifConfirm}
              disabled={!motif.trim()}
            >
              {motifDialog === 'suspend' ? 'Suspendre' : 'Refuser'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
