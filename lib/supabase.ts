import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      vehicle_types: {
        Row: {
          id: string;
          name: string;
          description: string;
          icon: string;
          passenger_capacity: number;
          minimum_price: number;
          price_per_km: number;
          price_per_minute: number;
          base_charge: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string;
          icon?: string;
          passenger_capacity?: number;
          minimum_price?: number;
          price_per_km?: number;
          price_per_minute?: number;
          base_charge?: number;
          is_active?: boolean;
        };
        Update: {
          name?: string;
          description?: string;
          icon?: string;
          passenger_capacity?: number;
          minimum_price?: number;
          price_per_km?: number;
          price_per_minute?: number;
          base_charge?: number;
          is_active?: boolean;
        };
      };
      clients: {
        Row: {
          id: string;
          first_name: string;
          last_name: string;
          phone: string;
          email: string;
          avatar: string;
          total_rides: number;
          total_spent: number;
          status: 'ACTIF' | 'SUSPENDU';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          first_name: string;
          last_name: string;
          phone: string;
          email: string;
          avatar?: string;
          total_rides?: number;
          total_spent?: number;
          status?: 'ACTIF' | 'SUSPENDU';
        };
        Update: {
          first_name?: string;
          last_name?: string;
          phone?: string;
          email?: string;
          avatar?: string;
          total_rides?: number;
          total_spent?: number;
          status?: 'ACTIF' | 'SUSPENDU';
        };
      };
      drivers: {
        Row: {
          id: string;
          first_name: string;
          last_name: string;
          phone: string;
          email: string;
          avatar: string;
          vehicle_type_id: string | null;
          vehicle_brand: string;
          vehicle_color: string;
          vehicle_plate: string;
          license_number: string;
          id_card_number: string;
          total_rides: number;
          rating: number;
          status: 'EN_ATTENTE' | 'APPROUVÉ' | 'REFUSÉ' | 'SUSPENDU';
          is_online: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          first_name: string;
          last_name: string;
          phone: string;
          email: string;
          avatar?: string;
          vehicle_type_id?: string | null;
          vehicle_brand?: string;
          vehicle_color?: string;
          vehicle_plate: string;
          license_number: string;
          id_card_number: string;
          total_rides?: number;
          rating?: number;
          status?: 'EN_ATTENTE' | 'APPROUVÉ' | 'REFUSÉ' | 'SUSPENDU';
          is_online?: boolean;
        };
        Update: {
          first_name?: string;
          last_name?: string;
          phone?: string;
          email?: string;
          avatar?: string;
          vehicle_type_id?: string | null;
          vehicle_brand?: string;
          vehicle_color?: string;
          vehicle_plate?: string;
          status?: 'EN_ATTENTE' | 'APPROUVÉ' | 'REFUSÉ' | 'SUSPENDU';
          is_online?: boolean;
        };
      };
      rides: {
        Row: {
          id: string;
          reference: string;
          client_id: string;
          driver_id: string | null;
          vehicle_type_id: string;
          client_name: string;
          client_phone: string;
          driver_name: string | null;
          driver_phone: string | null;
          departure: string;
          destination: string;
          distance: number;
          duration: number;
          price: number;
          payment_method: 'CASH' | 'MOBILE_MONEY';
          status: 'EN_ATTENTE' | 'CHAUFFEUR_ASSIGNÉ' | 'CHAUFFEUR_EN_ROUTE' | 'ARRIVÉ' | 'COURSE_EN_COURS' | 'TERMINÉE' | 'ANNULÉE';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          reference: string;
          client_id: string;
          driver_id?: string | null;
          vehicle_type_id: string;
          client_name: string;
          client_phone: string;
          driver_name?: string | null;
          driver_phone?: string | null;
          departure: string;
          destination: string;
          distance?: number;
          duration?: number;
          price: number;
          payment_method?: 'CASH' | 'MOBILE_MONEY';
          status?: 'EN_ATTENTE' | 'CHAUFFEUR_ASSIGNÉ' | 'CHAUFFEUR_EN_ROUTE' | 'ARRIVÉ' | 'COURSE_EN_COURS' | 'TERMINÉE' | 'ANNULÉE';
        };
        Update: {
          driver_id?: string | null;
          driver_name?: string | null;
          driver_phone?: string | null;
          status?: 'EN_ATTENTE' | 'CHAUFFEUR_ASSIGNÉ' | 'CHAUFFEUR_EN_ROUTE' | 'ARRIVÉ' | 'COURSE_EN_COURS' | 'TERMINÉE' | 'ANNULÉE';
        };
      };
      payments: {
        Row: {
          id: string;
          reference: string;
          ride_id: string;
          client_id: string;
          driver_id: string;
          client_name: string;
          driver_name: string;
          amount: number;
          method: 'CASH' | 'MOBILE_MONEY';
          status: 'PAYÉ' | 'EN_ATTENTE';
          created_at: string;
        };
        Insert: {
          id?: string;
          reference: string;
          ride_id: string;
          client_id: string;
          driver_id: string;
          client_name: string;
          driver_name: string;
          amount: number;
          method?: 'CASH' | 'MOBILE_MONEY';
          status?: 'PAYÉ' | 'EN_ATTENTE';
        };
        Update: {
          status?: 'PAYÉ' | 'EN_ATTENTE';
        };
      };
      pricing_config: {
        Row: {
          id: string;
          default_minimum_price: number;
          base_charge: number;
          platform_commission: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          default_minimum_price?: number;
          base_charge?: number;
          platform_commission?: number;
        };
        Update: {
          default_minimum_price?: number;
          base_charge?: number;
          platform_commission?: number;
        };
      };
      app_settings: {
        Row: {
          id: string;
          platform_name: string;
          currency: string;
          sms_enabled: boolean;
          email_enabled: boolean;
          session_duration: number;
          two_factor_auth: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          platform_name?: string;
          currency?: string;
          sms_enabled?: boolean;
          email_enabled?: boolean;
          session_duration?: number;
          two_factor_auth?: boolean;
        };
        Update: {
          platform_name?: string;
          currency?: string;
          sms_enabled?: boolean;
          email_enabled?: boolean;
          session_duration?: number;
          two_factor_auth?: boolean;
        };
      };
    };
  };
};

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
