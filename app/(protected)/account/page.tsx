"use client";

import { useEffect, useState } from "react";
import WidthLayout from "@/components/width-layout";
import Image from "next/image";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { Skeleton } from "@/components/ui/skeleton";
import { useLoginUserErrorHandler } from "@/lib/handle-err";
import { useRouter } from "next/navigation"; // Import useRouter

const HomePage: React.FC = () => {
  const [fullName, setFullName] = useState<string>("");
  const { handleError } = useLoginUserErrorHandler(); // Use the custom hook
  const router = useRouter(); // Initialize router

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        // Fetch the user profile
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/user/profile`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          }
        );

        if (response.status === 200) {
          const { firstName, lastName } = response.data.data;
          setFullName(`${firstName} ${lastName}`);
        } else {
          // Handle non-200 status codes gracefully
          handleError({
            response: {
              status: response.status,
              data: { message: "Failed to fetch user profile." },
            },
          });
        }
      } catch (error) {
        handleError(error); // Use the custom error handler
      }
    };

    fetchUserProfile();
  }, [handleError]); // Ensure handleError is included in the dependency array

  const handleDeleteAccount = async () => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/user/account`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });

      // Clear local storage and redirect to login using router
      localStorage.removeItem("authToken");
      router.push("/login"); // Navigate to login page
    } catch (error) {
      handleError(error); // Use the custom error handler
    }
  };

  return (
    <WidthLayout narrow={true}>
      <div className="container h-screen px-[0.5px] pt-32 mx-auto text-black">
        <div className="flex flex-col items-center">
          <h1 className="w-9/12 mb-4 text-center text-h2">
            Weeshr so sorry to see you go
          </h1>
          <p className="text-muted-foreground">
            You’re about to leave the weeshr giftiverse
          </p>
        </div>

        <div className="flex-col w-full p-6 px-4 mt-16 rounded-lg bg-white/60 backdrop-blur-3xl">
          <div className="px-4">
            <Image
              alt="image"
              src="https://res.cloudinary.com/drykej1am/image/upload/v1724061821/weeshr_website/Vector_50_yna0vu.png"
              width={50}
              height={50}
            ></Image>

            <h3 className="h-8 pt-2 font-semibold capitalize text-h4">
              {fullName ? (
                fullName + ","
              ) : (
                <Skeleton className="h-4 w-[200px]" />
              )}{" "}
            </h3>
            <h5 className="py-1 font-semibold text-pb">
              Are about to delete your weeshr account
            </h5>
          </div>
          <div className="p-5 mt-4 bg-white rounded-lg">
            <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-md">
              <Icon icon="hugeicons:alert-02" height={"30"} width={"30"} />
            </div>
            <h3 className="pt-3 pb-1 font-semibold text-h6">Disclaimer</h3>

            <div className="space-y-3 text-muted-foreground">
              <p>
                Account deletion is permanent. Your data, wishes, weeshr connect
                and moments will be erased. Shared content may remain visible.
                This action cannot be undone.
              </p>
              <p>
                Account deletion is permanent. Your data, wishes, weeshr connect
                and moments will be erased. Shared content may remain visible.
                This action cannot be undone.
              </p>
            </div>
          </div>
          <Button
            onClick={handleDeleteAccount}
            size={"xl"}
            variant={"outline"}
            className="w-full font-semibold text-pb"
          >
            Temporarily Deactivate
          </Button>
        </div>
      </div>
    </WidthLayout>
  );
};

export default HomePage;
