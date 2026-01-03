"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Icon } from "@iconify/react";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { handleApiError } from "@/lib/handle-err";
import { useMediaQuery } from "@/hooks/use-media-query";
import { z } from "zod";

interface LoginFormProps {
  onToggleMode: () => void;
  onSuccess: () => void;
}

const loginSchema = z.object({
  email: z.string(),
  pin: z.string().min(4, { message: "Password must be 4 characters long" }),
});

export default function LoginForm({ onToggleMode, onSuccess }: LoginFormProps) {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoadingLogin, setIsLoadingLogin] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoadingLogin(true);

    try {
      const loginData = {
        email: formData.email,
        pin: formData.password,
      };

      // Validate with Zod schema
      const validation = loginSchema.safeParse(loginData);
      if (!validation.success) {
        const errorMessages = validation.error.errors
          .map((err) => err.message)
          .join(", ");
        toast.error(`Validation failed: ${errorMessages}`);
        return;
      }

      // Make API call
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/login/pin`,
        loginData
      );

      if (response.status === 200 || response.status === 201) {
        const userData = response.data.data.user;
        const userId = userData._id;
        localStorage.setItem("userId", userId);
        localStorage.setItem("authToken", userData.token);

        onSuccess();
        toast.success("Login successful!");
      } else {
        toast.error("Login failed. Please check your credentials.");
      }
    } catch (error) {
      handleApiError(error);
    } finally {
      setIsLoadingLogin(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/login/google`
      );

      if (response.status === 200 || response.status === 201) {
        const redirectUrl = response.data.data.redirect_to;
        window.location.href = redirectUrl;
      } else {
        toast.error("Failed to initiate Google login.");
      }
    } catch (error) {
      handleApiError(error);
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <Card
      className={`border-none flex flex-col ${
        isMobile
          ? "bg-white shadow-none max-h-none rounded-3xl "
          : "bg-white/95 backdrop-blur-sm shadow-2xl rounded-3xl max-h-[85vh]"
      }`}
    >
      <CardHeader
        className={`text-center pb-6 lg:pb-8 flex-shrink-0 ${
          isMobile ? "px-4" : ""
        }`}
      >
        <CardTitle className="text-xl lg:text-2xl font-normal text-primary text-left">
          <span className="relative text-primary pr-1">
            More About
            <span
              className="relative whitespace-nowrap px-2 bg-gradient-custom bg-clip-text text-transparent text-xl lg:text-2xl"
              style={{
                fontFamily:
                  "var(--font-playwrite), 'Playwrite CU', cursive, sans-serif",
              }}
            >
              you
            </span>
          </span>
          <div className="text-xs lg:text-sm text-muted-foreground mt-2">
            or Let us keep you updated on the gift you're sending to Dorcas
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent
        className={`space-y-4 lg:space-y-6 flex-1 flex flex-col overflow-hidden ${
          isMobile ? "px-4 pb-4" : ""
        }`}
      >
        {/* Google Login Button */}
        {/* <div className="space-y-4 flex-shrink-0">
          <div className="space-y-2 text-center">
            <div className="text-sm font-normal">Sign in with</div>
            <Button
              variant="google"
              className="w-full h-12 rounded-3xl border-2 hover:bg-gray-50 transition-colors text-black"
              onClick={handleGoogleLogin}
              disabled={isGoogleLoading}
            >
              {isGoogleLoading ? (
                <Icon
                  height={20}
                  width={70}
                  icon="eos-icons:three-dots-loading"
                />
              ) : (
                <>
                  <Icon
                    icon="flat-color-icons:google"
                    className="w-6 h-6 mr-2"
                  />
                  Google
                </>
              )}
            </Button>
          </div>

          {/* Divider */}
        {/* <div className="flex items-center justify-center space-x-4 my-4">
          <div className="h-px bg-gray-300 flex-1"></div>
          <span className="text-sm text-black">or</span>
          <div className="h-px bg-gray-300 flex-1"></div>
        </div> */}
        {/* </div> */}
        {/* */}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4 flex-1 flex flex-col">
          <div className="space-y-4 flex-1">
            <div className="space-y-2">
              <Label
                htmlFor="login-email"
                className="text-sm text-muted-foreground"
              >
                Email or Username
              </Label>
              <Input
                id="login-email"
                name="email"
                type="text"
                placeholder="Enter your email or username"
                className="rounded-xl h-12 border-2 transition-colors"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="login-password"
                className="text-sm text-muted-foreground"
              >
                Password (4-digit PIN)
              </Label>
              <div className="relative">
                <Input
                  id="login-password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  inputMode="numeric"
                  placeholder="Enter your 4-digit PIN"
                  className="rounded-xl h-12 border-2 transition-colors pr-10"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  maxLength={4}
                  pattern="[0-9]{4}"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
                >
                  <Icon
                    icon={
                      showPassword ? "mdi:eye-off-outline" : "mdi:eye-outline"
                    }
                    className="w-5 h-5"
                  />
                </button>
              </div>
            </div>
          </div>

          <div className="flex-shrink-0 space-y-4 pt-4">
            <Button
              type="submit"
              disabled={isLoadingLogin}
              className="w-full h-12 rounded-3xl bg-gradient-to-r from-[#4145A7] to-[#5a5fc7] text-white font-semibold text-base hover:from-[#5a5fc7] hover:to-[#4145A7] transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              {isLoadingLogin ? (
                <Icon
                  height={20}
                  width={70}
                  icon="eos-icons:three-dots-loading"
                />
              ) : (
                "Sign In"
              )}
            </Button>

            <div className="text-center">
              <button
                type="button"
                onClick={onToggleMode}
                className="text-sm text-[#6A70FF] hover:underline"
              >
                Don't have an account? Sign up
              </button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
