'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { StatusBadge } from '@/components/ui/status-badge';
import { MapPin, Navigation, Car, User, Phone, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Ride } from '@/types';

interface RideTraficModalProps {
  ride: Ride | null;
  open: boolean;
  onClose: () => void;
}

function buildDirectionsUrl(origin: string, destination: string) {
  const o = encodeURIComponent(origin);
  const d = encodeURIComponent(destination);
  return `https://maps.google.com/maps?f=d&source=s_d&saddr=${o}&daddr=${d}&hl=fr&output=embed`;
}

function buildGoogleMapsLink(origin: string, destination: string) {
  const o = encodeURIComponent(origin);
  const d = encodeURIComponent(destination);
  return `https://www.google.com/maps/dir/${o}/${d}`;
}

export function RideTraficModal({ ride, open, onClose }: RideTraficModalProps) {
  if (!ride) return null;

  const mapUrl = buildDirectionsUrl(ride.departure, ride.destination);
  const mapsLink = buildGoogleMapsLink(ride.departure, ride.destination);

  const isActive = !['TERMINÉE', 'ANNULÉE'].includes(ride.status);

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-4xl w-full p-0 gap-0 overflow-hidden h-[90vh] flex flex-col">
        {/* Header */}
        <DialogHeader className="px-5 py-4 border-b border-border shrink-0">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                <Navigation className="h-4 w-4 text-primary" />
              </div>
              <div>
                <DialogTitle className="text-sm font-bold">
                  Trafic — {ride.reference}
                </DialogTitle>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {isActive ? 'Course en cours de suivi' : 'Trajet de la course'}
                </p>
              </div>
            </div>
            <StatusBadge status={ride.status} />
          </div>
        </DialogHeader>

        {/* Content: map + info */}
        <div className="flex flex-1 flex-col lg:flex-row min-h-0 overflow-hidden">
          {/* Map */}
          <div className="flex-1 min-h-0 bg-muted order-2 lg:order-1">
            <iframe
              src={mapUrl}
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: '300px' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title={`Trafic ${ride.reference}`}
              className="w-full h-full"
            />
          </div>

          {/* Info panel */}
          <div className="w-full lg:w-72 xl:w-80 border-t lg:border-t-0 lg:border-l border-border bg-card overflow-y-auto order-1 lg:order-2 shrink-0">
            <div className="p-4 space-y-5">
              {/* Route */}
              <div>
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Trajet</p>
                <div className="space-y-1">
                  <div className="flex items-start gap-2.5">
                    <div className="mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950/40 shrink-0">
                      <div className="h-2 w-2 rounded-full bg-emerald-500" />
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground">Départ</p>
                      <p className="text-xs font-medium text-foreground">{ride.departure}</p>
                    </div>
                  </div>
                  <div className="ml-2.5 h-4 w-px bg-border" />
                  <div className="flex items-start gap-2.5">
                    <div className="mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-100 dark:bg-red-950/40 shrink-0">
                      <div className="h-2 w-2 rounded-full bg-red-500" />
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground">Destination</p>
                      <p className="text-xs font-medium text-foreground">{ride.destination}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: 'Distance', value: `${ride.distance} km` },
                  { label: 'Durée estimée', value: `${ride.duration} min` },
                  { label: 'Prix', value: new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF', maximumFractionDigits: 0 }).format(ride.price) },
                  { label: 'Véhicule', value: ride.vehicleType },
                ].map(({ label, value }) => (
                  <div key={label} className="rounded-lg bg-muted/50 p-2.5">
                    <p className="text-[10px] text-muted-foreground">{label}</p>
                    <p className="text-xs font-semibold text-foreground mt-0.5">{value}</p>
                  </div>
                ))}
              </div>

              {/* Client */}
              <div>
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Client</p>
                <div className="flex items-center gap-2.5 rounded-lg border border-border bg-muted/30 p-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 shrink-0">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold truncate">{ride.clientName}</p>
                    <p className="text-[10px] text-muted-foreground truncate">{ride.clientPhone}</p>
                  </div>
                  {ride.clientPhone && (
                    <a href={`tel:${ride.clientPhone}`}>
                      <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0">
                        <Phone className="h-3.5 w-3.5" />
                      </Button>
                    </a>
                  )}
                </div>
              </div>

              {/* Driver */}
              {ride.driverName && (
                <div>
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Chauffeur</p>
                  <div className="flex items-center gap-2.5 rounded-lg border border-border bg-muted/30 p-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950/40 shrink-0">
                      <Car className="h-4 w-4 text-emerald-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold truncate">{ride.driverName}</p>
                      {ride.driverPhone && (
                        <p className="text-[10px] text-muted-foreground truncate">{ride.driverPhone}</p>
                      )}
                    </div>
                    {ride.driverPhone && (
                      <a href={`tel:${ride.driverPhone}`}>
                        <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0">
                          <Phone className="h-3.5 w-3.5" />
                        </Button>
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Open in Google Maps */}
              <a
                href={mapsLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-lg border border-border bg-muted/40 px-3 py-2.5 text-xs font-medium text-foreground hover:bg-muted transition-colors"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                Ouvrir dans Google Maps
              </a>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
