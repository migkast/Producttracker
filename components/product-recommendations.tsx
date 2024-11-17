"use client";

import { useEffect, useState } from "react";
import { Product } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

interface ProductRecommendationsProps {
  productId: string;
}

export function ProductRecommendations({ productId }: ProductRecommendationsProps) {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function fetchRecommendations() {
      try {
        const response = await fetch(`/api/recommendations/similar?productId=${productId}`);
        const { products } = await response.json();
        setProducts(products);
      } catch (error) {
        console.error('Error fetching recommendations:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchRecommendations();
  }, [productId]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Similar Products</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="h-16 w-16 rounded-md" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Similar Products</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="flex items-center gap-4 p-4 rounded-lg border hover:shadow-md transition-shadow"
            >
              <div className="relative h-16 w-16">
                <Image
                  src={product.image_url}
                  alt={product.name}
                  fill
                  className="object-cover rounded-md"
                />
              </div>
              <div className="flex-1">
                <h3 className="font-medium">{product.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-lg font-bold">
                    ${product.current_price}
                  </span>
                  {product.current_price < product.highest_price && (
                    <Badge variant="secondary">
                      Save ${(product.highest_price - product.current_price).toFixed(2)}
                    </Badge>
                  )}
                </div>
              </div>
              <Button variant="ghost" size="icon">
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}