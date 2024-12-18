"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { Users, Copy, Gift } from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { Database } from "@/lib/db-types";

type Profile = Database['public']['Tables']['profiles']['Row'];
type UserStats = Database['public']['Tables']['user_stats']['Row'];

interface ReferralProgramProps {
  userId: string;
}

export function ReferralProgram({ userId }: ReferralProgramProps) {
  const { toast } = useToast();
  const [referralCode, setReferralCode] = useState("");
  const [referralCount, setReferralCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchReferralData() {
      try {
        const { data: stats } = await supabase
          .from('user_stats')
          .select('successful_referrals')
          .eq('user_id', userId)
          .single();

        const { data: profile } = await supabase
          .from('profiles')
          .select('referral_code')
          .eq('id', userId)
          .single();

        if (stats && profile) {
          setReferralCode(profile.referral_code);
          setReferralCount(stats.successful_referrals);
        }
      } catch (error) {
        console.error("Error fetching referral data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchReferralData();
  }, [userId]);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(referralCode);
    toast({
      title: "Referral code copied",
      description: "Share this code with your friends to earn rewards!",
    });
  };

  if (loading) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Referral Program
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 mb-2">
              <Gift className="h-5 w-5 text-primary" />
              <span className="font-medium">Earn Premium Features</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Get 1 month of Premium for every friend who signs up using your
              referral code
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Input
                value={referralCode}
                readOnly
                className="text-center font-mono"
              />
            </div>
            <Button variant="outline" size="icon" onClick={handleCopyCode}>
              <Copy className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex justify-center">
            <Badge variant="secondary" className="text-lg">
              {referralCount} Successful Referrals
            </Badge>
          </div>

          <div className="text-center text-sm text-muted-foreground">
            Share your referral code with friends and earn rewards when they sign
            up!
          </div>
        </div>
      </CardContent>
    </Card>
  );
}