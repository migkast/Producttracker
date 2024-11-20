"use client";

import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Product } from "@/types";
import { ArrowDown, Bell, BellOff, ExternalLink } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/components/auth-provider";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isTracking, setIsTracking] = useState(false);
  const [loading, setLoading] = useState(false);

  const priceChange = product.current_price - product.highest_price;
  const priceChangePercentage = (priceChange / product.highest_price) * 100;

  const handleTrackProduct = async () => {
    if (!user) {
      toast({
        title: "Please log in",
        description: "You need to be logged in to track products",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      const response = await fetch("/api/products/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          notify: true,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to track product");
      }

      setIsTracking(true);
      toast({
        title: "Success",
        description: "Product added to your tracking list",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to track product",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="overflow-hidden">
      <div className="relative h-48">
        <Image
          src={product.image_url}
          alt={product.name}
          fill
          className="object-cover"
        />
        {priceChange < 0 && (
          <Badge
            className="absolute top-2 right-2"
            variant="destructive"
          >
            <ArrowDown className="h-4 w-4 mr-1" />
            {Math.abs(priceChangePercentage).toFixed(1)}% OFF
          </Badge>
        )}
      </div>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-semibold">{product.name}</h3>
            <p className="text-sm text-muted-foreground">
              {product.description}
            </p>
          </div>
          <Badge variant="outline">{product.category}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold">
              ${product.current_price}
            </span>
            {product.current_price < product.highest_price && (
              <span className="text-muted-foreground line-through">
                ${product.highest_price}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={handleTrackProduct}
              disabled={loading}
            >
              {isTracking ? (
                <BellOff className="h-4 w-4" />
              ) : (
                <Bell className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
        <div className="flex gap-2">
          <Button className="flex-1" asChild>
            <Link href={`/products/${product.id}`}>View Details</Link>
          </Button>
          <Button variant="outline" size="icon" asChild>
            <a
              href={product.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}