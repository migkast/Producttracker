export interface Database {
  public: {
    Tables: {
      products: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          image_url: string;
          url: string;
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
          description?: string | null;
          image_url: string;
          url: string;
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
          description?: string | null;
          image_url?: string;
          url?: string;
          category?: string;
          current_price?: number;
          lowest_price?: number;
          highest_price?: number;
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
    };
  };
}
