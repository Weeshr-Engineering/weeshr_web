"use client";

import { FloatingNav } from "@/components/commons/floating-navbar";
import Footer from "@/components/commons/footer-primary";
import HeaderMobile from "@/components/commons/header-mobile";
import WidthLayout from "@/components/commons/width-layout";
import { marketplaceLinks } from "@/lib/constants/navigation-items";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchCategories } from "@/lib/api";
import RedirectGuard from "./_components/redirect-guard";

const LandingLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
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
      if (baseLink === "/marketplace/categories") {
        return {
          ...item,
          link: nameParam
            ? `${baseLink}?name=${encodeURIComponent(nameParam)}`
            : baseLink,
        };
      }

      // For specific category links (food, fashion, gadget, lifestyle)
      if (baseLink.startsWith("/marketplace/categories/")) {
        // Extract category name from the link (e.g., "food" from "/marketplace/categories/food")
        const categoryNameFromLink = baseLink.split("/").pop();

        // Find the matching category from API data
        const category = categories.find(
          (cat: any) =>
            cat.name.toLowerCase() === categoryNameFromLink?.toLowerCase()
        );

        if (category && nameParam) {
          // Build the exact same URL structure as categories page
          return {
            ...item,
            link: `/marketplace/categories/${category.name.toLowerCase()}?id=${
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
            link: `/marketplace/categories/${category.name.toLowerCase()}?id=${
              category._id
            }`,
          };
        }
      }

      return item;
    });

    setNavWithQuery(updatedNav);
  }, [categories, nameParam]);

  return (
    <main
      className="relative flex flex-col min-h-screen bg-cover bg-top bg-no-repeat
    bg-[url('https://res.cloudinary.com/drykej1am/image/upload/v1757840432/weeshr-marketplace/Desktop_-_20_pleoi7.png')]"
    >
      <WidthLayout>
        <HeaderMobile hideLoginButton={true} customLinks={navWithQuery} />
        <FloatingNav navItems={navWithQuery} showLoginButton={false} />
        <RedirectGuard />
        <div className="flex-grow pt-0 lg:pt-10 py-10">{children}</div>
        <Footer />
      </WidthLayout>
    </main>
  );
};

export default LandingLayout;
