"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import WidthLayout from "@/components/commons/width-layout";
import VendorList from "../_components/vendor-list";
import { vendors_food } from "@/lib/constants/vendors";
import ChangeReceiverDialog from "../_components/change-receiver-dialog";

export default function Page() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [receiverName, setReceiverName] = useState("");
  const [open, setOpen] = useState(false);

  const nameParam = searchParams.get("name");

  // Redirect if no name
  useEffect(() => {
    if (!nameParam) {
      router.replace("/marketplace");
    }
  }, [nameParam, router]);

  // 🚫 Do not render anything if no name
  if (!nameParam) {
    return null;
  }

  // Capitalize the name
  const displayName = nameParam.charAt(0).toUpperCase() + nameParam.slice(1);

  // Handle submit
  const handleSubmit = () => {
    if (receiverName.trim().length > 0) {
      router.push(
        `/marketplace/categories/food?name=${encodeURIComponent(receiverName)}`
      );
      setOpen(false); // ✅ close dialog after submit
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
            <VendorList vendors={vendors_food} />
          </div>
        </div>
      </WidthLayout>
    </div>
  );
}
