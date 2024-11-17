export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      products: {
        Row: {
          id: string
          name: string
          description: string
          image_url: string
          category: string
          current_price: number
          lowest_price: number
          highest_price: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          image_url: string
          category: string
          current_price: number
          lowest_price: number
          highest_price: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          image_url?: string
          category?: string
          current_price?: number
          lowest_price?: number
          highest_price?: number
          created_at?: string
          updated_at?: string
        }
      }
      price_history: {
        Row: {
          id: string
          product_id: string
          price: number
          retailer: string
          timestamp: string
        }
        Insert: {
          id?: string
          product_id: string
          price: number
          retailer: string
          timestamp?: string
        }
        Update: {
          id?: string
          product_id?: string
          price?: number
          retailer?: string
          timestamp?: string
        }
      }
      retailers: {
        Row: {
          id: string
          name: string
          url: string
          logo_url: string
        }
        Insert: {
          id?: string
          name: string
          url: string
          logo_url: string
        }
        Update: {
          id?: string
          name?: string
          url?: string
          logo_url?: string
        }
      }
      user_products: {
        Row: {
          id: string
          user_id: string
          product_id: string
          target_price: number
          notify_on_price_drop: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          product_id: string
          target_price: number
          notify_on_price_drop?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          product_id?: string
          target_price?: number
          notify_on_price_drop?: boolean
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}