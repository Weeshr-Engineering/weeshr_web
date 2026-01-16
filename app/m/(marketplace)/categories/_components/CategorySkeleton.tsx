import { Skeleton } from "@/components/ui/skeleton";
import TiltedCard from "./tilted-card";
import { motion } from "framer-motion";

export default function CategorySkeletonGrid({
  count = 4,
}: {
  count?: number;
}) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 w-full max-w-5xl pt-14 md:pt-10 px-2 sm:px-0">
      {Array.from({ length: count }).map((_, i) => (
        <TiltedCard key={i}>
          <motion.div
            className="rounded-3xl overflow-hidden shadow-[0_8px_20px_-4px_rgba(0,0,0,0.04)] relative h-80 lg:h-[400px] bg-white border border-gray-50"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: i * 0.05 }}
          >
            {/* Full card background skeleton (image placeholder) */}
            <div className="absolute inset-0 w-full h-full bg-gray-50">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
            </div>

            {/* Bottom overlay skeleton mimicking text area */}
            <div className="absolute bottom-0 left-0 right-0 h-24 lg:h-[100px] flex items-center rounded-r-3xl z-20 bg-white p-4">
              <div className="w-full space-y-3">
                <Skeleton className="h-6 w-3/5 rounded-lg bg-gray-100/80" />
                <Skeleton className="h-3 w-1/4 rounded bg-gray-100/60" />
              </div>
            </div>

            {/* Badge placeholder */}
            <div className="absolute top-4 left-4 z-20">
              <Skeleton className="h-7 w-20 rounded-full bg-white/90 border border-gray-50 shadow-sm" />
            </div>
          </motion.div>
        </TiltedCard>
      ))}
    </div>
  );
}
