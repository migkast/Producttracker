"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { supabase } from "@/lib/supabase";
import { PriceHistory } from "@/types";
import { format } from "date-fns";

interface PriceChartProps {
  productId: string;
}

export function PriceChart({ productId }: PriceChartProps) {
  const [priceHistory, setPriceHistory] = useState<PriceHistory[]>([]);

  useEffect(() => {
    async function fetchPriceHistory() {
      const { data, error } = await supabase
        .from("price_history")
        .select("*")
        .eq("product_id", productId)
        .order("timestamp", { ascending: true });

      if (!error && data) {
        setPriceHistory(data);
      }
    }

    fetchPriceHistory();
  }, [productId]);

  const chartData = priceHistory.map((history) => ({
    date: format(new Date(history.timestamp), "MMM d"),
    price: history.price,
    retailer: history.retailer,
  }));

  return (
    <div className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="price"
            stroke="hsl(var(--primary))"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}