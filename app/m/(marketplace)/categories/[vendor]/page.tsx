"use client";

import { useSearchParams, useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@iconify/react";
import { cn } from "@/lib/utils";

import WidthLayout from "@/components/commons/width-layout";
import VendorList from "../_components/vendor-list";
import MobileCategoryTabs from "../_components/mobile-category-tabs";
import ChangeReceiverDialog from "../_components/change-receiver-dialog";
import { Vendor, VendorService } from "@/service/vendor.service";
import { fetchCategories } from "@/lib/api";
import { useMemo } from "react";

// Define category mapping if needed for future use

export default function Page() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const params = useParams();

  const categoryName = params.vendor as string;

  const [receiverName, setReceiverName] = useState("");
  const [open, setOpen] = useState(false);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAiSoon, setShowAiSoon] = useState(false);
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

  // Fetch vendors
  useEffect(() => {
    const fetchVendors = async () => {
      if (!categoryId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const vendorsData =
          await VendorService.getVendorsByCategory(categoryId);
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
          receiverName,
        )}`,
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
        <WidthLayout className="flex-none !pt-0 w-full">
          <MobileCategoryTabs
            categories={tabCategories}
            nameParam={nameParam}
          />
        </WidthLayout>
      </div>

      <div className="bg-white pt-4 px-0 md:p-8 rounded-3xl font-light flex-1 flex flex-col overflow-hidden mb-2">
        <div className="shrink-0 py-2">
          <WidthLayout className="flex-none !pt-0 w-full px-4">
            <ChangeReceiverDialog
              open={open}
              setOpen={setOpen}
              receiverName={receiverName}
              setReceiverName={setReceiverName}
              handleSubmit={handleSubmit}
            />

            {/* Main question */}
            <div className="mt-2 flex items-center justify-between gap-3">
              <span className="text-primary text-2xl md:text-4xl leading-tight">
                What would{" "}
                <span className="relative inline-flex items-center overflow-visible">
                  <span
                    className="relative z-10 bg-gradient-custom bg-clip-text text-transparent font-medium whitespace-nowrap inline-flex items-center justify-center"
                    style={{
                      fontFamily:
                        "var(--font-playwrite), 'Playwrite CU', cursive, sans-serif",
                      height: "56px",
                      width: `${Math.max(80, (displayName?.length || 0) * 20)}px`,
                    }}
                  >
                    {displayName}
                  </span>
                  <motion.span
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    className="absolute bottom-1 left-0 h-2 bg-[#0CC990]/10 -z-10"
                  />
                </span>{" "}
                like ? 🥳
              </span>

              {/* AI Assistant Button */}
              <div className="relative group">
                <button
                  onClick={() => {
                    setShowAiSoon(true);
                    setTimeout(() => setShowAiSoon(false), 2000);
                  }}
                  className={cn(
                    "flex-shrink-0 bg-[#6A70FF]/20 text-[#6A70FF] h-10 flex items-center justify-center rounded-xl md:h-12 transition-all duration-300 ease-out focus:outline-none shadow-sm hover:shadow-lg hover:shadow-[#6A70FF]/20 hover:-translate-y-1 group-hover:bg-gradient-custom group-hover:text-white px-2",
                    showAiSoon ? "w-max px-4" : "w-10 md:w-12",
                  )}
                >
                  <div className="flex items-center gap-1.5 ">
                    <AnimatePresence mode="wait">
                      {showAiSoon && (
                        <motion.span
                          key="soon-text"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          className="text-[10px] font-bold uppercase tracking-widest whitespace-nowrap px-1"
                        >
                          Ai soon
                        </motion.span>
                      )}
                    </AnimatePresence>
                    <Icon
                      icon="humbleicons:ai"
                      width="18"
                      height="18"
                      className="w-5 h-5 md:w-6 md:h-6 transition-all duration-300 ease-in-out group-hover:rotate-12 group-hover:scale-110"
                    />
                  </div>
                </button>
                {/* Pizzazz Tooltip */}
                <div className="absolute right-0 top-full mt-2 w-max opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 ease-out transform translate-y-2 group-hover:translate-y-0 z-50">
                  <div className="bg-[#1F2937] text-white text-xs font-medium px-3 py-1.5 rounded-lg shadow-xl relative flex items-center gap-1.5">
                    <Icon
                      icon="solar:stars-bold"
                      className="text-[#0CC990] w-3 h-3"
                    />
                    AI Gift Assistant
                    <div className="absolute -top-1 right-5 w-2 h-2 bg-[#1F2937] transform rotate-45"></div>
                  </div>
                </div>
              </div>
            </div>
          </WidthLayout>
        </div>

        <div className="flex-1 overflow-y-auto mt-4 md:mt-0 md:px-0 scrollbar-hide">
          <WidthLayout fullWidthMobile className="!pt-0">
            <VendorList vendors={regularVendors} loading={loading} />
          </WidthLayout>
          {/* End of list indicator */}
          {!loading && vendors.length > 0 && (
            <div className="py-8">
              <div className="flex flex-col items-center gap-2 text-muted-foreground pb-10">
                <Icon
                  icon="material-symbols:check-circle-outline"
                  height={32}
                  width={32}
                  className="text-marketplace-primary"
                />
                <p className="text-sm font-medium">
                  hoohooo you've reach the end 🥰
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
