import { Suspense } from "react";
import { SearchResults } from "@/components/search/search-results";
import { SearchBar } from "@/components/search/search-bar";
import { Skeleton } from "@/components/ui/skeleton";

// Make this a client-side rendered page
export const dynamic = 'force-dynamic';

export default function SearchPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <SearchBar />
      </div>

      <Suspense 
        fallback={
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-[400px] w-full" />
            ))}
          </div>
        }
      >
        <SearchResults />
      </Suspense>
    </div>
  );
}