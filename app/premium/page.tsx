"use client";

import { useState } from "react";
import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, AlertCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const plans = [
  {
    name: "Free",
    price: 0,
    features: [
      "Track up to 5 products",
      "Basic price alerts",
      "24-hour price updates",
      "Email notifications",
    ],
  },
  {
    name: "Premium",
    price: 9.99,
    features: [
      "Unlimited product tracking",
      "Real-time price alerts",
      "1-hour price updates",
      "Price history analytics",
      "Custom alert rules",
      "Priority support",
      "Ad-free experience",
      "API access",
    ],
    recommended: true,
  },
];

export default function PremiumPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    if (!user) {
      toast({
        title: "Please log in",
        description: "You need to be logged in to subscribe to Premium.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    // TODO: Implement Stripe subscription
    setTimeout(() => {
      toast({
        title: "Coming Soon",
        description: "Premium subscriptions will be available soon!",
      });
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Upgrade to Premium</h1>
          <p className="text-xl text-muted-foreground">
            Get unlimited tracking and advanced features
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={`relative ${
                plan.recommended ? "border-primary shadow-lg" : ""
              }`}
            >
              {plan.recommended && (
                <Badge
                  className="absolute -top-3 left-1/2 -translate-x-1/2"
                  variant="default"
                >
                  Recommended
                </Badge>
              )}
              <CardHeader>
                <CardTitle className="text-2xl text-center mb-2">
                  {plan.name}
                </CardTitle>
                <div className="text-center">
                  <span className="text-4xl font-bold">
                    ${plan.price}
                  </span>
                  {plan.price > 0 && (
                    <span className="text-muted-foreground">/month</span>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <Check className="h-5 w-5 text-green-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
                {plan.price > 0 ? (
                  <Button
                    className="w-full mt-6"
                    onClick={handleSubscribe}
                    disabled={loading}
                  >
                    {loading ? "Processing..." : "Subscribe Now"}
                  </Button>
                ) : (
                  <Button
                    className="w-full mt-6"
                    variant="outline"
                    disabled
                  >
                    Current Plan
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 p-6 bg-muted rounded-lg">
          <div className="flex items-start gap-4">
            <AlertCircle className="h-6 w-6 text-primary mt-1" />
            <div>
              <h3 className="font-semibold mb-2">Money-Back Guarantee</h3>
              <p className="text-muted-foreground">
                Try Premium risk-free for 14 days. If you're not completely
                satisfied, we'll refund your subscription - no questions asked.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}