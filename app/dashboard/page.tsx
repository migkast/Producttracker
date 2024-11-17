"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth-provider";
import { Product, UserProduct } from "@/types";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PriceChart } from "@/components/price-chart";
import { ProductTable } from "@/components/product-table";
import { BadgesShowcase } from "@/components/badges-showcase";
import { ReferralProgram } from "@/components/referral-program";
import { ProductRecommendations } from "@/components/product-recommendations";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import {
  TrendingDown,
  TrendingUp,
  Bell,
  DollarSign,
  Award,
} from "lucide-react";

export default function DashboardPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [trackedProducts, setTrackedProducts] = useState<Product[]>([]);
  const [userProducts, setUserProducts] = useState<UserProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total_savings: 0,
    price_alerts: 0,
    badges_earned: 0,
  });

  useEffect(() => {
    if (user) {
      fetchTrackedProducts();
      fetchUserStats();
    }
  }, [user]);

  async function fetchTrackedProducts() {
    try {
      const { data: userProductsData, error: userProductsError } = await supabase
        .from("user_products")
        .select("*")
        .eq("user_id", user?.id);

      if (userProductsError) throw userProductsError;

      if (userProductsData) {
        setUserProducts(userProductsData);

        const productIds = userProductsData.map((up) => up.product_id);
        const { data: productsData, error: productsError } = await supabase
          .from("products")
          .select("*")
          .in("id", productIds);

        if (productsError) throw productsError;

        if (productsData) {
          setTrackedProducts(productsData);
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch tracked products",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  async function fetchUserStats() {
    try {
      const { data, error } = await supabase
        .from("user_stats")
        .select("*")
        .eq("user_id", user?.id)
        .single();

      if (error) throw error;

      if (data) {
        setStats({
          total_savings: data.total_savings,
          price_alerts: data.active_alerts,
          badges_earned: data.badges_earned,
        });
      }
    } catch (error) {
      console.error("Error fetching user stats:", error);
    }
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="py-8">
            <p className="text-center">Please log in to view your dashboard.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Total Savings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">${stats.total_savings}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Active Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.price_alerts}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Badges Earned
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.badges_earned}</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-8">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid gap-6">
            {trackedProducts.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Price History</CardTitle>
                </CardHeader>
                <CardContent>
                  <PriceChart productId={trackedProducts[0].id} />
                </CardContent>
              </Card>
            )}

            <ProductRecommendations
              productId={trackedProducts[0]?.id}
            />
          </div>
        </TabsContent>

        <TabsContent value="products">
          <ProductTable
            products={trackedProducts}
            userProducts={userProducts}
          />
        </TabsContent>

        <TabsContent value="achievements">
          <div className="space-y-6">
            <BadgesShowcase />
            <ReferralProgram />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}