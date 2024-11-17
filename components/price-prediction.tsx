"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingDown, TrendingUp, AlertCircle } from "lucide-react";

interface PricePredictionProps {
  productId: string;
}

interface Prediction {
  likelihood: number;
  predictedPrice: number | null;
  confidence: 'high' | 'medium' | 'low';
}

export function PricePrediction({ productId }: PricePredictionProps) {
  const [loading, setLoading] = useState(true);
  const [prediction, setPrediction] = useState<Prediction | null>(null);

  useEffect(() => {
    async function fetchPrediction() {
      try {
        const response = await fetch(`/api/recommendations/price-prediction?productId=${productId}`);
        const data = await response.json();
        setPrediction(data);
      } catch (error) {
        console.error('Error fetching prediction:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchPrediction();
  }, [productId]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Price Prediction</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-24 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (!prediction) {
    return null;
  }

  const { likelihood, predictedPrice, confidence } = prediction;
  const isPriceDrop = likelihood > 0.5;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Price Prediction
          <Badge variant={confidence === 'high' ? 'default' : 'secondary'}>
            {confidence} confidence
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4">
          {isPriceDrop ? (
            <TrendingDown className="h-8 w-8 text-green-500" />
          ) : (
            <TrendingUp className="h-8 w-8 text-red-500" />
          )}
          <div>
            <p className="text-lg font-medium">
              {isPriceDrop ? 'Price drop likely' : 'Price stable or may increase'}
            </p>
            {predictedPrice && (
              <p className="text-sm text-muted-foreground">
                Predicted price: ${predictedPrice.toFixed(2)}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-start gap-2 mt-4 p-4 bg-muted rounded-lg">
          <AlertCircle className="h-5 w-5 mt-0.5 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            This prediction is based on historical price trends and market analysis.
            Actual prices may vary.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}