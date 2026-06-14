export type RideStatus =
  | 'EN_ATTENTE'
  | 'CHAUFFEUR_ASSIGNÉ'
  | 'CHAUFFEUR_EN_ROUTE'
  | 'ARRIVÉ'
  | 'COURSE_EN_COURS'
  | 'TERMINÉE'
  | 'ANNULÉE';

export type DriverStatus = 'EN_ATTENTE' | 'APPROUVÉ' | 'REFUSÉ' | 'SUSPENDU';

export type ClientStatus = 'ACTIF' | 'SUSPENDU';

export type PaymentStatus = 'PAYÉ' | 'EN_ATTENTE';

export type PaymentMethod = 'CASH' | 'MOBILE_MONEY';

export type DocumentVerificationStatus = 'EN_ATTENTE' | 'VÉRIFIÉ' | 'REFUSÉ';

export type CancellationSource = 'CLIENT' | 'CHAUFFEUR';

export interface DriverDocument {
  id: string;
  label: string;
  value: string;
  fileUrl: string;
  verificationStatus: DocumentVerificationStatus;
}

export interface VehicleType {
  id: string;
  name: string;
  description: string;
  icon: string;
  passengerCapacity: number;
  minimumPrice: number;
  pricePerKm: number;
  pricePerMinute: number;
  baseCharge: number;
  isActive: boolean;
  createdAt: Date;
}

export interface Client {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  avatar: string;
  totalRides: number;
  totalSpent: number;
  status: ClientStatus;
  motif?: string;
  createdAt: Date;
}

export interface Driver {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  avatar: string;
  vehicleType: string;
  vehicleBrand: string;
  vehicleColor: string;
  vehiclePlate: string;
  licenseNumber: string;
  idCardNumber: string;
  documents: DriverDocument[];
  totalRides: number;
  rating: number;
  status: DriverStatus;
  motif?: string;
  isOnline: boolean;
  createdAt: Date;
}

export interface Ride {
  id: string;
  reference: string;
  clientId: string;
  clientName: string;
  clientPhone: string;
  driverId: string | null;
  driverName: string | null;
  driverPhone: string | null;
  vehicleType: string;
  departure: string;
  destination: string;
  distance: number;
  duration: number;
  price: number;
  paymentMethod: PaymentMethod;
  status: RideStatus;
  cancelledBy?: CancellationSource;
  cancellationReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Payment {
  id: string;
  reference: string;
  rideId: string;
  clientId: string;
  clientName: string;
  driverId: string;
  driverName: string;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  createdAt: Date;
}

export type AdminRole = 'ADMIN' | 'GESTIONNAIRE';

export type TicketStatus = 'NON_LU' | 'LU' | 'RÉSOLU';

export type NotificationType = 'DRIVER_PENDING' | 'HELP_REQUEST' | 'RIDE_CANCELLED' | 'TICKET_REPLY';

export interface AdminUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: AdminRole;
  isActive: boolean;
  createdAt: Date;
}

export interface ActionHistory {
  id: string;
  userId: string;
  userName: string;
  action: string;
  target: string;
  targetId?: string;
  createdAt: Date;
}

export interface TicketMessage {
  id: string;
  senderType: 'USER' | 'ADMIN';
  senderName: string;
  content: string;
  createdAt: Date;
}

export interface Ticket {
  id: string;
  reference: string;
  reporterId: string;
  reporterName: string;
  reporterType: 'CLIENT' | 'CHAUFFEUR';
  subject: string;
  status: TicketStatus;
  messages: TicketMessage[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  isRead: boolean;
  link: string;
  relatedId?: string;
  createdAt: Date;
}

export interface PricingConfig {
  defaultMinimumPrice: number;
  baseCharge: number;
  platformCommission: number;
}

export interface AppSettings {
  platformName: string;
  currency: string;
  smsEnabled: boolean;
  emailEnabled: boolean;
  sessionDuration: number;
  twoFactorAuth: boolean;
}
