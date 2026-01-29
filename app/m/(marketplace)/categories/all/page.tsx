"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import VendorList from "../_components/vendor-list";
import { Card } from "@/components/ui/card";
import MobileCategoryTabs from "../_components/mobile-category-tabs";
import ChangeReceiverDialog from "../_components/change-receiver-dialog";
import { Vendor, VendorService } from "@/service/vendor.service";
import { fetchCategories } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import FeaturedCarouselSkeleton from "../_components/featured-carousel-skeleton";
import FeaturedCarousel from "../_components/featured-carousel";

export default function AllVendorsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [receiverName, setReceiverName] = useState("");
  const [open, setOpen] = useState(false);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
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
            subtitle="Featured vendors for you"
          />
        </div>
      ) : null}

      {/* Category title */}
      <div className="text-left text-2xl md:text-4xl p-4 md:p-6 capitalize shrink-0">
        All Vendors
      </div>

      <div className="bg-white p-4 md:p-8 rounded-3xl font-light flex-1 flex flex-col overflow-hidden mb-2">
        <div className="shrink-0 py-2">
          <ChangeReceiverDialog
            open={open}
            setOpen={setOpen}
            receiverName={receiverName}
            setReceiverName={setReceiverName}
            handleSubmit={handleSubmit}
          />

          {/* Main question */}
          <div className="mt-2 flex items-center gap-3">
            <span className="text-primary text-2xl md:text-4xl leading-tight">
              What would{" "}
              <span className="relative inline-block px-1">
                <span
                  className="relative z-10 bg-gradient-custom bg-clip-text text-transparent font-medium"
                  style={{
                    fontFamily:
                      "var(--font-playwrite), 'Playwrite CU', cursive, sans-serif",
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
              like?
            </span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto mt-4 md:mt-0 px-2 md:px-0 scrollbar-hide">
          <VendorList vendors={regularVendors} loading={loading} />

          {/* Infinite Scroll Trigger & Status Messages */}
          {!loading && (
            <div className="py-8">
              {hasMoreVendors ? (
                <>
                  {/* Invisible trigger for infinite scroll */}
                  {/* Infinite Scroll Loading Indicator - Skeleton Vendor Cards */}
                  <div ref={setObserverTarget} className="w-full">
                    {loadingMore && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 py-6 transition-all">
                        {Array.from({ length: 4 }).map((_, index) => (
                          <motion.div
                            key={`loading-vendor-${index}`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                          >
                            <Card className="overflow-hidden rounded-3xl border border-gray-100 bg-white">
                              {/* Image Skeleton */}
                              <div className="h-48 bg-gray-100 animate-pulse relative">
                                <div className="absolute top-3 left-3 bg-white/60 w-24 h-6 rounded-full" />
                              </div>
                              {/* Content Skeleton */}
                              <div className="p-5 space-y-4">
                                <div className="h-5 bg-gray-100 rounded w-3/4 animate-pulse" />
                                <div className="flex justify-between items-end gap-2">
                                  <div className="flex-1 space-y-2">
                                    <div className="h-3 bg-gray-100 rounded w-16 animate-pulse" />
                                    <div className="h-4 bg-gray-100 rounded w-full animate-pulse" />
                                  </div>
                                  <div className="flex gap-2">
                                    <div className="h-9 w-16 bg-gray-100 rounded-2xl animate-pulse" />
                                    <div className="h-9 w-24 bg-gray-100 rounded-2xl animate-pulse" />
                                  </div>
                                </div>
                              </div>
                            </Card>
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
