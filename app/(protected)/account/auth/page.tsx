"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { handleApiError } from "@/lib/handle-err";
import toast from "react-hot-toast";

const AuthPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleGoogleCallback = async (code: string) => {
    setLoading(true);

    try {
      const encodedCode = encodeURIComponent(code);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/google/login?code=${encodedCode}`,
        {
          method: "GET",
        }
      );

      if (response.status === 200) {
        const { token } = await response.json();
        localStorage.setItem("authToken", token);
        router.push("/account");
      } else {
        const errorData = await response.json();
        const errorMessage =
          errorData.error ||
          errorData.message ||
          "Authentication failed. Redirecting to login...";

        toast.error(errorMessage);
        setTimeout(() => {
          router.push("/login");
        }, 3000);
      }
    } catch (error: any) {
      handleApiError(error);

      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleCodeFromUrl = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");

    console.log("Raw Code from URL:", code);

    if (code) {
      // Decode the code before passing it to handleGoogleCallback
      const decodedCode = decodeURIComponent(code);
      console.log("Decoded Code:", decodedCode);
      handleGoogleCallback(decodedCode);
    }
  };

  useEffect(() => {
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
