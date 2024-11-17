"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Trophy } from "lucide-react";
import { badges } from "@/lib/gamification";
import { useAuth } from "@/components/auth-provider";
import { supabase } from "@/lib/supabase";

export function BadgesShowcase() {
  const { user } = useAuth();
  const [userBadges, setUserBadges] = useState<string[]>([]);
  const [stats, setStats] = useState({
    tracked_products: 0,
    successful_referrals: 0,
    total_savings: 0,
  });

  useEffect(() => {
    if (user) {
      fetchUserBadges();
      fetchUserStats();
    }
  }, [user]);

  async function fetchUserBadges() {
    const { data } = await supabase
      .from("user_badges")
      .select("badge_id")
      .eq("user_id", user?.id);

    if (data) {
      setUserBadges(data.map((ub) => ub.badge_id));
    }
  }

  async function fetchUserStats() {
    const { data } = await supabase
      .from("user_stats")
      .select("*")
      .eq("user_id", user?.id)
      .single();

    if (data) {
      setStats(data);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5" />
          Achievements
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {badges.map((badge) => {
            const isEarned = userBadges.includes(badge.id);
            let progress = 0;

            switch (badge.requirement.type) {
              case "products":
                progress = (stats.tracked_products / badge.requirement.count) * 100;
                break;
              case "referrals":
                progress =
                  (stats.successful_referrals / badge.requirement.count) * 100;
                break;
              case "savings":
                progress = (stats.total_savings / badge.requirement.count) * 100;
                break;
            }

            return (
              <div
                key={badge.id}
                className={`p-4 rounded-lg border ${
                  isEarned
                    ? "bg-primary/5 border-primary"
                    : "bg-muted border-muted-foreground/20"
                }`}
              >
                <div className="text-center mb-2">
                  <span className="text-2xl">{badge.icon}</span>
                  <h3 className="font-medium mt-1">{badge.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {badge.description}
                  </p>
                </div>
                <div className="mt-4">
                  <Progress value={Math.min(progress, 100)} className="h-2" />
                  <p className="text-xs text-center mt-1 text-muted-foreground">
                    {Math.round(progress)}% Complete
                  </p>
                </div>
                {isEarned && (
                  <Badge className="w-full mt-2" variant="outline">
                    Earned
                  </Badge>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}