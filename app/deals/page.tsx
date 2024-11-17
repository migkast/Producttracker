"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ArrowDown, Percent } from "lucide-react";
import Image from "next/image";

// Mock data - In production, this would come from your API
const deals = [
  {
    id: 1,
    name: "MacBook Air M2",
    description: "Latest Apple MacBook Air with M2 chip",
    currentPrice: 999,
    originalPrice: 1199,
    discount: 17,
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800",
    retailer: "Amazon",
    category: "Laptops",
  },
  {
    id: 2,
    name: "Sony WH-1000XM4",
    description: "Wireless Noise Cancelling Headphones",
    currentPrice: 248,
    originalPrice: 349,
    discount: 29,
    image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=800",
    retailer: "Best Buy",
    category: "Audio",
  },
  {
    id: 3,
    name: "Samsung Galaxy S23",
    description: "Latest Samsung flagship smartphone",
    currentPrice: 799,
    originalPrice: 999,
    discount: 20,
    image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800",
    retailer: "Samsung",
    category: "Smartphones",
  },
  // Add more deals as needed
];

const categories = ["All", "Laptops", "Audio", "Smartphones", "Gaming", "TVs"];
const retailers = ["All", "Amazon", "Best Buy", "Samsung", "Apple", "Walmart"];
const sortOptions = ["Highest Discount", "Lowest Price", "Highest Price"];

export default function DealsPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedRetailer, setSelectedRetailer] = useState("All");
  const [sortBy, setSortBy] = useState("Highest Discount");

  const filteredDeals = deals.filter((deal) => {
    if (selectedCategory !== "All" && deal.category !== selectedCategory) {
      return false;
    }
    if (selectedRetailer !== "All" && deal.retailer !== selectedRetailer) {
      return false;
    }
    return true;
  });

  const sortedDeals = [...filteredDeals].sort((a, b) => {
    switch (sortBy) {
      case "Highest Discount":
        return b.discount - a.discount;
      case "Lowest Price":
        return a.currentPrice - b.currentPrice;
      case "Highest Price":
        return b.currentPrice - a.currentPrice;
      default:
        return 0;
    }
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Today's Best Deals</h1>
        <Badge variant="secondary" className="text-lg">
          {filteredDeals.length} Deals
        </Badge>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <Select
          value={selectedCategory}
          onValueChange={setSelectedCategory}
        >
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={selectedRetailer}
          onValueChange={setSelectedRetailer}
        >
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="Retailer" />
          </SelectTrigger>
          <SelectContent>
            {retailers.map((retailer) => (
              <SelectItem key={retailer} value={retailer}>
                {retailer}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedDeals.map((deal) => (
          <Card key={deal.id} className="overflow-hidden">
            <div className="relative h-48">
              <Image
                src={deal.image}
                alt={deal.name}
                fill
                className="object-cover"
              />
              <Badge
                className="absolute top-2 right-2"
                variant="destructive"
              >
                <Percent className="h-4 w-4 mr-1" />
                {deal.discount}% OFF
              </Badge>
            </div>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl">{deal.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {deal.description}
                  </p>
                </div>
                <Badge variant="outline">{deal.retailer}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold">
                    ${deal.currentPrice}
                  </span>
                  <span className="text-muted-foreground line-through">
                    ${deal.originalPrice}
                  </span>
                </div>
                <div className="flex items-center text-green-500">
                  <ArrowDown className="h-4 w-4 mr-1" />
                  ${deal.originalPrice - deal.currentPrice} off
                </div>
              </div>
              <Button className="w-full">View Deal</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}