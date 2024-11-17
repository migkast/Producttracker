import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Laptop, Smartphone, Watch } from "lucide-react";

export default function Home() {
  const featuredCategories = [
    {
      title: "Electronics",
      icon: Laptop,
      description: "Track prices for laptops, smartphones, and more",
      link: "/categories/electronics",
    },
    {
      title: "Mobile",
      icon: Smartphone,
      description: "Find the best deals on phones and accessories",
      link: "/categories/mobile",
    },
    {
      title: "Wearables",
      icon: Watch,
      description: "Compare prices for smartwatches and fitness trackers",
      link: "/categories/wearables",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="text-center py-16 px-4">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Never Overpay Again
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Track prices across multiple retailers, get alerts for price drops, and find the best deals on your favorite products.
        </p>
        <div className="flex justify-center gap-4">
          <Link href="/signup">
            <Button size="lg">Get Started</Button>
          </Link>
          <Link href="/how-it-works">
            <Button variant="outline" size="lg">
              Learn More
            </Button>
          </Link>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-16">
        <h2 className="text-3xl font-bold text-center mb-12">
          Popular Categories
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredCategories.map((category) => (
            <Link href={category.link} key={category.title}>
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <category.icon className="h-6 w-6" />
                    {category.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    {category.description}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <h2 className="text-3xl font-bold text-center mb-12">
          Why Choose PriceWatch?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Price Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Monitor prices across multiple retailers in real-time
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Price Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Get notified when prices drop on your watched items
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Price History</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                View historical price trends and make informed decisions
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Deal Finder</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Discover the best deals across all supported retailers
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-primary-foreground rounded-lg p-8 text-center mt-16">
        <h2 className="text-3xl font-bold mb-4">
          Ready to Start Saving?
        </h2>
        <p className="text-lg mb-8 max-w-2xl mx-auto">
          Join thousands of smart shoppers who save money every day with PriceWatch.
        </p>
        <Link href="/signup">
          <Button size="lg" variant="secondary">
            Start Tracking Prices
          </Button>
        </Link>
      </section>
    </div>
  );
}