import 'server-only';
import { supabase } from './supabase';
import type { Tables } from './supabase';

// Vehicle Types
export async function getVehicleTypes() {
  const { data, error } = await supabase.from('vehicle_types').select('*').order('name');
  if (error) throw error;
  return data;
}

export async function getVehicleType(id: string) {
  const { data, error } = await supabase.from('vehicle_types').select('*').eq('id', id).maybeSingle();
  if (error) throw error;
  return data;
}

// Clients
export async function getClients() {
  const { data, error } = await supabase.from('clients').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function getClient(id: string) {
  const { data, error } = await supabase.from('clients').select('*').eq('id', id).maybeSingle();
  if (error) throw error;
  return data;
}

// Drivers
export async function getDrivers() {
  const { data, error } = await supabase.from('drivers').select('*, vehicle_type:vehicle_types(name)').order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function getDriver(id: string) {
  const { data, error } = await supabase.from('drivers').select('*, vehicle_type:vehicle_types(name, icon)').eq('id', id).maybeSingle();
  if (error) throw error;
  return data;
}

// Rides
export async function getRides(limit = 300) {
  const { data, error } = await supabase.from('rides').select('*').order('created_at', { ascending: false }).limit(limit);
  if (error) throw error;
  return data;
}

export async function getRide(id: string) {
  const { data, error } = await supabase.from('rides').select('*').eq('id', id).maybeSingle();
  if (error) throw error;
  return data;
}

export async function getRidesByClient(clientId: string) {
  const { data, error } = await supabase.from('rides').select('*').eq('client_id', clientId).order('created_at', { ascending: false }).limit(50);
  if (error) throw error;
  return data;
}

export async function getRidesByDriver(driverId: string) {
  const { data, error } = await supabase.from('rides').select('*').eq('driver_id', driverId).order('created_at', { ascending: false }).limit(50);
  if (error) throw error;
  return data;
}

// Payments
export async function getPayments() {
  const { data, error } = await supabase.from('payments').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

// Pricing Config
export async function getPricingConfig() {
  const { data, error } = await supabase.from('pricing_config').select('*').limit(1).maybeSingle();
  if (error) throw error;
  return data;
}

// App Settings
export async function getAppSettings() {
  const { data, error } = await supabase.from('app_settings').select('*').limit(1).maybeSingle();
  if (error) throw error;
  return data;
}

// Dashboard Stats
export async function getDashboardStats() {
  const [clients, drivers, rides, payments] = await Promise.all([
    supabase.from('clients').select('id', { count: 'exact', head: true }),
    supabase.from('drivers').select('id, is_online, status', { count: 'exact' }),
    supabase.from('rides').select('status, price'),
    supabase.from('payments').select('amount, status'),
  ]);

  const today = new Date().toISOString().split('T')[0];
  const { count: todayRidesCount } = await supabase.from('rides').select('id', { count: 'exact', head: true }).gte('created_at', today);

  const activeDrivers = (drivers.data ?? []).filter((d) => d.is_online && d.status === 'APPROUVÉ').length;
  const completedRides = (rides.data ?? []).filter((r) => r.status === 'TERMINÉE').length;
  const cancelledRides = (rides.data ?? []).filter((r) => r.status === 'ANNULÉE').length;
  const revenue = (payments.data ?? []).filter((p) => p.status === 'PAYÉ').reduce((sum, p) => sum + p.amount, 0);

  return {
    totalClients: clients.count ?? 0,
    totalDrivers: drivers.count ?? 0,
    activeDrivers,
    totalRides: rides.data?.length ?? 0,
    todayRides: todayRidesCount ?? 0,
    completedRides,
    cancelledRides,
    estimatedRevenue: revenue,
  };
}

// Payment Stats
export async function getPaymentStats() {
  const { data: payments } = await supabase.from('payments').select('amount, method, status, created_at');
  const paid = (payments ?? []).filter((p) => p.status === 'PAYÉ');
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

  return {
    totalRevenue: paid.reduce((s, p) => s + p.amount, 0),
    monthRevenue: paid.filter((p) => p.created_at >= monthStart).reduce((s, p) => s + p.amount, 0),
    cashTotal: paid.filter((p) => p.method === 'CASH').reduce((s, p) => s + p.amount, 0),
    mobileTotal: paid.filter((p) => p.method === 'MOBILE_MONEY').reduce((s, p) => s + p.amount, 0),
  };
}

// Chart Data

export async function getMonthlyRidesData() {
  const { data: rides } = await supabase.from('rides').select('status, created_at');
  const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];

  return months.map((month, idx) => {
    const monthRides = (rides ?? []).filter((r) => new Date(r.created_at).getMonth() === idx);
    return {
      month,
      courses: monthRides.length,
      terminées: monthRides.filter((r) => r.status === 'TERMINÉE').length,
      annulées: monthRides.filter((r) => r.status === 'ANNULÉE').length,
    };
  });
}

export async function getVehicleTypeDistribution() {
  const [vehicleTypes, { data: rides }] = await Promise.all([
    supabase.from('vehicle_types').select('id, name'),
    supabase.from('rides').select('vehicle_type_id'),
  ]);

  return (vehicleTypes.data ?? []).map((vt) => ({
    name: vt.name,
    value: (rides ?? []).filter((r) => r.vehicle_type_id === vt.id).length,
  }));
}

export async function getRideStatusDistribution() {
  const { data: rides } = await supabase.from('rides').select('status');

  const labels: Record<string, string> = {
    EN_ATTENTE: 'En attente',
    CHAUFFEUR_ASSIGNÉ: 'Chauffeur assigné',
    CHAUFFEUR_EN_ROUTE: 'En route',
    ARRIVÉ: 'Arrivé',
    COURSE_EN_COURS: 'En cours',
    TERMINÉE: 'Terminée',
    ANNULÉE: 'Annulée',
  };

  const statuses = ['EN_ATTENTE', 'CHAUFFEUR_ASSIGNÉ', 'CHAUFFEUR_EN_ROUTE', 'ARRIVÉ', 'COURSE_EN_COURS', 'TERMINÉE', 'ANNULÉE'];

  return statuses.map((status) => ({
    name: labels[status],
    value: (rides ?? []).filter((r) => r.status === status).length,
  }));
}

export async function getPaymentMethodDistribution() {
  const { data: payments } = await supabase.from('payments').select('method');
  const cash = (payments ?? []).filter((p) => p.method === 'CASH').length;
  const mobile = (payments ?? []).filter((p) => p.method === 'MOBILE_MONEY').length;

  return [
    { name: 'Cash', value: cash },
    { name: 'Mobile Money', value: mobile },
  ];
}
