import { redirect } from "next/navigation";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PriceChart } from "@/components/price-chart";
import { ProductTable } from "@/components/product-table";
import { BadgesShowcase } from "@/components/badges-showcase";
import { ReferralProgram } from "@/components/referral-program";
import { ProductRecommendations } from "@/components/product-recommendations";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingDown, TrendingUp, Bell, Award } from "lucide-react";

export default async function DashboardPage() {
  const supabase = createServerComponentClient({ cookies });

  // Get user session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Redirect to login if not authenticated
  if (!session?.user) {
    redirect("/login");
  }

  // Fetch user's tracked products
  const { data: userProducts } = await supabase
    .from("user_products")
    .select("*")
    .eq("user_id", session.user.id);

  // Fetch products details
  const { data: products } = await supabase
    .from("products")
    .select("*")
    .in(
      "id",
      (userProducts || []).map((up) => up.product_id)
    );

  // Fetch user stats
  const { data: stats } = await supabase
    .from("user_stats")
    .select("*")
    .eq("user_id", session.user.id)
    .single();

  const userStats = {
    total_savings: stats?.total_savings || 0,
    price_alerts: stats?.active_alerts || 0,
    badges_earned: stats?.badges_earned || 0,
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingDown className="h-5 w-5" />
              Total Savings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">${userStats.total_savings}</p>
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
            <p className="text-3xl font-bold">{userStats.price_alerts}</p>
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
            <p className="text-3xl font-bold">{userStats.badges_earned}</p>
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
            {products && products.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Price History</CardTitle>
                </CardHeader>
                <CardContent>
                  <PriceChart productId={products[0].id} />
                </CardContent>
              </Card>
            )}

            {products && products.length > 0 && (
              <ProductRecommendations productId={products[0].id} />
            )}
          </div>
        </TabsContent>

        <TabsContent value="products">
          <ProductTable
            products={products || []}
            userProducts={userProducts || []}
          />
        </TabsContent>

        <TabsContent value="achievements">
          <div className="space-y-6">
            <BadgesShowcase userId={session.user.id} />
            <ReferralProgram userId={session.user.id} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
