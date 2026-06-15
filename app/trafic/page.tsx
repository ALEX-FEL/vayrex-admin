'use client';

import { useState, useMemo } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { StatusBadge } from '@/components/ui/status-badge';
import { getTrafficData } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import {
  MapPin,
  Car,
  UserCheck,
  Activity,
  Navigation,
  Phone,
  Star,
  RefreshCw,
  Map,
  List,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ActiveRideMapData, DriverMapMarker } from '@/lib/mock-data';

const STATUS_LABELS: Record<string, string> = {
  EN_ATTENTE: 'En attente',
  CHAUFFEUR_ASSIGNÉ: 'Assigné',
  CHAUFFEUR_EN_ROUTE: 'En route',
  ARRIVÉ: 'Arrivé',
  COURSE_EN_COURS: 'En cours',
};

const VEHICLE_ICONS: Record<string, string> = {
  Moto: '🏍️',
  Standard: '🚗',
  Premium: '🚙',
};

function buildAbidjanMapUrl() {
  return 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d127566.27476647783!2d-4.1499657!3d5.362985!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xfc1ea5311959685%3A0x7db70c3e8ed01a99!2sAbidjan%2C%20C%C3%B4te%20d%27Ivoire!5e1!3m2!1sfr!2sci!4v1680000000000!5m2!1sfr!2sci';
}

function DriverCard({ driver, isSelected, onClick }: { driver: DriverMapMarker; isSelected: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full flex items-center gap-3 rounded-lg p-3 text-left transition-all duration-150 border',
        isSelected
          ? 'bg-primary/10 border-primary/30'
          : 'bg-card border-border hover:bg-muted/50'
      )}
    >
      <div className="relative shrink-0">
        <img src={driver.avatar} alt={driver.name} className="h-9 w-9 rounded-full bg-muted" />
        <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 border-2 border-card" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-foreground truncate">{driver.name}</p>
        <div className="flex items-center gap-1.5 mt-0.5">
          <span className="text-[10px] text-muted-foreground">{VEHICLE_ICONS[driver.vehicleType]} {driver.vehicleType}</span>
          <span className="text-muted-foreground/40">·</span>
          <div className="flex items-center gap-0.5">
            <Star className="h-2.5 w-2.5 fill-amber-400 text-amber-400" />
            <span className="text-[10px] text-muted-foreground">{driver.rating}</span>
          </div>
        </div>
      </div>
      {driver.currentRideId && (
        <span className="shrink-0 rounded-full bg-blue-100 dark:bg-blue-950/40 px-1.5 py-0.5 text-[10px] font-medium text-blue-600 dark:text-blue-400">
          En course
        </span>
      )}
    </button>
  );
}

function RideCard({ ride, isSelected, onClick }: { ride: ActiveRideMapData; isSelected: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full flex items-start gap-3 rounded-lg p-3 text-left transition-all duration-150 border',
        isSelected
          ? 'bg-primary/10 border-primary/30'
          : 'bg-card border-border hover:bg-muted/50'
      )}
    >
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-base">
        {VEHICLE_ICONS[ride.vehicleType] || '🚗'}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <p className="text-[10px] font-mono font-semibold text-primary">{ride.reference}</p>
          <StatusBadge status={ride.status} />
        </div>
        <p className="text-xs font-medium text-foreground truncate mt-0.5">{ride.clientName}</p>
        <div className="mt-1 space-y-0.5">
          <div className="flex items-center gap-1">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
            <p className="text-[10px] text-muted-foreground truncate">{ride.departure}</p>
          </div>
          <div className="flex items-center gap-1">
            <div className="h-1.5 w-1.5 rounded-full bg-red-500 shrink-0" />
            <p className="text-[10px] text-muted-foreground truncate">{ride.destination}</p>
          </div>
        </div>
      </div>
    </button>
  );
}

type ActiveTab = 'drivers' | 'rides';
type MobileView = 'map' | 'list';

