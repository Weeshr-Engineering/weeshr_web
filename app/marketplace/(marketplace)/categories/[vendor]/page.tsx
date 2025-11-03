"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import WidthLayout from "@/components/commons/width-layout";
import VendorList from "../_components/vendor-list";
import ChangeReceiverDialog from "../_components/change-receiver-dialog";
import { Vendor, VendorService } from "@/service/vendor.service";


export default function Page() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [receiverName, setReceiverName] = useState("");
  const [open, setOpen] = useState(false);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);

  const nameParam = searchParams.get("name");
  const categoryId = searchParams.get("id"); // Get category ID from URL

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
  if (!nameParam || !categoryId) {
    return null;
  }

  // Capitalize the name
  const displayName = nameParam.charAt(0).toUpperCase() + nameParam.slice(1);

  // Handle submit - preserve category ID when changing receiver
  const handleSubmit = () => {
    if (receiverName.trim().length > 0) {
      router.push(
        `/marketplace/categories/food?id=${categoryId}&name=${encodeURIComponent(
          receiverName
        )}`
      );
      setOpen(false);
    }
  };

  return (
    <div className="flex flex-col">
      <WidthLayout>
        <div className="text-left text-4xl p-6">Food</div>

        <div className="bg-white p-4 rounded-2xl text-[#6A70FF] font-light px-6">
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

          <div className="text-muted-foreground pl-4 pt-6">
            Restaurant Options
          </div>
          <div className="md:max-h-[600px] overflow-y-auto mt-1 pr-2">
            <VendorList vendors={vendors} loading={loading} />
          </div>
        </div>
      </WidthLayout>
    </div>
  );
}
