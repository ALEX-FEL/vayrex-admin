import { faker } from '@faker-js/faker/locale/fr';
import type {
  Client,
  Driver,
  DriverStatus,
  Payment,
  PaymentMethod,
  PaymentStatus,
  Ride,
  RideStatus,
  VehicleType,
} from '@/types';

faker.seed(42);

// Vehicle Types
export const vehicleTypes: VehicleType[] = [
  {
    id: 'vt-1',
    name: 'Moto',
    description: 'Rapide et économique pour les petits trajets en ville',
    icon: 'bike',
    passengerCapacity: 1,
    minimumPrice: 500,
    pricePerKm: 150,
    pricePerMinute: 20,
    baseCharge: 200,
    isActive: true,
    createdAt: new Date('2024-01-01'),
  },
  {
    id: 'vt-2',
    name: 'Standard',
    description: 'Confort optimal pour vos déplacements quotidiens',
    icon: 'car',
    passengerCapacity: 4,
    minimumPrice: 1000,
    pricePerKm: 250,
    pricePerMinute: 30,
    baseCharge: 300,
    isActive: true,
    createdAt: new Date('2024-01-01'),
  },
  {
    id: 'vt-3',
    name: 'Premium',
    description: 'Véhicules haut de gamme pour vos déplacements VIP',
    icon: 'crown',
    passengerCapacity: 4,
    minimumPrice: 2000,
    pricePerKm: 450,
    pricePerMinute: 50,
    baseCharge: 500,
    isActive: true,
    createdAt: new Date('2024-01-01'),
  },
];

const vehicleTypeNames = ['Moto', 'Standard', 'Premium'];
const vehicleTypeMap: Record<string, string> = {
  Moto: 'vt-1',
  Standard: 'vt-2',
  Premium: 'vt-3',
};

// Clients
export const clients: Client[] = Array.from({ length: 50 }, (_, i) => {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  return {
    id: `client-${i + 1}`,
    firstName,
    lastName,
    phone: `+225 0${faker.number.int({ min: 10000000, max: 99999999 })}`,
    email: faker.internet.email({ firstName, lastName }).toLowerCase(),
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${firstName}${i}`,
    totalRides: faker.number.int({ min: 1, max: 80 }),
    totalSpent: faker.number.int({ min: 5000, max: 500000 }),
    status: faker.helpers.weightedArrayElement([
      { weight: 85, value: 'ACTIF' as const },
      { weight: 15, value: 'SUSPENDU' as const },
    ]),
    createdAt: faker.date.between({ from: '2023-01-01', to: '2024-12-01' }),
  };
});

// Drivers
const driverStatuses: DriverStatus[] = ['EN_ATTENTE', 'APPROUVÉ', 'REFUSÉ', 'SUSPENDU'];
const vehicleBrands = ['Toyota', 'Honda', 'Yamaha', 'Suzuki', 'Kia', 'Hyundai', 'Mercedes', 'BMW'];
const vehicleColors = ['Blanc', 'Noir', 'Gris', 'Bleu', 'Rouge', 'Silver'];

export const drivers: Driver[] = Array.from({ length: 30 }, (_, i) => {
  const firstName = faker.person.firstName('male');
  const lastName = faker.person.lastName();
  const vType = faker.helpers.arrayElement(vehicleTypeNames);
  return {
    id: `driver-${i + 1}`,
    firstName,
    lastName,
    phone: `+225 0${faker.number.int({ min: 10000000, max: 99999999 })}`,
    email: faker.internet.email({ firstName, lastName }).toLowerCase(),
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=driver${firstName}${i}`,
    vehicleType: vType,
    vehicleBrand: faker.helpers.arrayElement(vehicleBrands),
    vehicleColor: faker.helpers.arrayElement(vehicleColors),
    vehiclePlate: `AB ${faker.number.int({ min: 1000, max: 9999 })} ${faker.helpers.arrayElement(['CI', 'AB', 'CD'])}`,
    licenseNumber: `PER-${faker.string.alphanumeric(8).toUpperCase()}`,
    idCardNumber: `CNI-${faker.string.alphanumeric(10).toUpperCase()}`,
    totalRides: faker.number.int({ min: 0, max: 500 }),
    rating: parseFloat(faker.number.float({ min: 3.5, max: 5, fractionDigits: 1 }).toFixed(1)),
    status: faker.helpers.weightedArrayElement([
      { weight: 65, value: 'APPROUVÉ' as const },
      { weight: 15, value: 'EN_ATTENTE' as const },
      { weight: 10, value: 'REFUSÉ' as const },
      { weight: 10, value: 'SUSPENDU' as const },
    ]),
    isOnline: faker.datatype.boolean({ probability: 0.4 }),
    createdAt: faker.date.between({ from: '2023-01-01', to: '2024-12-01' }),
  };
});

