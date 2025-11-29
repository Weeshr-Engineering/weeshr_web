"use client";

import {
  useSearchParams,
  useRouter,
  useParams,
  usePathname,
} from "next/navigation";
import { useEffect, useState } from "react";
import WidthLayout from "@/components/commons/width-layout";
import VendorList from "../_components/vendor-list";
import ChangeReceiverDialog from "../_components/change-receiver-dialog";
import { Vendor, VendorService } from "@/service/vendor.service";
import { cn } from "@/lib/utils";
import { fetchCategories } from "@/lib/api";

// Define category labels
const categoryLabels: Record<string, string> = {
  food: "Restaurant Options",
  fashion: "Fashion Stores",
  gadget: "Gadget Stores",
  lifestyle: "Lifestyle Stores",
  default: "Store Options",
};

export default function Page() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const params = useParams(); // Get all params
  const pathname = usePathname(); // Get current pathname for active tab detection

  // Use 'vendor' instead of 'categoryName' to match your folder [vendor]
  const categoryName = params.vendor as string;

  const [receiverName, setReceiverName] = useState("");
  const [open, setOpen] = useState(false);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [apiCategories, setApiCategories] = useState<any[]>([]);

  const nameParam = searchParams.get("name");
  const categoryId = searchParams.get("id");

  // Fetch categories for mobile tabs
  useEffect(() => {
    async function loadCategories() {
      try {
        const data = await fetchCategories();
        setApiCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    }
    loadCategories();
  }, []);

  // Get the display label for the category
  const categoryLabel =
    categoryLabels[categoryName as string] || categoryLabels.default;

  // Fetch vendors when categoryId is available
  useEffect(() => {
    const fetchVendors = async () => {
      if (!categoryId) {
        console.error("No category ID found in URL");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const vendorsData = await VendorService.getVendorsByCategory(
          categoryId
        );
        setVendors(vendorsData);
      } catch (error) {
        console.error("Failed to fetch vendors:", error);
        setVendors([]);
      } finally {
        setLoading(false);
      }
    };

    fetchVendors();
  }, [categoryId]);

  // Redirect if no name or category ID
  useEffect(() => {
    if (!nameParam || !categoryId) {
      router.replace("/marketplace");
    }
  }, [nameParam, categoryId, router]);

  // 🚫 Do not render anything if no name or category ID
  if (!nameParam || !categoryId || !categoryName) {
    return null;
  }

  // Capitalize the name
  const displayName = nameParam.charAt(0).toUpperCase() + nameParam.slice(1);

  // Handle submit - preserve category ID when changing receiver
  const handleSubmit = () => {
    if (receiverName.trim().length > 0) {
      router.push(
        `/marketplace/categories/${categoryName}?id=${categoryId}&name=${encodeURIComponent(
          receiverName
        )}`
      );
      setOpen(false);
    }
  };

  // Tab categories configuration - combine "All" with API categories
  const tabCategories = [
    { name: "All", link: "/marketplace/categories", value: "all", id: "" },
    ...apiCategories.map((cat) => ({
      name: cat.name,
      link: `/marketplace/categories/${cat.name.toLowerCase()}`,
      value: cat.name.toLowerCase(),
      id: cat._id,
    })),
  ];

  // Active link detection - same logic as desktop navbar
  const isTabActive = (link: string) => {
    const baseLink = link.split("?")[0]; // Remove query params for comparison
    const currentPath = pathname;

    // For specific category routes (e.g., /marketplace/categories/food)
    if (
      baseLink.startsWith("/marketplace/categories/") &&
      baseLink !== "/marketplace/categories"
    ) {
      return currentPath === baseLink || currentPath.startsWith(`${baseLink}/`);
    }

    // For "All" category, only match exact path (not subroutes)
    if (baseLink === "/marketplace/categories") {
      return currentPath === baseLink;
    }

    // Default exact match
    return currentPath === baseLink;
  };

  const handleTabClick = (category: {
    name: string;
    link: string;
    value: string;
    id: string;
  }) => {
    if (category.value === "all") {
      // Navigate to main marketplace categories page
      router.push(`/marketplace/categories?name=${nameParam}`);
    } else {
      // Navigate to specific category page with name param
      router.push(
        `/marketplace/categories/${category.value}?id=${category.id}&name=${nameParam}`
      );
    }
  };

  return (
    <div className="flex flex-col">
      {/* Mobile-only Tab Navigation */}
      <div className="md:hidden w-full overflow-x-auto px-4 pt-4 pb-2">
        <div className="flex gap-8 min-w-max justify-between">
          {tabCategories.map((category) => {
            const isActive = isTabActive(category.link);

            return (
              <button
                key={category.value}
                onClick={() => handleTabClick(category)}
                className="relative pb-3 transition-colors duration-200"
              >
                <span
                  className={cn(
                    "text-base transition-colors duration-200",
                    isActive
                      ? "text-gray-900 font-medium"
                      : "text-gray-400 font-normal"
                  )}
                >
                  {category.name}
                </span>

                {/* Active indicator */}
                {isActive && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-full" />
                )}
              </button>
            );
          })}
        </div>
        {/* Bottom border line */}
        <div className="w-full h-px bg-gray-200 -mt-px" />
      </div>

      {/* Dynamic title based on category */}
      <div className="text-left text-4xl p-4 md:p-6 capitalize">
        {categoryName}
      </div>

      <div className="bg-white p-4 rounded-2xl text-[#6A70FF] font-light px-6 min-h-screen">
        <div className="pl-4">
          <ChangeReceiverDialog
            open={open}
            setOpen={setOpen}
            receiverName={receiverName}
            setReceiverName={setReceiverName}
            handleSubmit={handleSubmit}
          />

          <div>
            <span className="inline-block text-primary text-4xl">
              What would{" "}
              <span className="relative whitespace-nowrap text-blue-600 pr-1">
                <span
                  className="relative whitespace-nowrap bg-gradient-custom bg-clip-text text-transparent text-2xl font-medium -ml-1.5"
                  style={{ fontFamily: "Playwrite CU, sans-serif" }}
                >
                  {displayName}
                </span>
              </span>
              <span className="inline-block pl-1"> like?</span>
            </span>
          </div>
        </div>

        {/* Dynamic label based on category */}
        <div className="text-muted-foreground pl-4 pt-6">{categoryLabel}</div>
        <div className="md:max-h-[600px] overflow-y-auto mt-1 pr-2">
          <VendorList vendors={vendors} loading={loading} />
        </div>
      </div>
    </div>
  );
}
