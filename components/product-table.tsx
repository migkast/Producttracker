"use client";

import { useState } from "react";
import Image from "next/image";
import { Product, UserProduct } from "@/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";

interface ProductTableProps {
  products: Product[];
  userProducts: UserProduct[];
}

export function ProductTable({ products, userProducts }: ProductTableProps) {
  const { toast } = useToast();
  const [targetPrices, setTargetPrices] = useState<Record<string, number>>(() => {
    const prices: Record<string, number> = {};
    userProducts.forEach((up) => {
      prices[up.product_id] = up.target_price;
    });
    return prices;
  });

  async function updateTargetPrice(productId: string, targetPrice: number) {
    try {
      const userProduct = userProducts.find((up) => up.product_id === productId);
      if (userProduct) {
        const { error } = await supabase
          .from("user_products")
          .update({ target_price: targetPrice })
          .eq("id", userProduct.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Target price updated successfully",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update target price",
        variant: "destructive",
      });
    }
  }

  async function toggleNotification(productId: string) {
    try {
      const userProduct = userProducts.find((up) => up.product_id === productId);
      if (userProduct) {
        const { error } = await supabase
          .from("user_products")
          .update({ notify_on_price_drop: !userProduct.notify_on_price_drop })
          .eq("id", userProduct.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Notification settings updated successfully",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update notification settings",
        variant: "destructive",
      });
    }
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product</TableHead>
            <TableHead>Current Price</TableHead>
            <TableHead>Lowest Price</TableHead>
            <TableHead>Target Price</TableHead>
            <TableHead>Notifications</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => {
            const userProduct = userProducts.find(
              (up) => up.product_id === product.id
            );
            return (
              <TableRow key={product.id}>
                <TableCell>
                  <div className="flex items-center space-x-4">
                    <div className="relative h-16 w-16">
                      <Image
                        src={product.image_url}
                        alt={product.name}
                        fill
                        className="object-cover rounded-md"
                      />
                    </div>
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {product.category}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>${product.current_price.toFixed(2)}</TableCell>
                <TableCell>${product.lowest_price.toFixed(2)}</TableCell>
                <TableCell>
                  <Input
                    type="number"
                    value={targetPrices[product.id] || ""}
                    onChange={(e) => {
                      const value = parseFloat(e.target.value);
                      setTargetPrices((prev) => ({
                        ...prev,
                        [product.id]: value,
                      }));
                    }}
                    onBlur={() => {
                      if (targetPrices[product.id]) {
                        updateTargetPrice(product.id, targetPrices[product.id]);
                      }
                    }}
                    className="w-24"
                  />
                </TableCell>
                <TableCell>
                  <Switch
                    checked={userProduct?.notify_on_price_drop || false}
                    onCheckedChange={() => toggleNotification(product.id)}
                  />
                </TableCell>
                <TableCell>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}