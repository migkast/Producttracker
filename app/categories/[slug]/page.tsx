import { notFound } from "next/navigation";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { ProductCard } from "@/components/product-card";
import { Badge } from "@/components/ui/badge";
import { AddProductDialog } from "@/components/add-product-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Define available categories
const categories = [
  "laptops",
  "smartphones",
  "wearables",
  "tvs",
  "audio",
  "cameras",
  "gaming",
  "pc-accessories",
];

// Generate static params for all possible category routes
export function generateStaticParams() {
  return categories.map((slug) => ({
    slug,
  }));
}

export default async function CategoryPage({
  params,
}: {
  params: { slug: string };
}) {
  const supabase = createServerComponentClient({ cookies });

  // Validate slug
  if (!categories.includes(params.slug)) {
    return notFound();
  }

  // Fetch products for this category
  const { data: products, error } = await supabase
    .from("products")
    .select("*")
    .eq("category", params.slug)
    .order("current_price", { ascending: true });

  if (error) {
    console.error("Error fetching products:", error);
    return notFound();
  }

  // Get category details
  const category = {
    name: params.slug.charAt(0).toUpperCase() + params.slug.slice(1),
    description: `Browse the best deals on ${params.slug}`,
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">{category.name}</h1>
          <p className="text-muted-foreground">{category.description}</p>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="secondary" className="text-lg">
            {products.length} Products
          </Badge>
          <AddProductDialog />
        </div>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-2">No products found</h2>
          <p className="text-muted-foreground mb-4">
            Be the first to track products in this category
          </p>
          <AddProductDialog />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}