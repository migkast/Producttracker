export interface Product {
  id: string;
  name: string;
  description: string;
  image_url: string;
  url: string;
  category: string;
  current_price: number;
  lowest_price: number;
  highest_price: number;
  created_at: string;
  updated_at: string;
}

export interface PriceHistory {
  id: string;
  product_id: string;
  price: number;
  retailer: string;
  timestamp: string;
}

export interface Retailer {
  id: string;
  name: string;
  url: string;
  logo_url: string;
}

export interface UserProduct {
  id: string;
  user_id: string;
  product_id: string;
  target_price: number;
  notify_on_price_drop: boolean;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
}