// Rides
const rideStatuses: RideStatus[] = [
  'EN_ATTENTE',
  'CHAUFFEUR_ASSIGNÉ',
  'CHAUFFEUR_EN_ROUTE',
  'ARRIVÉ',
  'COURSE_EN_COURS',
  'TERMINÉE',
  'ANNULÉE',
];

const abidjanLocations = [
  'Cocody, Abidjan',
  'Plateau, Abidjan',
  'Yopougon, Abidjan',
  'Marcory, Abidjan',
  'Adjamé, Abidjan',
  'Abobo, Abidjan',
  'Koumassi, Abidjan',
  'Port-Bouët, Abidjan',
  'Treichville, Abidjan',
  'Bingerville, Abidjan',
  'Deux Plateaux, Abidjan',
  'Riviera, Abidjan',
  'Zone 4, Abidjan',
  'Angré, Abidjan',
];

export const rides: Ride[] = Array.from({ length: 300 }, (_, i) => {
  const client = faker.helpers.arrayElement(clients);
  const approvedDrivers = drivers.filter((d) => d.status === 'APPROUVÉ');
  const driver = faker.helpers.arrayElement(approvedDrivers);
  const status = faker.helpers.weightedArrayElement([
    { weight: 45, value: 'TERMINÉE' as const },
    { weight: 10, value: 'ANNULÉE' as const },
    { weight: 15, value: 'CHAUFFEUR_EN_ROUTE' as const },
    { weight: 10, value: 'COURSE_EN_COURS' as const },
    { weight: 8, value: 'EN_ATTENTE' as const },
    { weight: 7, value: 'CHAUFFEUR_ASSIGNÉ' as const },
    { weight: 5, value: 'ARRIVÉ' as const },
  ]);
  const vType = faker.helpers.arrayElement(vehicleTypeNames);
  const distance = parseFloat(faker.number.float({ min: 1, max: 30, fractionDigits: 1 }).toFixed(1));
  const vt = vehicleTypes.find((v) => v.name === vType)!;
  const price = Math.max(vt.minimumPrice, vt.baseCharge + distance * vt.pricePerKm);
  const departure = faker.helpers.arrayElement(abidjanLocations);
  const destination = faker.helpers.arrayElement(abidjanLocations.filter((l) => l !== departure));
  const createdAt = faker.date.between({ from: '2024-01-01', to: '2025-01-31' });

  return {
    id: `ride-${i + 1}`,
    reference: `VYX-${String(i + 1001).padStart(6, '0')}`,
    clientId: client.id,
    clientName: `${client.firstName} ${client.lastName}`,
    clientPhone: client.phone,
    driverId: status === 'EN_ATTENTE' ? null : driver.id,
    driverName: status === 'EN_ATTENTE' ? null : `${driver.firstName} ${driver.lastName}`,
    driverPhone: status === 'EN_ATTENTE' ? null : driver.phone,
    vehicleType: vType,
    departure,
    destination,
    distance,
    duration: Math.round(distance * 4 + faker.number.int({ min: 2, max: 10 })),
    price: Math.round(price),
    paymentMethod: faker.helpers.arrayElement(['CASH', 'MOBILE_MONEY'] as PaymentMethod[]),
    status,
    createdAt,
    updatedAt: new Date(createdAt.getTime() + faker.number.int({ min: 600000, max: 3600000 })),
  };
});

