"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import WidthLayout from "@/components/commons/width-layout";
import VendorList from "../_components/vendor-list";
import { vendors } from "@/lib/constants/vendors";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";

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
            <AlertDialog open={open} onOpenChange={setOpen}>
              <AlertDialogTrigger asChild>
                <button className="flex flex-row gap-1 items-center text-sm hover:bg-gray-50 transition-colors duration-200 p-2 rounded-lg cursor-pointer">
                  <div className="border-[#6A70FF] border-2 rounded-md p-0.5 w-6">
                    <Icon icon="lsicon:switch-outline" />
                  </div>
                  <span>Change receiver</span>
                </button>
              </AlertDialogTrigger>

              <AlertDialogContent className="border-none bg-transparent shadow-none flex items-center justify-center">
                <Card className="w-full max-w-sm bg-white/80 backdrop-blur-sm shadow-lg px-0 rounded-3xl bg-[#E9F4D1] border-none">
                  <CardHeader className="px-5 py-4">
                    <CardTitle className="text-xl text-primary text-left p-0">
                      <span className="relative text-primary pr-1 font-normal">
                        Who would you like to
                        <span
                          className="relative whitespace-nowrap px-2 bg-gradient-custom bg-clip-text text-transparent text-xl sm:text-xl"
                          style={{ fontFamily: "Playwrite CU, sans-serif" }}
                        >
                          gift?
                        </span>
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-1 rounded-xl border-none">
                    <PlaceholdersAndVanishInput
                      placeholders={[
                        "Enter receiver's name",
                        "Gift someone special 🎁",
                        "Type a friend's name...",
                        "Who’s the lucky person ? ✨",
                        "Surprise someone today 🎉",
                        "Add a name to start gifting",
                        "Search for a loved one ❤️",
                        "Who deserves a treat ? 🍫",
                        "Enter a colleague’s name 👔",
                        "Make someone smile 😊",
                      ]}
                      onChange={(e) => setReceiverName(e.target.value)}
                      onSubmit={handleSubmit} // ✅ will redirect + close dialog
                    />
                  </CardContent>
                </Card>
              </AlertDialogContent>
            </AlertDialog>

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
                <span className="inline-block pl-1"> like ?</span>
              </span>
            </div>
          </div>

          <div className="text-muted-foreground pl-4 pt-6">
            Restaurant Options
          </div>
          <div className="md:max-h-[600px] overflow-y-auto mt-1 pr-2">
            <VendorList vendors={vendors} />
          </div>
        </div>
      </WidthLayout>
    </div>
  );
}
