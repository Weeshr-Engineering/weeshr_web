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
            className="rounded-3xl overflow-hidden shadow-lg relative h-[300px] lg:h-[400px] bg-muted/40"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
          >
            {/* Full card background skeleton (image placeholder) */}
            <Skeleton className="absolute inset-0 w-full h-full animate-pulse" />

            {/* Bottom overlay skeleton mimicking text area */}
            <div className="absolute bottom-0 left-0 right-0 h-20 sm:h-24 lg:h-[100px] flex items-center rounded-r-3xl z-20 bg-white/60 backdrop-blur-sm">
              <div className="p-3 sm:p-4 w-full">
                <Skeleton className="h-5 sm:h-6 w-2/5 mb-2 animate-pulse" />
                <Skeleton className="h-3 sm:h-4 w-1/3 animate-pulse" />
              </div>
            </div>
          </motion.div>
        </TiltedCard>
      ))}
    </div>
  );
}
