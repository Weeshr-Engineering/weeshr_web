import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardTitle } from "@/components/ui/card";

export function VendorCardSkeleton() {
  return (
    <Card className="overflow-hidden rounded-3xl shadow-sm bg-white border-0">
      {/* Image placeholder */}
      <div className="relative">
        <Skeleton className="w-full h-48 object-cover" />

        {/* Category badge placeholder */}
        <div className="absolute top-3 left-3 bg-white/60 backdrop-blur-sm rounded-2xl px-2 py-1 flex gap-1.5">
          <Skeleton className="w-3 h-3 rounded-full" />
          <Skeleton className="h-3 w-16 rounded-md" />
        </div>
      </div>

      {/* Badges scroll placeholder */}
      <div className="py-2 px- h-4 w-3/4 "></div>

      {/* Content */}
      <div className="p-4 bg-marketplace-foreground pt-2 space-y-4">
        {/* Title */}
        <CardTitle className="text-lg font-normal text-gray-900 capitalize">
          <Skeleton className="h-5 w-32 rounded-md" />
        </CardTitle>

        <div className="flex justify-between items-center">
          <div>
            <Skeleton className="h-3 w-16 mb-1" />
            <Skeleton className="h-4 w-10" />
          </div>

          <div className="flex gap-2">
            <Skeleton className="h-9 w-16 rounded-2xl" />
            <Skeleton className="h-9 w-20 rounded-2xl" />
          </div>
        </div>
      </div>
    </Card>
  );
}
