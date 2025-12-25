"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import VendorList from "../_components/vendor-list";
import MobileCategoryTabs from "../_components/mobile-category-tabs";
import ChangeReceiverDialog from "../_components/change-receiver-dialog";
import { Vendor, VendorService } from "@/service/vendor.service";
import { fetchCategories } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";

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
    null
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
      { threshold: 0.1, rootMargin: "100px" }
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
      router.replace("/marketplace");
    }
  }, [nameParam, router]);

  if (!nameParam) {
    return null;
  }

  const displayName = nameParam.charAt(0).toUpperCase() + nameParam.slice(1);

  const handleSubmit = () => {
    if (receiverName.trim().length > 0) {
      router.push(
        `/marketplace/categories/all?name=${encodeURIComponent(receiverName)}`
      );
      setOpen(false);
    }
  };

  const tabCategories = [
    { name: "All", link: "/marketplace/categories/all", value: "all", id: "" },
    ...apiCategories.map((cat) => ({
      name: cat.name,
      link: `/marketplace/categories/${cat.name.toLowerCase()}`,
      value: cat.name.toLowerCase(),
      id: cat._id,
    })),
  ];

  const hasMoreVendors = currentPage < totalPages;

  return (
    <div className="flex flex-col">
      {/* Mobile-only Tab Navigation */}
      <MobileCategoryTabs categories={tabCategories} nameParam={nameParam} />

      {/* Category title */}
      <div className="text-left text-2xl md:text-4xl p-4 md:p-6 capitalize">
        All Vendors
      </div>

      <div className="bg-white p-4 rounded-2xl text-[#6A70FF] font-light px-2 md:px-6 min-h-screen">
        <div className="pl-4">
          <ChangeReceiverDialog
            open={open}
            setOpen={setOpen}
            receiverName={receiverName}
            setReceiverName={setReceiverName}
            handleSubmit={handleSubmit}
          />

          {/* Main question */}
          <div>
            <span className="inline-block text-primary text-2xl md:text-4xl leading-snug">
              What would{" "}
              <span className="relative whitespace-nowrap text-blue-600 pr-1">
                <span
                  className="relative whitespace-nowrap bg-gradient-custom bg-clip-text text-transparent text-2xl md:text-4xl font-medium "
                  style={{ fontFamily: "Playwrite CU, sans-serif" }}
                >
                  {displayName}
                </span>
              </span>
              <span className="inline-block pl-1">like?</span>
            </span>
          </div>
        </div>

        {/* Category description */}
        <div className="text-muted-foreground pl-4 pt-6 text-sm md:text-base">
          Browse all available vendors
        </div>

        <div className="md:max-h-[600px] overflow-y-auto mt-1 pr-2">
          <VendorList vendors={vendors} loading={loading} />

          {/* Infinite Scroll Trigger & Status Messages */}
          {!loading && (
            <div className="py-8">
              {hasMoreVendors ? (
                <>
                  {/* Invisible trigger for infinite scroll */}
                  <div
                    ref={setObserverTarget}
                    className="flex justify-center items-center"
                  >
                    {loadingMore && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Icon icon="eos-icons:loading" height={24} width={24} />
                        <span className="text-sm">Loading more vendors...</span>
                      </div>
                    )}
                  </div>

                  {/* Optional: Keep button for manual trigger */}
                  {!loadingMore && (
                    <div className="flex justify-center">
                      <Button
                        onClick={handleLoadMore}
                        variant="ghost"
                        className="px-6 py-3 text-sm font-medium rounded-full text-muted-foreground hover:text-marketplace-primary transition-colors"
                      >
                        <Icon
                          icon="material-symbols:expand-more"
                          className="mr-2"
                          height={20}
                          width={20}
                        />
                        Load More
                      </Button>
                    </div>
                  )}
                </>
              ) : vendors.length > 0 ? (
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
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
