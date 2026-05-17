import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface VendorCardSkeletonProps {
  className?: string;
}

export function VendorCardSkeleton({ className }: VendorCardSkeletonProps) {
  return (
    <Skeleton className={cn("w-full sm:rounded-none rounded-none", className || "aspect-square")} />
  );
}
