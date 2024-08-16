"use client";

import React, { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { Icon } from "@iconify/react";
import axios from "axios";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { handleApiError } from "@/lib/handle-err";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" })
    .regex(/[!@#$%^&*(),.?":{}|<>]/, {
      message: "Password must include at least one symbol",
    }),
});

const LoginPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSignInLoading, setIsSignInLoading] = useState(false); // New state for Sign in button loading

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    setIsSignInLoading(true); // Set loading state for Sign in button

    const formData = {
      email: event.target.email.value,
      password: event.target.password.value,
    };

    const validation = loginSchema.safeParse(formData);

    if (!validation.success) {
      const errorMessages = validation.error.errors
        .map((err) => err.message)
        .join(", ");
      toast.error(`Validation failed: ${errorMessages}`);
      setIsSignInLoading(false); // Reset loading state on validation failure
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/login/password`,
        formData
      );

      if (response.status === 200 || response.status === 201) {
        toast.success("Login successful");
        window.location.href = "/dashboard";
      } else {
        toast.error("Login failed. Please check your credentials.");
      }
    } catch (error) {
      handleApiError(error);
    } finally {
      setIsSignInLoading(false); // Reset loading state on API response
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/login/google`
      );

      if (response.status === 200 || response.status === 201) {
        const redirectUrl = response.data.data.redirect_to;
        toast.success("Redirecting to Google login...");
        window.location.href = redirectUrl; // Redirect the user to the Google login page
      } else {
        toast.error("Failed to initiate Google login.");
      }
    } catch (handleApiError) {
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Login - Weeshr</title>
      </Head>
      <div
        style={{
          backgroundImage: `url('https://res.cloudinary.com/drykej1am/image/upload/v1723760346/weeshr_website/owcdkhmybidka83hiksb.png')`,
        }}
        className="relative flex flex-wrap items-end justify-center min-h-screen bg-gray-100 bg-no-repeat bg-cover"
      >
        <Image
          alt="Weeshr Logo"
          src="https://res.cloudinary.com/drykej1am/image/upload/v1697377875/weehser%20pay/Weeshr_Light_lrreyo.svg"
          width={100}
          height={100}
          className="absolute mx-auto top-12 md:top-24"
        />

        <div className="w-full p-8 px-6 space-y-8 rounded-lg shadow-md bg-gradient-to-t from-gray-100 via-white/80 to-white/0">
          <div className="flex flex-col w-full bg-white/90 blur-[10] rounded-lg p-3 space-y-2 pb-6">
            <h4 className="font-semibold text-black">Weeshr Gist</h4>
            <div className="text-[#020721] text-sm">
              <p className="pb-1.5">
                If wishes were horses, we'd all be riding unicorns to work or
                not because my wish this morning is to sleep in.
              </p>
              <span className="text-[#3A8EE5] mt-4">
                #WishfulThinking #UnicornCommute #Weeshr
              </span>
            </div>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <input type="hidden" name="remember" value="true" />
            <div className="-space-y-px rounded-md shadow-sm">
              <div>
                <label htmlFor="email-address" className="sr-only">
                  Email address
                </label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="relative block w-full px-3 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-none appearance-none rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Email address"
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="relative block w-full px-3 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-none appearance-none rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Password"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
                <label
                  htmlFor="remember-me"
                  className="block ml-2 text-sm text-gray-900"
                >
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <Link
                  href="/forgot-password"
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Forgot your password?
                </Link>
              </div>
            </div>

            <div className="pt-3 pb-10">
              <h4 className="w-full py-3 font-semibold text-center text-black">
                Continue with
              </h4>
              <div className="space-y-2">
                <Button
                  variant={"white_btn"}
                  onClick={handleGoogleLogin}
                  className="w-full text-black bg-white rounded-full"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Icon
                      height={20}
                      width={70}
                      icon="eos-icons:three-dots-loading"
                    />
                  ) : (
                    <>
                      <svg
                        className="w-6 h-6 mr-2"
                        width="800px"
                        height="800px"
                        viewBox="-0.5 0 48 48"
                        version="1.1"
                      >
                        {" "}
                        <title>Google-color</title>{" "}
                        <desc>Created with Sketch.</desc> <defs> </defs>{" "}
                        <g
                          id="Icons"
                          stroke="none"
                          stroke-width="1"
                          fill="none"
                          fill-rule="evenodd"
                        >
                          {" "}
                          <g
                            id="Color-"
                            transform="translate(-401.000000, -860.000000)"
                          >
                            {" "}
                            <g
                              id="Google"
                              transform="translate(401.000000, 860.000000)"
                            >
                              {" "}
                              <path
                                d="M9.82727273,24 C9.82727273,22.4757333 10.0804318,21.0144 10.5322727,19.6437333 L2.62345455,13.6042667 C1.08206818,16.7338667 0.213636364,20.2602667 0.213636364,24 C0.213636364,27.7365333 1.081,31.2608 2.62025,34.3882667 L10.5247955,28.3370667 C10.0772273,26.9728 9.82727273,25.5168 9.82727273,24"
                                id="Fill-1"
                                fill="#FBBC05"
                              >
                                {" "}
                              </path>{" "}
                              <path
                                d="M23.7136364,10.1333333 C27.025,10.1333333 30.0159091,11.3066667 32.3659091,13.2266667 L39.2022727,6.4 C35.0363636,2.77333333 29.6954545,0.533333333 23.7136364,0.533333333 C14.4268636,0.533333333 6.44540909,5.84426667 2.62345455,13.6042667 L10.5322727,19.6437333 C12.3545909,14.112 17.5491591,10.1333333 23.7136364,10.1333333"
                                id="Fill-2"
                                fill="#EB4335"
                              >
                                {" "}
                              </path>{" "}
                              <path
                                d="M23.7136364,37.8666667 C17.5491591,37.8666667 12.3545909,33.888 10.5322727,28.3562667 L2.62345455,34.3946667 C6.44540909,42.1557333 14.4268636,47.4666667 23.7136364,47.4666667 C29.4455,47.4666667 34.9177955,45.4314667 39.0249545,41.6181333 L31.5177727,35.8144 C29.3995682,37.1488 26.7323182,37.8666667 23.7136364,37.8666667"
                                id="Fill-3"
                                fill="#34A853"
                              >
                                {" "}
                              </path>{" "}
                              <path
                                d="M46.1454545,24 C46.1454545,22.6133333 45.9318182,21.12 45.6113636,19.7333333 L23.7136364,19.7333333 L23.7136364,28.8 L36.3181818,28.8 C35.6879545,31.8912 33.9724545,34.2677333 31.5177727,35.8144 L39.0249545,41.6181333 C43.3393409,37.6138667 46.1454545,31.6490667 46.1454545,24"
                                id="Fill-4"
                                fill="#4285F4"
                              >
                                {" "}
                              </path>{" "}
                            </g>{" "}
                          </g>{" "}
                        </g>{" "}
                      </svg>
                      <span> Google</span>
                    </>
                  )}
                </Button>

                <Button
                  type="submit"
                  variant={"white_btn"}
                  className="w-full text-black bg-white rounded-full relative flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-[#4537BA] border border-transparent rounded-full group hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  disabled={isSignInLoading}
                >
                  {isSignInLoading ? (
                    <Icon
                      height={20}
                      width={70}
                      icon="eos-icons:three-dots-loading"
                    />
                  ) : (
                    "Sign in"
                  )}
                </Button>
              </div>
            </div>
          </form>
          {/* <div className="text-sm text-center">
            <span className="text-gray-600">Don't have an account?</span>
            <Link
              href="/register"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              {" "}
              Sign up
            </Link>
          </div> */}
        </div>
      </div>
    </>
  );
};

export default LoginPage;
