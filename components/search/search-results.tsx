"use client";

import { useSearchParams } from "next/navigation";
import { ProductCard } from "@/components/product-card";
import { useEffect, useState } from "react";
import { Product } from "@/types";
import { supabase } from "@/lib/supabase";

export function SearchResults() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        
        let query = supabase.from('products').select('*');

        const search = searchParams.get('q');
        const category = searchParams.get('category');
        const minPrice = searchParams.get('minPrice');
        const maxPrice = searchParams.get('maxPrice');
        const sortBy = searchParams.get('sortBy');

        if (search) {
          query = query.ilike('name', `%${search}%`);
        }

        if (category && category !== 'all') {
          query = query.eq('category', category);
        }

        if (minPrice) {
          query = query.gte('current_price', parseFloat(minPrice));
        }

        if (maxPrice) {
          query = query.lte('current_price', parseFloat(maxPrice));
        }

        switch (sortBy) {
          case 'price_asc':
            query = query.order('current_price', { ascending: true });
            break;
          case 'price_desc':
            query = query.order('current_price', { ascending: false });
            break;
          case 'name':
            query = query.order('name');
            break;
          default:
            query = query.order('created_at', { ascending: false });
        }

        const { data, error } = await query;

        if (error) throw error;
        setProducts(data || []);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [searchParams]);

  if (loading) {
    return null;
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-2">No products found</h2>
        <p className="text-muted-foreground">
          Try adjusting your search or filters
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}