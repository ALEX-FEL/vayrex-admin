'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { StatusBadge } from '@/components/ui/status-badge';
import { drivers, rides } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import {
  ArrowLeft, Star, FileText, CheckCircle, XCircle, PauseCircle, Download, ChevronDown,
} from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

type DocStatus = 'EN_ATTENTE' | 'VÉRIFIÉ' | 'REFUSÉ';

const DOC_STATUS_CONFIG: Record<DocStatus, { label: string; bg: string; text: string; border: string }> = {
  EN_ATTENTE: {
    label: 'En attente de vérification',
    bg: 'bg-amber-50 dark:bg-amber-950/30',
    text: 'text-amber-700 dark:text-amber-400',
    border: 'border-amber-200 dark:border-amber-800',
  },
  VÉRIFIÉ: {
    label: 'Vérifié',
    bg: 'bg-emerald-50 dark:bg-emerald-950/30',
    text: 'text-emerald-700 dark:text-emerald-400',
    border: 'border-emerald-200 dark:border-emerald-800',
  },
  REFUSÉ: {
    label: 'Refusé',
    bg: 'bg-red-50 dark:bg-red-950/30',
    text: 'text-destructive',
    border: 'border-red-200 dark:border-red-800',
  },
};

function simulateDownload(filename: string, content: string) {
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

interface DocumentRowProps {
  label: string;
  value: string;
  filename: string;
  status: DocStatus;
  onStatusChange: (s: DocStatus) => void;
}

function DocumentRow({ label, value, filename, status, onStatusChange }: DocumentRowProps) {
  const cfg = DOC_STATUS_CONFIG[status];

  const menuItems: { label: string; value: DocStatus; icon: React.ElementType; className?: string }[] =
    status === 'VÉRIFIÉ'
      ? [{ label: 'Refuser', value: 'REFUSÉ', icon: XCircle, className: 'text-destructive focus:text-destructive' }]
      : status === 'REFUSÉ'
      ? [
          { label: 'Vérifier', value: 'VÉRIFIÉ', icon: CheckCircle, className: 'text-emerald-600 focus:text-emerald-600' },
          { label: 'Remettre en attente', value: 'EN_ATTENTE', icon: FileText },
        ]
      : [
          { label: 'Vérifier', value: 'VÉRIFIÉ', icon: CheckCircle, className: 'text-emerald-600 focus:text-emerald-600' },
          { label: 'Refuser', value: 'REFUSÉ', icon: XCircle, className: 'text-destructive focus:text-destructive' },
        ];

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3 rounded-lg border border-border px-3 py-3">
      <div className="flex items-center gap-2.5 flex-1 min-w-0">
        <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
        <div className="min-w-0">
          <p className="text-xs font-medium">{label}</p>
          <p className="text-[11px] text-muted-foreground font-mono truncate">{value}</p>
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <Button
          variant="outline"
          size="sm"
          className="h-7 gap-1.5 text-xs"
          onClick={() =>
            simulateDownload(
              filename,
              `Document: ${label}\nRéférence: ${value}\nDate d'émission: ${new Date().toLocaleDateString('fr-FR')}`
            )
          }
        >
          <Download className="h-3 w-3" />
          Télécharger
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className={cn(
                'flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors hover:opacity-80 cursor-pointer',
                cfg.bg, cfg.text, cfg.border
              )}
            >
              {cfg.label}
              <ChevronDown className="h-2.5 w-2.5 opacity-70 shrink-0" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-[160px]">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <DropdownMenuItem
                  key={item.value}
                  onClick={() => onStatusChange(item.value)}
                  className={cn('gap-2 text-xs cursor-pointer', item.className)}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {item.label}
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

export default function DriverProfilePage() {
  const params = useParams();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const driver = drivers.find((d) => d.id === id);

  const [docStatuses, setDocStatuses] = useState<Record<string, DocStatus>>({
    cni: 'EN_ATTENTE',
    permis: 'EN_ATTENTE',
    carteGrise: 'EN_ATTENTE',
  });

  if (!driver) return <div className="p-5 text-center text-muted-foreground">Chauffeur non trouvé</div>;

  const driverRides = rides.filter((r) => r.driverId === driver.id).slice(0, 20);

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF', maximumFractionDigits: 0 }).format(amount);

  const updateDocStatus = (key: string) => (status: DocStatus) =>
    setDocStatuses((prev) => ({ ...prev, [key]: status }));

  const docs = [
    { key: 'cni', label: "Carte nationale d'identité", value: driver.idCardNumber, filename: `CNI_${driver.idCardNumber}.txt` },
    { key: 'permis', label: 'Permis de conduire', value: driver.licenseNumber, filename: `Permis_${driver.licenseNumber}.txt` },
    { key: 'carteGrise', label: 'Carte grise', value: `CG-${driver.vehiclePlate.replace(/\s/g, '')}`, filename: `CarteGrise_${driver.vehiclePlate.replace(/\s/g, '')}.txt` },
  ];

  const allVerified = docs.every((d) => docStatuses[d.key] === 'VÉRIFIÉ');
  const hasRefused = docs.some((d) => docStatuses[d.key] === 'REFUSÉ');

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
              <img src={driver.avatar} alt={driver.firstName} className="mx-auto h-20 w-20 rounded-full bg-muted object-cover" />
              <h2 className="mt-3 text-base font-bold">{driver.firstName} {driver.lastName}</h2>
              <p className="text-sm text-muted-foreground">{driver.phone}</p>
              <div className="mt-2 flex items-center justify-center gap-1">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                <span className="text-sm font-semibold">{driver.rating}</span>
              </div>
              <div className="mt-3"><StatusBadge status={driver.status} /></div>
              <div className="mt-4">
                {driver.status === 'EN_ATTENTE' && (
                  <div className="flex justify-center gap-2">
                    <Button size="sm" className="gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white">
                      <CheckCircle className="h-3.5 w-3.5" />Approuver
                    </Button>
                    <Button size="sm" variant="destructive" className="gap-1.5">
                      <XCircle className="h-3.5 w-3.5" />Refuser
                    </Button>
                  </div>
                )}
                {driver.status === 'APPROUVÉ' && (
                  <Button size="sm" variant="outline" className="gap-1.5 text-amber-600 border-amber-300 w-full">
                    <PauseCircle className="h-3.5 w-3.5" />Suspendre
                  </Button>
                )}
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
              <h3 className="mb-3 text-sm font-semibold">Statistiques</h3>
              <div className="space-y-2.5">
                {[
                  { label: 'Total courses', value: String(driver.totalRides) },
                  { label: 'Note', value: `${driver.rating}/5` },
                  { label: 'Connexion', value: driver.isOnline ? 'En ligne' : 'Hors ligne' },
                  { label: 'Inscrit le', value: format(driver.createdAt, 'dd/MM/yyyy', { locale: fr }) },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{label}</span>
                    <span className="font-medium text-xs">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Content */}
          <div className="space-y-4 lg:col-span-2">
            {/* Vehicle Info */}
            <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
              <h3 className="mb-4 text-sm font-semibold">Informations véhicule</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Type', value: driver.vehicleType },
                  { label: 'Marque', value: driver.vehicleBrand },
                  { label: 'Couleur', value: driver.vehicleColor },
                  { label: 'Immatriculation', value: driver.vehiclePlate },
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
              <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-sm font-semibold">Documents</h3>
                <div className="flex items-center gap-2">
                  {allVerified && (
                    <span className="rounded-full bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 px-2.5 py-0.5 text-[10px] font-medium text-emerald-700 dark:text-emerald-400">
                      Tous vérifiés
                    </span>
                  )}
                  {hasRefused && (
                    <span className="rounded-full bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 px-2.5 py-0.5 text-[10px] font-medium text-destructive">
                      Documents refusés
                    </span>
                  )}
                  <p className="text-[10px] text-muted-foreground">Cliquez sur le statut pour modifier</p>
                </div>
              </div>
              <div className="space-y-2.5">
                {docs.map((doc) => (
                  <DocumentRow
                    key={doc.key}
                    label={doc.label}
                    value={doc.value}
                    filename={doc.filename}
                    status={docStatuses[doc.key]}
                    onStatusChange={updateDocStatus(doc.key)}
                  />
                ))}
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
                          <th key={h} className="pb-2 pr-4 text-left text-xs font-medium text-muted-foreground whitespace-nowrap">{h}</th>
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
                          <td className="py-2.5"><StatusBadge status={ride.status} /></td>
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
    </DashboardLayout>
  );
}
