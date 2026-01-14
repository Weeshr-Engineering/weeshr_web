"use client";

import { useSearchParams, useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import WidthLayout from "@/components/commons/width-layout";
import VendorList from "../_components/vendor-list";
import MobileCategoryTabs from "../_components/mobile-category-tabs";
import ChangeReceiverDialog from "../_components/change-receiver-dialog";
import { Vendor, VendorService } from "@/service/vendor.service";
import { fetchCategories } from "@/lib/api";
import { useMemo } from "react";
import FeaturedCarousel from "../_components/featured-carousel";
import FeaturedCarouselSkeleton from "../_components/featured-carousel-skeleton";

// Define category labels with normalization for plural/singular
const categoryLabels: Record<string, string> = {
  food: "Restaurant Options",
  fashion: "Fashion Stores",
  gadgets: "Gadget Stores",
  gadget: "Gadget Stores",
  lifestyle: "Lifestyle Stores",
  lifestyles: "Lifestyle Stores",
  default: "Store Options",
};

export default function Page() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const params = useParams();

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

  const categoryLabel =
    categoryLabels[categoryName as string] || categoryLabels.default;

  // Fetch vendors
  useEffect(() => {
    const fetchVendors = async () => {
      if (!categoryId) {
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

  // Split vendors into featured and regular
  const { featuredVendors, regularVendors } = useMemo(() => {
    if (vendors.length === 0)
      return { featuredVendors: [], regularVendors: [] };

    // Select up to 3 for featured (randomly)
    const shuffled = [...vendors].sort(() => 0.5 - Math.random());
    const featured = shuffled.slice(0, Math.min(3, vendors.length));

    // Show ALL vendors in the regular list as per user request
    return {
      featuredVendors: featured,
      regularVendors: vendors, // Use the original full list
    };
  }, [vendors]);

  useEffect(() => {
    if (!nameParam || !categoryId) {
      router.replace("/m");
    }
  }, [nameParam, categoryId, router]);

  if (!nameParam || !categoryId || !categoryName) {
    return null;
  }

  const displayName = nameParam.charAt(0).toUpperCase() + nameParam.slice(1);

  const handleSubmit = () => {
    if (receiverName.trim().length > 0) {
      router.push(
        `/m/categories/${categoryName}?id=${categoryId}&name=${encodeURIComponent(
          receiverName
        )}`
      );
      setOpen(false);
    }
  };

  const tabCategories = [
    { name: "All", link: "/m/categories/all", value: "all", id: "" },
    ...apiCategories.map((cat) => ({
      name: cat.name,
      link: `/m/categories/${cat.name.toLowerCase()}`,
      value: cat.name.toLowerCase(),
      id: cat._id,
    })),
  ];

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Mobile-only Tab Navigation */}
      <div className="shrink-0">
        <MobileCategoryTabs categories={tabCategories} nameParam={nameParam} />
      </div>

      {loading ? (
        <div className="shrink-0 mb-2">
          <FeaturedCarouselSkeleton />
        </div>
      ) : featuredVendors.length > 0 ? (
        <div className="shrink-0 mb-2">
          <FeaturedCarousel
            vendors={featuredVendors}
            title="Top Picks"
            subtitle={`Featured ${categoryName} for you`}
          />
        </div>
      ) : vendors.length > 0 ? (
        <div className="shrink-0 mb-2">
          <FeaturedCarousel
            vendors={vendors.slice(0, 5)}
            title="Top Picks"
            subtitle={`Featured ${categoryName} for you`}
          />
        </div>
      ) : null}

      {/* Category title */}
      <div className="text-left text-2xl md:text-4xl p-4 md:p-6 capitalize shrink-0">
        {categoryName}
      </div>

      <div className="bg-white p-4 rounded-2xl text-[#6A70FF] font-light px-2 md:px-6 flex-1 flex flex-col overflow-hidden mb-2">
        <div className="shrink-0 pl-4 py-2">
          <ChangeReceiverDialog
            open={open}
            setOpen={setOpen}
            receiverName={receiverName}
            setReceiverName={setReceiverName}
            handleSubmit={handleSubmit}
          />

          {/* Main question */}
          <div className="mt-2">
            <span className="inline-block text-primary text-2xl md:text-4xl leading-snug">
              What would{" "}
              <span className="relative whitespace-nowrap text-blue-600 pr-1">
                <span
                  className="relative whitespace-nowrap bg-gradient-custom bg-clip-text text-transparent text-2xl md:text-3xl font-medium "
                  style={{
                    fontFamily:
                      "var(--font-playwrite), 'Playwrite CU', cursive, sans-serif",
                  }}
                >
                  {displayName}
                </span>
              </span>
              <span className="inline-block pl-1">like?</span>
            </span>
          </div>

          {/* Category description */}
          <div className="text-muted-foreground pt-4 text-sm md:text-base">
            {categoryLabel}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto mt-4 md:mt-0 px-2 md:px-0 scrollbar-hide">
          <VendorList vendors={regularVendors} loading={loading} />
        </div>
      </div>
    </div>
  );
}
