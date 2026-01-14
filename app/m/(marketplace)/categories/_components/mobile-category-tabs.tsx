"use client";
import { useRouter, usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface Category {
  name: string;
  link: string;
  value: string;
  id: string;
}

interface MobileCategoryTabsProps {
  categories: Category[];
  nameParam: string | null;
}

export default function MobileCategoryTabs({
  categories,
  nameParam,
}: MobileCategoryTabsProps) {
  const router = useRouter();
  const pathname = usePathname();

  // Active link detection
  const isTabActive = (link: string) => {
    const baseLink = link.split("?")[0];
    const currentPath = pathname;

    // For specific category routes (e.g., /m/categories/food)
    if (
      baseLink.startsWith("/m/categories/") &&
      baseLink !== "/m/categories/all"
    ) {
      return currentPath === baseLink || currentPath.startsWith(`${baseLink}/`);
    }

    // For "All" category, match /m/categories/all
    if (baseLink === "/m/categories/all") {
      return currentPath === baseLink;
    }

    // Default exact match
    return currentPath === baseLink;
  };

  const handleTabClick = (category: Category) => {
    if (category.value === "all") {
      // Navigate to all vendors page
      router.push(`/m/categories/all?name=${nameParam}`);
    } else {
      // Navigate to specific category page with name param
      router.push(
        `/m/categories/${category.value}?id=${category.id}&name=${nameParam}`
      );
    }
  };

  return (
    <div className="md:hidden sticky top-0 z-40  backdrop-blur-md w-full px-4 pt-4 pb-2 shadow-sm">
      <div className="relative w-full overflow-x-auto overflow-y-hidden scrollbar-hide">
        <div className="flex gap-8 min-w-max pb-3 justify-between">
          {categories.map((category, index) => {
            const isActive = isTabActive(category.link);
            return (
              <motion.button
                key={category.value}
                onClick={() => handleTabClick(category)}
                className="relative flex-shrink-0"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                  ease: [0.25, 0.1, 0.25, 1],
                }}
                whileTap={{ scale: 0.96 }}
                whileHover={{ scale: 1.02 }}
              >
                <motion.span
                  className={cn(
                    "md:text-base text-sm whitespace-nowrap transition-colors duration-200",
                    isActive
                      ? "text-gray-900 font-medium"
                      : "text-gray-400 font-normal h-1"
                  )}
                  animate={{
                    scale: isActive ? 1.05 : 1,
                    color: isActive ? "#111827" : "#9CA3AF",
                  }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  {category.name}
                </motion.span>

                {/* Active indicator with animation */}
                {isActive && (
                  <motion.div
                    className="absolute -bottom-3 left-0 right-0 h-1 bg-[#0CC990] rounded-full"
                    layoutId="activeTab"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    exit={{ scaleX: 0 }}
                    transition={{
                      type: "spring",
                      stiffness: 400,
                      damping: 35,
                      mass: 0.8,
                    }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Bottom border line */}
      <div className="w-full h-1 bg-gray-200 -mt-1" />
    </div>
  );
}