export default function TraficPage() {
  const { drivers, activeRides } = useMemo(() => getTrafficData(), []);
  const [selectedDriver, setSelectedDriver] = useState<DriverMapMarker | null>(null);
  const [selectedRide, setSelectedRide] = useState<ActiveRideMapData | null>(null);
  const [activeTab, setActiveTab] = useState<ActiveTab>('drivers');
  const [mobileView, setMobileView] = useState<MobileView>('map');
  const [refreshKey, setRefreshKey] = useState(0);

  const mapUrl = buildAbidjanMapUrl();

  const ridesInProgress = activeRides.filter((r) =>
    ['CHAUFFEUR_EN_ROUTE', 'COURSE_EN_COURS', 'ARRIVÉ'].includes(r.status)
  );

  const handleRefresh = () => {
    setRefreshKey((k) => k + 1);
    setSelectedDriver(null);
    setSelectedRide(null);
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-4 h-[calc(100vh-60px-2rem)]">
        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between shrink-0">
          <div>
            <h1 className="text-xl font-bold text-foreground">Trafic en temps réel</h1>
            <p className="mt-0.5 text-sm text-muted-foreground">
              {drivers.length} chauffeurs en ligne · {ridesInProgress.length} courses actives
            </p>
          </div>
          <div className="flex items-center gap-2">
            {/* Mobile view toggle */}
            <div className="flex rounded-lg border border-border bg-muted/40 p-0.5 lg:hidden">
              <button
                onClick={() => setMobileView('map')}
                className={cn(
                  'flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all',
                  mobileView === 'map' ? 'bg-card shadow-sm text-foreground' : 'text-muted-foreground'
                )}
              >
                <Map className="h-3.5 w-3.5" />
                Carte
              </button>
              <button
                onClick={() => setMobileView('list')}
                className={cn(
                  'flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all',
                  mobileView === 'list' ? 'bg-card shadow-sm text-foreground' : 'text-muted-foreground'
                )}
              >
                <List className="h-3.5 w-3.5" />
                Liste
              </button>
            </div>
            <Button variant="outline" size="sm" className="gap-1.5 text-xs" onClick={handleRefresh}>
              <RefreshCw className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Actualiser</span>
            </Button>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3 shrink-0">
          {[
            { label: 'En ligne', value: drivers.length, icon: Activity, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-950/30' },
            { label: 'En course', value: activeRides.filter((r) => r.status === 'COURSE_EN_COURS').length, icon: Car, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-950/30' },
            { label: 'En route', value: activeRides.filter((r) => r.status === 'CHAUFFEUR_EN_ROUTE').length, icon: Navigation, color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-950/30' },
          ].map(({ label, value, icon: Icon, color, bg }) => (
            <div key={label} className="rounded-xl border border-border bg-card p-3 shadow-sm flex items-center gap-3">
              <div className={cn('flex h-8 w-8 items-center justify-center rounded-lg shrink-0', bg)}>
                <Icon className={cn('h-4 w-4', color)} />
              </div>
              <div>
                <p className="text-lg font-bold text-foreground leading-none">{value}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">{label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Main content */}
        <div className="flex flex-1 gap-4 min-h-0 overflow-hidden">

          {/* Map - always visible on desktop, togglable on mobile */}
          <div className={cn(
            'flex-1 min-w-0 rounded-xl overflow-hidden border border-border shadow-sm bg-muted',
            mobileView === 'list' ? 'hidden lg:flex' : 'flex'
          )}>
            <iframe
              key={refreshKey}
              src={mapUrl}
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: '300px' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Carte Trafic Abidjan"
              className="w-full h-full"
            />
          </div>

          {/* Side panel */}
          <div className={cn(
            'w-full lg:w-80 xl:w-96 flex flex-col gap-3 overflow-hidden',
            mobileView === 'map' ? 'hidden lg:flex' : 'flex'
          )}>

            {/* Tabs */}
            <div className="flex rounded-lg border border-border bg-muted/40 p-0.5 shrink-0">
              <button
                onClick={() => setActiveTab('drivers')}
                className={cn(
                  'flex flex-1 items-center justify-center gap-1.5 rounded-md py-2 text-xs font-medium transition-all',
                  activeTab === 'drivers' ? 'bg-card shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <UserCheck className="h-3.5 w-3.5" />
                Chauffeurs ({drivers.length})
              </button>
              <button
                onClick={() => setActiveTab('rides')}
                className={cn(
                  'flex flex-1 items-center justify-center gap-1.5 rounded-md py-2 text-xs font-medium transition-all',
                  activeTab === 'rides' ? 'bg-card shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <Car className="h-3.5 w-3.5" />
                Courses ({activeRides.length})
              </button>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-0.5 scrollbar-hide">
              {activeTab === 'drivers' && (
                <>
                  {drivers.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <UserCheck className="h-8 w-8 text-muted-foreground/40 mb-2" />
                      <p className="text-sm text-muted-foreground">Aucun chauffeur en ligne</p>
                    </div>
                  )}
                  {drivers.map((driver) => (
                    <DriverCard
                      key={driver.id}
                      driver={driver}
                      isSelected={selectedDriver?.id === driver.id}
                      onClick={() => {
                        setSelectedDriver(selectedDriver?.id === driver.id ? null : driver);
                        setSelectedRide(null);
                      }}
                    />
                  ))}
                </>
              )}

              {activeTab === 'rides' && (
                <>
                  {activeRides.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <Car className="h-8 w-8 text-muted-foreground/40 mb-2" />
                      <p className="text-sm text-muted-foreground">Aucune course active</p>
                    </div>
                  )}
                  {activeRides.map((ride) => (
                    <RideCard
                      key={ride.id}
                      ride={ride}
                      isSelected={selectedRide?.id === ride.id}
                      onClick={() => {
                        setSelectedRide(selectedRide?.id === ride.id ? null : ride);
                        setSelectedDriver(null);
                      }}
                    />
                  ))}
                </>
              )}
            </div>

            {/* Detail panel */}
            {selectedDriver && (
              <div className="shrink-0 rounded-xl border border-primary/30 bg-primary/5 p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <img src={selectedDriver.avatar} className="h-10 w-10 rounded-full" alt={selectedDriver.name} />
                  <div className="flex-1">
                    <p className="text-sm font-semibold">{selectedDriver.name}</p>
                    <p className="text-xs text-muted-foreground">{selectedDriver.vehicleType}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                    <span className="text-xs font-medium">{selectedDriver.rating}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate">
                    {selectedDriver.lat.toFixed(4)}°N, {Math.abs(selectedDriver.lng).toFixed(4)}°W
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href={`tel:${selectedDriver.phone}`}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-primary text-primary-foreground py-2 text-xs font-medium hover:bg-primary/90 transition-colors"
                  >
                    <Phone className="h-3.5 w-3.5" />
                    Appeler
                  </a>
                  {selectedDriver.currentRideId && (
                    <span className="flex items-center gap-1 text-xs text-blue-600 font-medium">
                      <Activity className="h-3.5 w-3.5" />
                      En course
                    </span>
                  )}
                </div>
              </div>
            )}

            {selectedRide && (
              <div className="shrink-0 rounded-xl border border-primary/30 bg-primary/5 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-mono font-bold text-primary">{selectedRide.reference}</p>
                  <StatusBadge status={selectedRide.status} />
                </div>
                <div>
                  <p className="text-sm font-semibold">{selectedRide.clientName}</p>
                  {selectedRide.driverName && (
                    <p className="text-xs text-muted-foreground">Chauffeur: {selectedRide.driverName}</p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-start gap-2">
                    <div className="mt-1 h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
                    <p className="text-xs text-muted-foreground">{selectedRide.departure}</p>
                  </div>
                  <div className="ml-0.5 h-3 w-px bg-border ml-[3px]" />
                  <div className="flex items-start gap-2">
                    <div className="mt-1 h-2 w-2 rounded-full bg-red-500 shrink-0" />
                    <p className="text-xs text-muted-foreground">{selectedRide.destination}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
