"use client";

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
import { AlertDialog, AlertDialogContent } from "@/components/ui/alert-dialog";
import { useState, useRef, useEffect } from "react";
import LoginSidePanel from "./LoginSidePanel";
import ReceiverInfoModal from "./ReceiverInfoModal";

interface LoginDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  basketTotal: number;
  basketCount: number;
}

interface SignupFormData {
  firstName: string;
  lastName: string;
  email: string;
  userName: string;
  password: string;
  gender: string;
  phone: {
    countryCode: string;
    phoneNumber: string;
  };
  dob: string;
}

// Country codes with flags
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

export default function LoginDialog({
  open,
  setOpen,
  basketTotal,
  basketCount,
}: LoginDialogProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [showReceiverModal, setShowReceiverModal] = useState(false);
  const [receiverName, setReceiverName] = useState("Dorcas");
  const [formData, setFormData] = useState<SignupFormData>({
    firstName: "",
    lastName: "",
    email: "",
    userName: "",
    password: "",
    gender: "male",
    phone: {
      countryCode: "+234",
      phoneNumber: "",
    },
    dob: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoadingLogin, setIsLoadingLogin] = useState(false);
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
      phone: {
        ...prev.phone,
        [field]: value,
      },
    }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoadingLogin(true);

    try {
      console.log("Login with:", {
        email: formData.email,
        password: formData.password,
      });
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Show receiver modal instead of closing
      setShowReceiverModal(true);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoadingLogin(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoadingSignup(true);

    try {
      console.log("Signup data:", formData);
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Show receiver modal instead of closing
      setShowReceiverModal(true);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoadingSignup(false);
    }
  };

  const handleGoogleLogin = () => {
    console.log("Google login");
    // Handle Google login logic here
  };

  const handleToggleMode = () => {
    setIsLogin(!isLogin);
  };

  // Handle when ReceiverInfoModal is closed
  const handleReceiverModalClose = () => {
    setShowReceiverModal(false);
    // Also close the main login dialog when receiver modal is closed
    setOpen(false);
  };

  // Reset states when modal closes
  useEffect(() => {
    if (!open) {
      setShowReceiverModal(false);
      setIsLoadingLogin(false);
      setIsLoadingSignup(false);
    }
  }, [open]);

  return (
    <>
      {/* Login/Signup Modal - Only show when main open is true AND receiver modal is not showing */}
      <AlertDialog open={open && !showReceiverModal} onOpenChange={setOpen}>
        <AlertDialogContent
          onCloseRequest={() => setOpen(false)}
          className="border-none bg-transparent shadow-none flex items-center justify-center max-w-4xl w-[95%] md:mt-14"
        >
          <div className="w-full flex flex-col md:flex-row gap-4">
            {/* Left Side - Login/Signup Form */}
            <Card className="flex-1 bg-white/95 backdrop-blur-sm shadow-2xl border-none rounded-3xl max-h-[85vh] flex flex-col">
              <CardHeader className="text-center pb-6 lg:pb-8 flex-shrink-0">
                <CardTitle className="text-xl lg:text-2xl font-normal text-primary">
                  <span className="relative text-primary pr-1">
                    {isLogin ? "Welcome back" : "Create account"}
                    <span
                      className="relative whitespace-nowrap px-2 bg-gradient-custom bg-clip-text text-transparent text-xl lg:text-2xl"
                      style={{ fontFamily: "Playwrite CU, sans-serif" }}
                    >
                      {isLogin ? "Sign in to continue" : "Join us today"}
                    </span>
                  </span>
                  <div className="text-xs lg:text-sm text-muted-foreground mt-2">
                    {isLogin
                      ? "on the gift you're sending to Dorcas"
                      : "to start sending amazing gifts"}
                  </div>
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-4 lg:space-y-6 flex-1 flex flex-col overflow-hidden">
                {/* Google Login Button - Only show in login mode */}
                {isLogin && (
                  <div className="space-y-4 flex-shrink-0">
                    <Button
                      variant="outline"
                      className="w-full h-12 rounded-xl border-2 hover:bg-gray-50 transition-colors"
                      onClick={handleGoogleLogin}
                    >
                      <Icon
                        icon="flat-color-icons:google"
                        className="w-6 h-6 mr-2"
                      />
                      Continue with Google
                    </Button>

                    {/* Divider */}
                    <div className="flex items-center justify-center space-x-4 my-4">
                      <div className="h-px bg-gray-300 flex-1"></div>
                      <span className="text-sm text-muted-foreground">or</span>
                      <div className="h-px bg-gray-300 flex-1"></div>
                    </div>
                  </div>
                )}

                {/* Login Form */}
                {isLogin ? (
                  <form
                    onSubmit={handleLogin}
                    className="space-y-4 flex-1 flex flex-col"
                  >
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
                          Password
                        </Label>
                        <div className="relative">
                          <Input
                            id="login-password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
                            className="rounded-xl h-12 border-2 transition-colors pr-10"
                            value={formData.password}
                            onChange={handleInputChange}
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
                          >
                            <Icon
                              icon={
                                showPassword
                                  ? "mdi:eye-off-outline"
                                  : "mdi:eye-outline"
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
                        className="w-full h-12 rounded-xl bg-gradient-to-r from-[#4145A7] to-[#5a5fc7] text-white font-semibold text-base hover:from-[#5a5fc7] hover:to-[#4145A7] transition-all duration-300 shadow-lg hover:shadow-xl"
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
                          onClick={handleToggleMode}
                          className="text-sm text-[#6A70FF] hover:underline"
                        >
                          Don't have an account? Sign up
                        </button>
                      </div>
                    </div>
                  </form>
                ) : (
                  /* Signup Form with Scroll */
                  <form
                    onSubmit={handleSignup}
                    className="flex-1 flex flex-col overflow-hidden"
                  >
                    <div className="space-y-2 flex-1 overflow-y-auto pr-2">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label
                            htmlFor="firstName"
                            className="text-sm text-muted-foreground"
                          >
                            First Name *
                          </Label>
                          <Input
                            id="firstName"
                            name="firstName"
                            placeholder="First name"
                            className="rounded-xl h-12 border-2 transition-colors"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label
                            htmlFor="lastName"
                            className="text-sm text-muted-foreground"
                          >
                            Last Name *
                          </Label>
                          <Input
                            id="lastName"
                            name="lastName"
                            placeholder="Last name"
                            className="rounded-xl h-12 border-2 transition-colors"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="email"
                          className="text-sm text-muted-foreground"
                        >
                          Email Address *
                        </Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="your@email.com"
                          className="rounded-xl h-12 border-2 transition-colors"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label
                              htmlFor="userName"
                              className="text-sm text-muted-foreground"
                            >
                              Username *
                            </Label>
                            <Input
                              id="userName"
                              name="userName"
                              placeholder="Choose a username"
                              className="rounded-xl h-12 border-2 transition-colors"
                              value={formData.userName}
                              onChange={handleInputChange}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label
                              htmlFor="password"
                              className="text-sm text-muted-foreground"
                            >
                              Password *
                            </Label>
                            <div className="relative">
                              <Input
                                id="password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                inputMode="numeric"
                                placeholder="Enter 4-digit PIN"
                                className="rounded-xl h-12 border-2 transition-colors pr-10"
                                value={formData.password}
                                onChange={handleInputChange}
                                required
                              />
                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
                              >
                                <Icon
                                  icon={
                                    showPassword
                                      ? "mdi:eye-off-outline"
                                      : "mdi:eye-outline"
                                  }
                                  className="w-5 h-5"
                                />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label
                            htmlFor="gender"
                            className="text-sm text-muted-foreground"
                          >
                            Gender
                          </Label>
                          <Select
                            value={formData.gender}
                            onValueChange={(value) =>
                              setFormData((prev) => ({
                                ...prev,
                                gender: value,
                              }))
                            }
                          >
                            <SelectTrigger className="rounded-xl h-12 border-2 transition-colors">
                              <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="male">Male</SelectItem>
                              <SelectItem value="female">Female</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label
                            htmlFor="dob"
                            className="text-sm text-muted-foreground"
                          >
                            Date of Birth
                          </Label>
                          <Input
                            id="dob"
                            name="dob"
                            type="date"
                            className="rounded-xl h-12 border-2 transition-colors"
                            value={formData.dob}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="phone"
                          className="text-sm text-muted-foreground"
                        >
                          Phone Number *
                        </Label>
                        <div className="flex gap-2">
                          <Select
                            value={formData.phone.countryCode}
                            onValueChange={(value) =>
                              handlePhoneChange("countryCode", value)
                            }
                          >
                            <SelectTrigger className="w-32 rounded-xl h-12 border-2 transition-colors">
                              <SelectValue>
                                <span className="flex items-center gap-2 text-black">
                                  <span>
                                    {
                                      countryCodes.find(
                                        (country) =>
                                          country.code ===
                                          formData.phone.countryCode
                                      )?.flag
                                    }
                                  </span>
                                  <span>
                                    {
                                      countryCodes.find(
                                        (country) =>
                                          country.code ===
                                          formData.phone.countryCode
                                      )?.code
                                    }
                                  </span>
                                </span>
                              </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                              {countryCodes.map((country) => (
                                <SelectItem
                                  key={country.code}
                                  value={country.code}
                                >
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
                            id="phoneNumber"
                            name="phoneNumber"
                            placeholder="791 643 8133"
                            className="flex-1 rounded-xl h-12 border-2 transition-colors"
                            value={formData.phone.phoneNumber}
                            onChange={(e) =>
                              handlePhoneChange("phoneNumber", e.target.value)
                            }
                            required
                          />
                        </div>
                      </div>
                    </div>

                    {/* Sticky Button Section */}
                    <div className="flex-shrink-0 space-y-4 pt-4 mt-4 border-t border-gray-200">
                      <Button
                        type="submit"
                        disabled={isLoadingSignup}
                        className="w-full h-12 rounded-xl bg-gradient-to-r from-[#4145A7] to-[#5a5fc7] text-white font-semibold text-base hover:from-[#5a5fc7] hover:to-[#4145A7] transition-all duration-300 shadow-lg hover:shadow-xl"
                      >
                        {isLoadingSignup ? (
                          <Icon
                            height={20}
                            width={70}
                            icon="eos-icons:three-dots-loading"
                          />
                        ) : (
                          "Create Account"
                        )}
                      </Button>

                      <div className="text-center">
                        <button
                          type="button"
                          onClick={handleToggleMode}
                          className="text-sm text-[#6A70FF] hover:underline"
                        >
                          Already have an account? Sign in
                        </button>
                      </div>
                    </div>
                  </form>
                )}
              </CardContent>
            </Card>

            {/* Right Side - Separate Component */}
            <LoginSidePanel isLogin={isLogin} />
          </div>
        </AlertDialogContent>
      </AlertDialog>

      {/* Receiver Info Modal - Shows after successful login/signup */}
      <ReceiverInfoModal
        open={showReceiverModal}
        setOpen={handleReceiverModalClose}
        basketTotal={basketTotal}
        basketCount={basketCount}
        receiverName={receiverName}
      />
    </>
  );
}
