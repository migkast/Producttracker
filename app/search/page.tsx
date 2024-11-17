"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { SearchBar } from "@/components/search-bar";
import { ProductCard } from "@/components/product-card";
import { Product } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        const response = await fetch(`/api/search?${searchParams.toString()}`);
        const data = await response.json();
        setProducts(data.products);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [searchParams]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <SearchBar />
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-2">No products found</h2>
          <p className="text-muted-foreground">
            Try adjusting your search or filters
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}