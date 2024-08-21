"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { handleApiError } from "@/lib/handle-err";
import toast from "react-hot-toast";

const AuthPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleGoogleCallback = async (code: string) => {
    setLoading(true);

    try {
      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL
        }/auth/google/login?code=${encodeURIComponent(code)}`,
        {
          method: "GET",
        }
      );

      if (response.status === 200) {
        const { token } = await response.json();
        localStorage.setItem("authToken", token);
        router.push("/account");
      } else {
        // Extract error message from backend response
        const errorData = await response.json();
        const errorMessage =
          errorData.error ||
          errorData.message ||
          "Authentication failed. Redirecting to login...";

        toast.error(errorMessage);
        setTimeout(() => {
          router.push("/login");
        }, 3000); // Wait for the toast to show before redirecting
      }
    } catch (error: any) {
      handleApiError(error);

      setTimeout(() => {
        router.push("/login");
      }, 3000); // Wait for the toast to show before redirecting
    } finally {
      setLoading(false);
    }
  };

  const handleCodeFromUrl = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");

    if (code) {
      handleGoogleCallback(code);
    }
  };

  React.useEffect(() => {
    handleCodeFromUrl();
  }, []);

  return (
    <div className="relative h-screen bg-[#4537ba]">
      {loading && (
        <div className="absolute text-lg text-white top-4 left-4">
          Loading...
        </div>
      )}
    </div>
  );
};

export default AuthPage;
