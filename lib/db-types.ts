import { Json } from './utils';

export interface Database {
  public: {
    Tables: {
      products: {
        Row: {
          id: string;
          name: string;
          description: string;
          image_url: string;
          category: string;
          current_price: number;
          lowest_price: number;
          highest_price: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description: string;
          image_url: string;
          category: string;
          current_price: number;
          lowest_price: number;
          highest_price: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          image_url?: string;
          category?: string;
          current_price?: number;
          lowest_price?: number;
          highest_price?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      price_history: {
        Row: {
          id: string;
          product_id: string;
          price: number;
          retailer: string;
          timestamp: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          price: number;
          retailer: string;
          timestamp?: string;
        };
        Update: {
          id?: string;
          product_id?: string;
          price?: number;
          retailer?: string;
          timestamp?: string;
        };
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          product_id: string;
          message: string;
          read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          product_id: string;
          message: string;
          read?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          product_id?: string;
          message?: string;
          read?: boolean;
          created_at?: string;
        };
      };
      user_badges: {
        Row: {
          id: string;
          user_id: string;
          badge_id: string;
          awarded_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          badge_id: string;
          awarded_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          badge_id?: string;
          awarded_at?: string;
        };
      };
      user_products: {
        Row: {
          id: string;
          user_id: string;
          product_id: string;
          target_price: number;
          notify_on_price_drop: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          product_id: string;
          target_price: number;
          notify_on_price_drop?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          product_id?: string;
          target_price?: number;
          notify_on_price_drop?: boolean;
          created_at?: string;
        };
      };
      user_stats: {
        Row: {
          id: string;
          user_id: string;
          tracked_products: number;
          successful_referrals: number;
          total_savings: number;
          badges_earned: number;
          active_alerts: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          tracked_products?: number;
          successful_referrals?: number;
          total_savings?: number;
          badges_earned?: number;
          active_alerts?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          tracked_products?: number;
          successful_referrals?: number;
          total_savings?: number;
          badges_earned?: number;
          active_alerts?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      profiles: {
        Row: {
          id: string;
          is_premium: boolean;
          stripe_customer_id: string | null;
          subscription_id: string | null;
          subscription_status: string | null;
          referral_code: string;
          referred_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          is_premium?: boolean;
          stripe_customer_id?: string | null;
          subscription_id?: string | null;
          subscription_status?: string | null;
          referral_code?: string;
          referred_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          is_premium?: boolean;
          stripe_customer_id?: string | null;
          subscription_id?: string | null;
          subscription_status?: string | null;
          referral_code?: string;
          referred_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {};
    Functions: {};
    Enums: {};
  };
}