"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Icon } from "@iconify/react";
import { SignupFormData, signupService } from "@/service/auth.service";
import toast from "react-hot-toast";
import { useMediaQuery } from "@/hooks/use-media-query";

interface SignupFormProps {
  onToggleMode: () => void;
  onSuccess: () => void;
  onSignupSuccess: (
    email: string,
    phone: string,
    formData: SignupFormData,
    userId?: string,
    token?: string
  ) => void;
  initialData?: SignupFormData | null;
}

const countryCodes = [
  { code: "+234", flag: "🇳🇬", country: "Nigeria" },
  { code: "+233", flag: "🇬🇭", country: "Ghana" },
  { code: "+254", flag: "🇰🇪", country: "Kenya" },
  { code: "+27", flag: "🇿🇦", country: "South Africa" },
  { code: "+1", flag: "🇺🇸", country: "USA" },
  { code: "+44", flag: "🇬🇧", country: "UK" },
  { code: "+33", flag: "🇫🇷", country: "France" },
  { code: "+49", flag: "🇩🇪", country: "Germany" },
];

export default function SignupForm({
  onToggleMode,
  onSuccess,
  onSignupSuccess,
  initialData,
}: SignupFormProps) {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [formData, setFormData] = useState<SignupFormData>(
    initialData || {
      firstName: "",
      lastName: "",
      email: "",
      userName: "",
      gender: "",
      dob: "",
      phone: {
        countryCode: "+234",
        phoneNumber: "",
      },
    }
  );

  const [isLoadingSignup, setIsLoadingSignup] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePhoneChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      phone: { ...prev.phone, [field]: value },
    }));
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsLoadingSignup(true);
      const response = await signupService.register(formData);

      // Show verification modal instead of calling onSuccess immediately
      // Call parent handler with email and phone to start verification flow
      // Also pass userId and token if available to auto-login
      onSignupSuccess(
        formData.email,
        `${formData.phone.countryCode} ${formData.phone.phoneNumber}`,
        formData,
        response.data?.user?._id,
        response.data?.user?.token
      );
    } catch (error) {
      // Zod and toast already handle messages in the service
      console.error("Signup failed:", error);
    } finally {
      setIsLoadingSignup(false);
    }
  };

  return (
    <>
      <Card
        className={`border-none flex flex-col ${
          isMobile
            ? "bg-transparent shadow-none max-h-none"
            : "bg-white/95 backdrop-blur-sm shadow-2xl rounded-3xl max-h-[85vh]"
        }`}
      >
        <CardHeader
          className={`text-center pb-6 lg:pb-8 flex-shrink-0 ${
            isMobile ? "px-0" : ""
          }`}
        >
          <CardTitle className="text-xl lg:text-2xl font-normal text-primary text-left">
            <span className="relative text-primary pr-1">
              {initialData ? "Edit profile" : "Create account"}
              <span
                className="relative whitespace-nowrap px-2 bg-gradient-custom bg-clip-text text-transparent text-xl lg:text-2xl"
                style={{ fontFamily: "Playwrite CU, sans-serif" }}
              >
                {initialData ? "Update your details" : "Join us today"}
              </span>
            </span>
            <div className="text-xs lg:text-sm text-muted-foreground mt-2">
              All fields are required
            </div>
          </CardTitle>
        </CardHeader>

        <CardContent
          className={`space-y-4 lg:space-y-6 flex-1 flex flex-col overflow-hidden ${
            isMobile ? "px-0" : ""
          }`}
        >
          <form
            onSubmit={handleSignup}
            className="flex-1 flex flex-col overflow-hidden"
          >
            <div className="space-y-2 flex-1 overflow-y-auto pr-2">
              {/* First & Last name */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>First Name *</Label>
                  <Input
                    name="firstName"
                    placeholder="First name"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                    className="rounded-xl h-12 border-2"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Last Name *</Label>
                  <Input
                    name="lastName"
                    placeholder="Last name"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                    className="rounded-xl h-12 border-2"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label>Email *</Label>
                <Input
                  name="email"
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="rounded-xl h-12 border-2"
                />
              </div>

              {/* Username */}
              <div className="space-y-2">
                <Label>Username *</Label>
                <Input
                  name="userName"
                  placeholder="Choose a username"
                  value={formData.userName}
                  onChange={handleInputChange}
                  required
                  className="rounded-xl h-12 border-2"
                />
              </div>

              {/* Gender & DOB */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Gender *</Label>
                  <Select
                    value={formData.gender}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, gender: value }))
                    }
                  >
                    <SelectTrigger className="rounded-xl h-12 border-2">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="others">Others</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Date of Birth *</Label>
                  <Input
                    name="dob"
                    type="date"
                    value={formData.dob}
                    onChange={handleInputChange}
                    max={new Date().toISOString().split("T")[0]}
                    required
                    className="rounded-xl h-12 border-2"
                  />
                </div>
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <Label>Phone Number *</Label>
                <div className="flex gap-2">
                  <Select
                    value={formData.phone.countryCode}
                    onValueChange={(value) =>
                      handlePhoneChange("countryCode", value)
                    }
                  >
                    <SelectTrigger className="w-32 rounded-xl h-12 border-2">
                      <SelectValue>
                        <span className="flex items-center gap-2 text-black">
                          <span>
                            {
                              countryCodes.find(
                                (c) => c.code === formData.phone.countryCode
                              )?.flag
                            }
                          </span>
                          <span>{formData.phone.countryCode}</span>
                        </span>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {countryCodes.map((country) => (
                        <SelectItem key={country.code} value={country.code}>
                          <span className="flex items-center gap-2">
                            <span>{country.flag}</span>
                            <span>{country.code}</span>
                            <span className="text-xs text-gray-500">
                              {country.country}
                            </span>
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    name="phoneNumber"
                    placeholder="791 643 8133"
                    value={formData.phone.phoneNumber}
                    onChange={(e) =>
                      handlePhoneChange("phoneNumber", e.target.value)
                    }
                    required
                    className="flex-1 rounded-xl h-12 border-2"
                  />
                </div>
              </div>
            </div>

            {/* Submit */}
            <div className="flex-shrink-0 space-y-4 pt-4 mt-4 border-t border-gray-200">
              <Button
                type="submit"
                disabled={isLoadingSignup}
                className="w-full h-12 rounded-3xl bg-gradient-to-r from-[#4145A7] to-[#5a5fc7] text-white font-semibold hover:from-[#5a5fc7] hover:to-[#4145A7] shadow-lg hover:shadow-xl"
              >
                {isLoadingSignup ? (
                  <Icon
                    height={20}
                    width={70}
                    icon="eos-icons:three-dots-loading"
                  />
                ) : initialData ? (
                  "Update Profile"
                ) : (
                  "Create Account"
                )}
              </Button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={onToggleMode}
                  className="text-sm text-[#6A70FF] hover:underline"
                >
                  Already have an account? Sign in
                </button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </>
  );
}
