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
  Legend,
} from "recharts";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface PriceHistoryChartProps {
  productId: string;
}

interface PricePoint {
  timestamp: string;
  price: number;
  retailer: string;
}

export function PriceHistoryChart({ productId }: PriceHistoryChartProps) {
  const [loading, setLoading] = useState(true);
  const [priceHistory, setPriceHistory] = useState<PricePoint[]>([]);

  useEffect(() => {
    async function fetchPriceHistory() {
      try {
        const response = await fetch(`/api/products/history?productId=${productId}`);
        const { data } = await response.json();
        setPriceHistory(data);
      } catch (error) {
        console.error('Error fetching price history:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchPriceHistory();
  }, [productId]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Price History</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[400px] w-full" />
        </CardContent>
      </Card>
    );
  }

  const chartData = priceHistory.map((point) => ({
    date: format(new Date(point.timestamp), 'MMM d'),
    price: point.price,
    retailer: point.retailer,
  }));

  const retailers = Array.from(new Set(priceHistory.map((p) => p.retailer)));
  const colors = ['#2563eb', '#dc2626', '#16a34a', '#9333ea', '#ea580c'];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Price History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              {retailers.map((retailer, index) => (
                <Line
                  key={retailer}
                  type="monotone"
                  dataKey="price"
                  data={chartData.filter((d) => d.retailer === retailer)}
                  name={retailer}
                  stroke={colors[index % colors.length]}
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}