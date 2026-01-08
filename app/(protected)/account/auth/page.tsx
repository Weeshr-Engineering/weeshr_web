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
    console.log("Starting Google callback with code:", code);

    try {
      const encodedCode = encodeURIComponent(code);
      console.log("Encoded Code:", encodedCode);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/google/login?code=${encodedCode}`,
        {
          method: "GET",
        }
      );

      console.log("Response status:", response.status);

      if (response.status === 200) {
        const data = await response.json();
        console.log("Response data:", data);

        if (data?.data?.user?.token) {
          const token = data.data.user.token;
          console.log("Token received:", token);

          // Save the token in localStorage with the key 'authToken'
          localStorage.setItem("authToken", token);
          const savedToken = localStorage.getItem("authToken");
          console.log("Saved token:", savedToken);

          if (savedToken) {
            console.log("Token saved successfully, redirecting...");
            router.push("/m");
          } else {
            console.error("Token not saved correctly in localStorage.");
            toast.error("Failed to save authentication token.");
          }
        } else {
          console.error("No token found in the response data.");
          toast.error("Authentication failed. No token received.");
        }
      } else {
        const errorData = await response.json();
        console.error("Error data:", errorData);

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
      console.error("Error during authentication:", error);
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
    } else {
      console.warn("No code found in URL.");
    }
  };

  useEffect(() => {
    handleCodeFromUrl();
  }, []);

  return (
    <div className="relative h-screen ">
      {loading && <div className="text-lg text-white ">Loading...</div>}
    </div>
  );
};

export default AuthPage;
