import { Skeleton } from "@/components/ui/skeleton";
import TiltedCard from "./tilted-card";
import { motion } from "framer-motion"; // Import Framer Motion

export default function CategorySkeletonGrid({
  count = 4, // Keeping count at 4 as requested
}: {
  count?: number;
}) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-5xl pt-14 md:pt-10">
      {Array.from({ length: count }).map((_, i) => (
<TiltedCard key={i} className="pointer-events-none">
          <motion.div
            className="rounded-3xl overflow-hidden shadow-lg relative h-80 lg:h-full bg-muted/40 animate-pulse"
            initial={{ opacity: 0, y: 20 }} // Initial animation state
            animate={{ opacity: 1, y: 0 }} // Animation when mounted
            transition={{ duration: 0.5, delay: i * 0.1 }} // Staggered animation
          >
            {/* Full card background skeleton (image placeholder) */}
            <Skeleton className="absolute inset-0 w-full h-full" />

            {/* Bottom overlay skeleton mimicking text area */}
            <div className="absolute bottom-0 left-0 right-0 h-24 lg:h-[100px] flex items-center rounded-r-3xl z-20 bg-white/60 backdrop-blur-sm">
              <div className="p-4 w-full">
                <Skeleton className="h-6 w-2/5 mb-2" />
                <Skeleton className="h-4 w-1/3" />
              </div>
            </div>
          </motion.div>
        </TiltedCard>
      ))}
    </div>
  );
}
