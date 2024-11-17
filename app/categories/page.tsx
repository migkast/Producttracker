import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Laptop, Smartphone, Watch, Tv, Headphones, Camera, Speaker, Keyboard, Mouse, Gamepad } from "lucide-react";
import Link from "next/link";

const categories = [
  {
    name: "Laptops",
    slug: "laptops",
    icon: Laptop,
    description: "Track prices for the latest laptops and notebooks",
    productCount: 156,
  },
  {
    name: "Smartphones",
    slug: "smartphones",
    icon: Smartphone,
    description: "Find deals on flagship and budget phones",
    productCount: 243,
  },
  {
    name: "Wearables",
    slug: "wearables",
    icon: Watch,
    description: "Compare smartwatches and fitness trackers",
    productCount: 89,
  },
  {
    name: "TVs",
    slug: "tvs",
    icon: Tv,
    description: "Monitor prices for 4K and Smart TVs",
    productCount: 112,
  },
  {
    name: "Audio",
    slug: "audio",
    icon: Headphones,
    description: "Track headphones, earbuds, and speakers",
    productCount: 178,
  },
  {
    name: "Cameras",
    slug: "cameras",
    icon: Camera,
    description: "Find deals on cameras and accessories",
    productCount: 94,
  },
  {
    name: "Gaming",
    slug: "gaming",
    icon: Gamepad,
    description: "Track gaming consoles and accessories",
    productCount: 145,
  },
  {
    name: "PC Accessories",
    slug: "pc-accessories",
    icon: Mouse,
    description: "Monitor prices for keyboards, mice, and more",
    productCount: 267,
  },
];

export default function CategoriesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Categories</h1>
        <div className="flex gap-2">
          <Badge variant="secondary">8 Categories</Badge>
          <Badge variant="secondary">1,284 Products</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((category) => (
          <Link href={`/categories/${category.slug}`} key={category.slug}>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <category.icon className="h-8 w-8" />
                  <Badge variant="outline">{category.productCount}</Badge>
                </div>
                <CardTitle className="text-xl">{category.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{category.description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}