"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import VendorList from "../_components/vendor-list";
import WidthLayout from "@/components/commons/width-layout";

import MobileCategoryTabs from "../_components/mobile-category-tabs";
import ChangeReceiverDialog from "../_components/change-receiver-dialog";
import { Vendor, VendorService } from "@/service/vendor.service";
import { fetchCategories } from "@/lib/api";

import { Icon } from "@iconify/react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import FeaturedCarouselSkeleton from "../_components/featured-carousel-skeleton";
import FeaturedCarousel from "../_components/featured-carousel";

export default function AllVendorsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [receiverName, setReceiverName] = useState("");
  const [open, setOpen] = useState(false);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAiSoon, setShowAiSoon] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [apiCategories, setApiCategories] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [observerTarget, setObserverTarget] = useState<HTMLDivElement | null>(
    null,
  );

  const nameParam = searchParams.get("name");

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

  // Fetch all vendors
  useEffect(() => {
    const fetchVendors = async () => {
      try {
        setLoading(true);
        const { vendors: vendorsData, pagination } =
          await VendorService.getAllVendors(1);
        setVendors(vendorsData);
        setCurrentPage(pagination.currentPage);
        setTotalPages(pagination.totalPages);
      } catch (error) {
        console.error("Failed to fetch vendors:", error);
        setVendors([]);
      } finally {
        setLoading(false);
      }
    };

    fetchVendors();
  }, []);

  // Load more vendors
  const handleLoadMore = async () => {
    if (loadingMore || currentPage >= totalPages) return;

    try {
      setLoadingMore(true);
      const nextPage = currentPage + 1;
      const { vendors: newVendors, pagination } =
        await VendorService.getAllVendors(nextPage);

      // Only append vendors if we actually got new data
      if (newVendors && newVendors.length > 0) {
        setVendors((prev) => [...prev, ...newVendors]);
      }

      setCurrentPage(pagination.currentPage);
      setTotalPages(pagination.totalPages);
    } catch (error) {
      console.error("Failed to load more vendors:", error);
    } finally {
      setLoadingMore(false);
    }
  };

  // Infinite scroll with Intersection Observer
  useEffect(() => {
    if (!observerTarget) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          !loadingMore &&
          currentPage < totalPages
        ) {
          handleLoadMore();
        }
      },
      { threshold: 0.1, rootMargin: "100px" },
    );

    observer.observe(observerTarget);

    return () => {
      if (observerTarget) {
        observer.unobserve(observerTarget);
      }
    };
  }, [observerTarget, loadingMore, currentPage, totalPages]);

  useEffect(() => {
    if (!nameParam) {
      router.replace("/m");
    }
  }, [nameParam, router]);

  if (!nameParam) {
    return null;
  }

  const displayName = nameParam.charAt(0).toUpperCase() + nameParam.slice(1);

  const handleSubmit = () => {
    if (receiverName.trim().length > 0) {
      router.push(`/m/categories/all?name=${encodeURIComponent(receiverName)}`);
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

  const hasMoreVendors = currentPage < totalPages;

  // Split vendors into featured and regular
  const { featuredVendors, regularVendors } = useMemo(() => {
    if (vendors.length === 0)
      return { featuredVendors: [], regularVendors: [] };
    // Take first 5 for featured
    const featured = vendors.slice(0, Math.min(5, vendors.length));
    // Show ALL vendors in the regular list
    return { featuredVendors: featured, regularVendors: vendors };
  }, [vendors]);

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

      <div className="bg-whit pt-4 px-0 md:p-8 rounded-3xl font-light flex-1 flex flex-col overflow-hidden mb-2">
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
                like? 🥳
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
                  <AnimatePresence mode="wait">
                    {showAiSoon ? (
                      <motion.span
                        key="soon"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="text-xs font-semibold whitespace-nowrap"
                      >
                        Coming soon
                      </motion.span>
                    ) : (
                      <motion.div
                        key="icon"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="flex items-center justify-center flex-1"
                      >
                        <Icon
                          icon="humbleicons:ai"
                          width="20"
                          height="20"
                          className="w-5 h-5 md:w-6 md:h-6 transition-all duration-300 ease-in-out group-hover:rotate-12 group-hover:scale-110"
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
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
          {/* Infinite Scroll Trigger & Status Messages */}
          {!loading && (
            <div className="py-8">
              {hasMoreVendors ? (
                <>
                  {/* Invisible trigger for infinite scroll */}
                  {/* Infinite Scroll Loading Indicator - Skeleton Vendor Cards */}
                  <div ref={setObserverTarget} className="w-full">
                    {loadingMore && (
                      <div className="grid grid-cols-3 gap-2 sm:gap-3 py-4 transition-all">
                        {Array.from({ length: 6 }).map((_, index) => (
                          <motion.div
                            key={`loading-vendor-${index}`}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                          >
                            <div className="flex flex-col gap-1.5">
                              <div className="w-full aspect-square bg-gray-100 rounded-xl sm:rounded-2xl animate-pulse" />
                              <div className="h-3 sm:h-4 bg-gray-100 rounded-md w-3/4 mx-0.5 animate-pulse" />
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              ) : vendors.length > 0 ? (
                <div className="flex flex-col items-center gap-2 text-muted-foreground pb-10">
                  <Icon
                    icon="material-symbols:check-circle-outline"
                    height={32}
                    width={32}
                    className="text-marketplace-primary"
                  />
                  <p className="text-sm font-medium">
                    hoohooo you’ve reach the end 🥰
                  </p>
                </div>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