// Payments
const completedRides = rides.filter((r) => r.status === 'TERMINÉE');

export const payments: Payment[] = completedRides.slice(0, 300).map((ride, i) => ({
  id: `payment-${i + 1}`,
  reference: `PAY-${String(i + 2001).padStart(6, '0')}`,
  rideId: ride.id,
  clientId: ride.clientId,
  clientName: ride.clientName,
  driverId: ride.driverId || '',
  driverName: ride.driverName || '',
  amount: ride.price,
  method: ride.paymentMethod,
  status: faker.helpers.weightedArrayElement([
    { weight: 90, value: 'PAYÉ' as const },
    { weight: 10, value: 'EN_ATTENTE' as const },
  ]) as PaymentStatus,
  createdAt: ride.updatedAt,
}));

// Dashboard stats
export function getDashboardStats() {
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];

  const todayRides = rides.filter((r) => r.createdAt.toISOString().split('T')[0] === todayStr);
  const completedRidesCount = rides.filter((r) => r.status === 'TERMINÉE').length;
  const cancelledRides = rides.filter((r) => r.status === 'ANNULÉE').length;
  const revenue = payments
    .filter((p) => p.status === 'PAYÉ')
    .reduce((sum, p) => sum + p.amount, 0);
  const activeDrivers = drivers.filter((d) => d.isOnline && d.status === 'APPROUVÉ').length;

  return {
    totalClients: clients.length,
    totalDrivers: drivers.length,
    activeDrivers,
    totalRides: rides.length,
    todayRides: todayRides.length,
    completedRides: completedRidesCount,
    cancelledRides,
    estimatedRevenue: revenue,
  };
}

export function getMonthlyRidesData() {
  const months = [
    'Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun',
    'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc',
  ];
  return months.map((month, idx) => {
    const monthRides = rides.filter((r) => r.createdAt.getMonth() === idx);
    return {
      month,
      courses: monthRides.length,
      terminées: monthRides.filter((r) => r.status === 'TERMINÉE').length,
      annulées: monthRides.filter((r) => r.status === 'ANNULÉE').length,
    };
  });
}

export function getVehicleTypeDistribution() {
  return vehicleTypeNames.map((name) => ({
    name,
    value: rides.filter((r) => r.vehicleType === name).length,
  }));
}

export function getRideStatusDistribution() {
  const labels: Record<RideStatus, string> = {
    EN_ATTENTE: 'En attente',
    CHAUFFEUR_ASSIGNÉ: 'Chauffeur assigné',
    CHAUFFEUR_EN_ROUTE: 'En route',
    ARRIVÉ: 'Arrivé',
    COURSE_EN_COURS: 'En cours',
    TERMINÉE: 'Terminée',
    ANNULÉE: 'Annulée',
  };
  return rideStatuses.map((status) => ({
    name: labels[status],
    value: rides.filter((r) => r.status === status).length,
  }));
}

export function getRecentActivity(limit = 10) {
  return [...rides]
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, limit);
}

export function getPaymentStats() {
  const paid = payments.filter((p) => p.status === 'PAYÉ');
  const thisMonth = new Date();
  const monthRevenue = paid
    .filter((p) => p.createdAt.getMonth() === thisMonth.getMonth())
    .reduce((sum, p) => sum + p.amount, 0);
  const totalRevenue = paid.reduce((sum, p) => sum + p.amount, 0);
  const cashTotal = paid
    .filter((p) => p.method === 'CASH')
    .reduce((sum, p) => sum + p.amount, 0);
  const mobileTotal = paid
    .filter((p) => p.method === 'MOBILE_MONEY')
    .reduce((sum, p) => sum + p.amount, 0);

  return { totalRevenue, monthRevenue, cashTotal, mobileTotal };
}

export function getPaymentMethodDistribution() {
  const cash = payments.filter((p) => p.method === 'CASH').length;
  const mobile = payments.filter((p) => p.method === 'MOBILE_MONEY').length;
  return [
    { name: 'Cash', value: cash },
    { name: 'Mobile Money', value: mobile },
  ];
}
