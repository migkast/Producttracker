// Define available categories with correct slugs
const categories = [
  "laptops",
  "smartphones",
  "wearables",
  "tvs",
  "audio",
  "cameras",
  "gaming",
  "pc-accessories"
];

// Add dynamic parameter type checking
export async function generateStaticParams() {
  return categories.map((slug) => ({
    slug,
  }));
}

// Add dynamic = 'force-dynamic' for server-side rendering
export const dynamic = 'force-dynamic';