"use client";

import { FloatingNav } from "@/components/commons/floating-navbar";
import Footer from "../../_components/footer";
import HeaderMobile from "@/components/commons/header-mobile";
import WidthLayout from "@/components/commons/width-layout";
import { marketplaceLinks } from "@/lib/constants/navigation-items";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { fetchCategories } from "@/lib/api";
import RedirectGuard from "./_components/redirect-guard";
import { cn } from "@/lib/utils";

// Create a separate component that uses useSearchParams
const LandingLayoutContent = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const segments = pathname.split("/").filter(Boolean);
  const [categories, setCategories] = useState<any[]>([]);
  const [navWithQuery, setNavWithQuery] = useState(marketplaceLinks);
  const [loading, setLoading] = useState(true);

  const nameParam = searchParams.get("name");

  // Fetch categories from API (same as categories page)
  useEffect(() => {
    async function loadCategories() {
      try {
        const data = await fetchCategories();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    }

    loadCategories();
  }, []);

  // Build navigation with dynamic category IDs
  useEffect(() => {
    if (categories.length === 0) return;

    const updatedNav = marketplaceLinks.map((item) => {
      const baseLink = item.link.split("?")[0];

      // For the "All" categories link - just preserve name
      if (baseLink === "/m/categories") {
        return {
          ...item,
          link: nameParam
            ? `${baseLink}?name=${encodeURIComponent(nameParam)}`
            : baseLink,
        };
      }

      if (baseLink.startsWith("/m/categories/")) {
        // Extract category name from the link (e.g., "food" from "/m/categories/food")
        const categoryNameFromLink = baseLink.split("/").pop();

        // Find the matching category from API data
        const category = categories.find(
          (cat: any) =>
            cat.name.toLowerCase() === categoryNameFromLink?.toLowerCase(),
        );

        if (category && nameParam) {
          // Build the exact same URL structure as categories page
          return {
            ...item,
            link: `/m/categories/${category.name.toLowerCase()}?id=${
              category._id
            }&name=${encodeURIComponent(nameParam)}`,
          };
        } else if (nameParam) {
          // Fallback: if category not found but we have name, just preserve name
          return {
            ...item,
            link: `${baseLink}?name=${encodeURIComponent(nameParam)}`,
          };
        } else if (category) {
          // If we have category but no name, just use ID
          return {
            ...item,
            link: `/m/categories/${category.name.toLowerCase()}?id=${
              category._id
            }`,
          };
        }
      }

      return item;
    });

    setNavWithQuery(updatedNav);
  }, [categories, nameParam]);

  // Check if we are on a specific vendor product page (e.g., /m/categories/fashion/vendor-name)
  // These pages should have 4 or more segments
  const isProductPage = segments.length >= 4;

  return (
    <main
      className="relative flex flex-col h-full bg-cover bg-bottom bg-no-repeat
    bg-[url('https://res.cloudinary.com/drykej1am/image/upload/v1757840432/weeshr-marketplace/Desktop_-_20_pleoi7.png')]"
    >
      <WidthLayout className="h-full flex flex-col w-full">
        {!isProductPage && (
          <div className="shrink-0">
            <HeaderMobile customLinks={navWithQuery} />
            <FloatingNav navItems={navWithQuery} showLoginButton={false} />
            <RedirectGuard />
          </div>
        )}
        <div
          className={cn(
            "flex-1 min-h-0 w-full flex flex-col",
            !isProductPage && "md:mt-20",
          )}
        >
          {children}
        </div>
        {!isProductPage && (
          <div className="shrink-0">
            <Footer />
          </div>
        )}
      </WidthLayout>
    </main>
  );
};

import CategorySkeletonGrid from "./_components/CategorySkeleton";

// Main component with Suspense boundary
const LandingLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Suspense
      fallback={
        <main className="relative flex flex-col min-h-screen bg-cover bg-top bg-no-repeat bg-[url('https://res.cloudinary.com/drykej1am/image/upload/v1757840432/weeshr-marketplace/Desktop_-_20_pleoi7.png')]">
          {/* Minimal fallback to prevent layout shift while allowing page skeletons to show first */}
          <WidthLayout className="h-full flex flex-col">
            <div className="flex-grow pt-20 px-4" />
          </WidthLayout>
        </main>
      }
    >
      <LandingLayoutContent>{children}</LandingLayoutContent>
    </Suspense>
  );
};

export default LandingLayout;
