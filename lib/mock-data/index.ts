import { faker } from '@faker-js/faker/locale/fr';
import type {
  ActionHistory,
  AdminRole,
  AdminUser,
  CancellationSource,
  Client,
  DocumentVerificationStatus,
  Driver,
  DriverDocument,
  DriverStatus,
  Notification,
  NotificationType,
  Payment,
  PaymentMethod,
  PaymentStatus,
  Ride,
  RideStatus,
  Ticket,
  TicketMessage,
  TicketStatus,
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
    motif: undefined,
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
  const idCardNumber = `CNI-${faker.string.alphanumeric(10).toUpperCase()}`;
  const licenseNumber = `PER-${faker.string.alphanumeric(8).toUpperCase()}`;
  const vehiclePlate = `AB ${faker.number.int({ min: 1000, max: 9999 })} ${faker.helpers.arrayElement(['CI', 'AB', 'CD'])}`;

  const docs: DriverDocument[] = [
    {
      id: `doc-${i + 1}-1`,
      label: "Carte nationale d'identité",
      value: idCardNumber,
      fileUrl: `/uploads/cni_${idCardNumber}.pdf`,
      verificationStatus: faker.helpers.weightedArrayElement([
        { weight: 60, value: 'VÉRIFIÉ' as DocumentVerificationStatus },
        { weight: 30, value: 'EN_ATTENTE' as DocumentVerificationStatus },
        { weight: 10, value: 'REFUSÉ' as DocumentVerificationStatus },
      ]),
    },
    {
      id: `doc-${i + 1}-2`,
      label: 'Permis de conduire',
      value: licenseNumber,
      fileUrl: `/uploads/permis_${licenseNumber}.pdf`,
      verificationStatus: faker.helpers.weightedArrayElement([
        { weight: 60, value: 'VÉRIFIÉ' as DocumentVerificationStatus },
        { weight: 30, value: 'EN_ATTENTE' as DocumentVerificationStatus },
        { weight: 10, value: 'REFUSÉ' as DocumentVerificationStatus },
      ]),
    },
    {
      id: `doc-${i + 1}-3`,
      label: 'Carte grise',
      value: `CG-${vehiclePlate.replace(/\s/g, '')}`,
      fileUrl: `/uploads/cg_${vehiclePlate.replace(/\s/g, '')}.pdf`,
      verificationStatus: faker.helpers.weightedArrayElement([
        { weight: 60, value: 'VÉRIFIÉ' as DocumentVerificationStatus },
        { weight: 30, value: 'EN_ATTENTE' as DocumentVerificationStatus },
        { weight: 10, value: 'REFUSÉ' as DocumentVerificationStatus },
      ]),
    },
  ];

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
    vehiclePlate,
    licenseNumber,
    idCardNumber,
    documents: docs,
    totalRides: faker.number.int({ min: 0, max: 500 }),
    rating: parseFloat(faker.number.float({ min: 3.5, max: 5, fractionDigits: 1 }).toFixed(1)),
    status: faker.helpers.weightedArrayElement([
      { weight: 65, value: 'APPROUVÉ' as const },
      { weight: 15, value: 'EN_ATTENTE' as const },
      { weight: 10, value: 'REFUSÉ' as const },
      { weight: 10, value: 'SUSPENDU' as const },
    ]),
    motif: undefined,
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
    cancelledBy: status === 'ANNULÉE' ? faker.helpers.arrayElement(['CLIENT', 'CHAUFFEUR'] as CancellationSource[]) : undefined,
    cancellationReason: status === 'ANNULÉE' ? faker.helpers.arrayElement([
      'Chauffeur en retard',
      'Annulation par erreur',
      'Itinéraire trop long',
      'Prix trop élevé',
      'Véhicule non conforme',
      'Client injoignable',
    ]) : undefined,
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

// Admin Users
export const adminUsers: AdminUser[] = [
  {
    id: 'admin-1',
    firstName: 'Amadou',
    lastName: 'Koné',
    email: 'amadou.kone@vayrix.com',
    role: 'ADMIN',
    isActive: true,
    createdAt: new Date('2024-01-15'),
  },
  {
    id: 'admin-2',
    firstName: 'Fatou',
    lastName: 'Diallo',
    email: 'fatou.diallo@vayrix.com',
    role: 'GESTIONNAIRE',
    isActive: true,
    createdAt: new Date('2024-03-20'),
  },
  {
    id: 'admin-3',
    firstName: 'Kouadio',
    lastName: 'Yao',
    email: 'kouadio.yao@vayrix.com',
    role: 'GESTIONNAIRE',
    isActive: true,
    createdAt: new Date('2024-06-10'),
  },
  {
    id: 'admin-4',
    firstName: 'Marie',
    lastName: 'Brou',
    email: 'marie.brou@vayrix.com',
    role: 'ADMIN',
    isActive: false,
    createdAt: new Date('2024-08-05'),
  },
];

// Action History
export const actionHistory: ActionHistory[] = [
  { id: 'ah-1', userId: 'admin-1', userName: 'Amadou Koné', action: 'Approbation chauffeur', target: 'Ibrahim Touré', targetId: 'driver-3', createdAt: new Date('2025-01-28T09:15:00') },
  { id: 'ah-2', userId: 'admin-2', userName: 'Fatou Diallo', action: 'Suspension client', target: 'Awa Camara', targetId: 'client-12', createdAt: new Date('2025-01-27T14:30:00') },
  { id: 'ah-3', userId: 'admin-1', userName: 'Amadou Koné', action: 'Vérification document', target: 'Permis de conduire - Moussa Diarra', targetId: 'driver-7', createdAt: new Date('2025-01-27T11:00:00') },
  { id: 'ah-4', userId: 'admin-3', userName: 'Kouadio Yao', action: 'Résolution ticket', target: 'TKT-0001', targetId: 'ticket-1', createdAt: new Date('2025-01-26T16:45:00') },
  { id: 'ah-5', userId: 'admin-2', userName: 'Fatou Diallo', action: 'Refus chauffeur', target: 'Youssouf Coulibaly', targetId: 'driver-15', createdAt: new Date('2025-01-26T10:20:00') },
  { id: 'ah-6', userId: 'admin-1', userName: 'Amadou Koné', action: 'Création utilisateur', target: 'Marie Brou (Admin)', targetId: 'admin-4', createdAt: new Date('2025-01-25T08:30:00') },
  { id: 'ah-7', userId: 'admin-3', userName: 'Kouadio Yao', action: 'Modification tarification', target: 'Prix/km Standard', createdAt: new Date('2025-01-24T15:00:00') },
  { id: 'ah-8', userId: 'admin-2', userName: 'Fatou Diallo', action: 'Approbation chauffeur', target: 'Seydou Keita', targetId: 'driver-11', createdAt: new Date('2025-01-24T09:10:00') },
  { id: 'ah-9', userId: 'admin-1', userName: 'Amadou Koné', action: 'Refus document', target: 'Carte grise - Adama Sangaré', targetId: 'driver-22', createdAt: new Date('2025-01-23T14:20:00') },
  { id: 'ah-10', userId: 'admin-3', userName: 'Kouadio Yao', action: 'Résolution ticket', target: 'TKT-0003', targetId: 'ticket-3', createdAt: new Date('2025-01-22T11:30:00') },
  { id: 'ah-11', userId: 'admin-1', userName: 'Amadou Koné', action: 'Suspension chauffeur', target: 'Bakary Traoré', targetId: 'driver-19', createdAt: new Date('2025-01-21T16:00:00') },
  { id: 'ah-12', userId: 'admin-2', userName: 'Fatou Diallo', action: 'Modification paramètres', target: 'Commission plateforme', createdAt: new Date('2025-01-20T10:00:00') },
];

// Tickets
export const tickets: Ticket[] = [
  {
    id: 'ticket-1',
    reference: 'TKT-0001',
    reporterId: 'client-5',
    reporterName: 'Aissatou Ba',
    reporterType: 'CLIENT',
    subject: 'Chauffeur très en retard',
    status: 'RÉSOLU',
    messages: [
      { id: 'tm-1', senderType: 'USER', senderName: 'Aissatou Ba', content: 'Mon chauffeur a mis 45 minutes pour arriver alors que l\'appli indiquait 10 minutes. J\'ai failli rater mon rendez-vous.', createdAt: new Date('2025-01-25T08:00:00') },
      { id: 'tm-2', senderType: 'ADMIN', senderName: 'Kouadio Yao', content: 'Bonjour Aissatou, nous sommes désolés pour ce désagrément. Nous avons contacté le chauffeur et pris les mesures nécessaires. Un crédit de 2000 XOF a été ajouté à votre compte.', createdAt: new Date('2025-01-25T10:30:00') },
      { id: 'tm-3', senderType: 'USER', senderName: 'Aissatou Ba', content: 'Merci beaucoup, c\'est très professionnel de votre part.', createdAt: new Date('2025-01-25T11:00:00') },
    ],
    createdAt: new Date('2025-01-25T08:00:00'),
    updatedAt: new Date('2025-01-25T11:00:00'),
  },
  {
    id: 'ticket-2',
    reference: 'TKT-0002',
    reporterId: 'driver-5',
    reporterName: 'Moussa Diarra',
    reporterType: 'CHAUFFEUR',
    subject: 'Problème de paiement Mobile Money',
    status: 'NON_LU',
    messages: [
      { id: 'tm-4', senderType: 'USER', senderName: 'Moussa Diarra', content: 'Je n\'ai pas reçu le paiement de ma dernière course via Mobile Money. La course VYX-001050 est marquée comme payée mais je n\'ai rien reçu sur mon compte.', createdAt: new Date('2025-01-28T07:30:00') },
    ],
    createdAt: new Date('2025-01-28T07:30:00'),
    updatedAt: new Date('2025-01-28T07:30:00'),
  },
  {
    id: 'ticket-3',
    reference: 'TKT-0003',
    reporterId: 'client-18',
    reporterName: 'Oumar Sy',
    reporterType: 'CLIENT',
    subject: 'Facturation incorrecte',
    status: 'RÉSOLU',
    messages: [
      { id: 'tm-5', senderType: 'USER', senderName: 'Oumar Sy', content: 'On m\'a facturé 5000 XOF pour un trajet qui coûte normalement 2500 XOF. Le chauffeur a fait un détour très long.', createdAt: new Date('2025-01-21T14:00:00') },
      { id: 'tm-6', senderType: 'ADMIN', senderName: 'Kouadio Yao', content: 'Bonjour Oumar, après vérification du trajet GPS, nous confirmons que le chauffeur a fait un détour injustifié. Nous avons remboursé la différence de 2500 XOF sur votre compte.', createdAt: new Date('2025-01-22T11:00:00') },
    ],
    createdAt: new Date('2025-01-21T14:00:00'),
    updatedAt: new Date('2025-01-22T11:00:00'),
  },
  {
    id: 'ticket-4',
    reference: 'TKT-0004',
    reporterId: 'driver-12',
    reporterName: 'Seydou Keita',
    reporterType: 'CHAUFFEUR',
    subject: 'Application qui plante en cours de course',
    status: 'LU',
    messages: [
      { id: 'tm-7', senderType: 'USER', senderName: 'Seydou Keita', content: 'L\'application se ferme toute seule pendant que je suis en course. Ça m\'est arrivé 3 fois cette semaine. Je perds mes courses à chaque fois.', createdAt: new Date('2025-01-27T19:00:00') },
    ],
    createdAt: new Date('2025-01-27T19:00:00'),
    updatedAt: new Date('2025-01-27T19:00:00'),
  },
  {
    id: 'ticket-5',
    reference: 'TKT-0005',
    reporterId: 'client-8',
    reporterName: 'Mariam Touré',
    reporterType: 'CLIENT',
    subject: 'Chauffeur agressif',
    status: 'NON_LU',
    messages: [
      { id: 'tm-8', senderType: 'USER', senderName: 'Mariam Touré', content: 'Le chauffeur de ma course VYX-001080 a été très agressif verbalement quand j\'ai demandé à mettre la climatisation. Je ne me sentais pas en sécurité.', createdAt: new Date('2025-01-28T20:15:00') },
    ],
    createdAt: new Date('2025-01-28T20:15:00'),
    updatedAt: new Date('2025-01-28T20:15:00'),
  },
  {
    id: 'ticket-6',
    reference: 'TKT-0006',
    reporterId: 'client-22',
    reporterName: 'Ibrahim Cissé',
    reporterType: 'CLIENT',
    subject: 'Course annulée sans raison',
    status: 'NON_LU',
    messages: [
      { id: 'tm-9', senderType: 'USER', senderName: 'Ibrahim Cissé', content: 'Le chauffeur a annulé ma course alors qu\'il était déjà arrivé à mon adresse. J\'ai attendu 20 minutes pour rien.', createdAt: new Date('2025-01-29T06:45:00') },
    ],
    createdAt: new Date('2025-01-29T06:45:00'),
    updatedAt: new Date('2025-01-29T06:45:00'),
  },
];

// Notifications
export const notifications: Notification[] = [
  { id: 'notif-1', type: 'DRIVER_PENDING', title: 'Nouveau chauffeur en attente', description: 'Youssouf Coulibaly souhaite rejoindre la plateforme', isRead: false, link: '/drivers/driver-15', relatedId: 'driver-15', createdAt: new Date('2025-01-29T08:00:00') },
  { id: 'notif-2', type: 'HELP_REQUEST', title: 'Demande d\'aide', description: 'Moussa Diarra signale un problème de paiement', isRead: false, link: '/tickets/ticket-2', relatedId: 'ticket-2', createdAt: new Date('2025-01-28T07:30:00') },
  { id: 'notif-3', type: 'RIDE_CANCELLED', title: 'Course annulée', description: 'VYX-001080 annulée par le chauffeur', isRead: false, link: '/courses/ride-80', relatedId: 'ride-80', createdAt: new Date('2025-01-28T18:00:00') },
  { id: 'notif-4', type: 'TICKET_REPLY', title: 'Réponse à votre discussion', description: 'Aissatou Ba a répondu au ticket TKT-0001', isRead: true, link: '/tickets/ticket-1', relatedId: 'ticket-1', createdAt: new Date('2025-01-25T11:00:00') },
  { id: 'notif-5', type: 'DRIVER_PENDING', title: 'Nouveau chauffeur en attente', description: 'Bakary Traoré souhaite rejoindre la plateforme', isRead: false, link: '/drivers/driver-19', relatedId: 'driver-19', createdAt: new Date('2025-01-29T09:30:00') },
  { id: 'notif-6', type: 'HELP_REQUEST', title: 'Demande d\'aide', description: 'Mariam Touré signale un chauffeur agressif', isRead: false, link: '/tickets/ticket-5', relatedId: 'ticket-5', createdAt: new Date('2025-01-28T20:15:00') },
  { id: 'notif-7', type: 'RIDE_CANCELLED', title: 'Course annulée', description: 'VYX-001095 annulée par le client', isRead: true, link: '/courses/ride-95', relatedId: 'ride-95', createdAt: new Date('2025-01-27T16:30:00') },
  { id: 'notif-8', type: 'HELP_REQUEST', title: 'Demande d\'aide', description: 'Ibrahim Cissé signale une course annulée sans raison', isRead: false, link: '/tickets/ticket-6', relatedId: 'ticket-6', createdAt: new Date('2025-01-29T06:45:00') },
];
