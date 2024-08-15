"use client";

import React from "react";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";

const LoginPage = () => {
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
          className="absolute mx-auto top-24"
        />

        <div className="w-full p-8 px-6 space-y-8 rounded-lg shadow-md bg-gradient-to-t from-gray-100 via-white/80 to-white/0">
          <div className="flex flex-col w-full bg-white/90 blur-[10] rounded-lg p-3 space-y-2">
            <h4 className="font-semibold text-black">Weeshr Gist</h4>
            <div className="text-[#020721] text-sm">
              <p className="">
                If wishes were horses, we'd all be riding unicorns to work or
                not because my wish this morning is to sleep in.
              </p>
              <span className="text-[#3A8EE5]">
                #WishfulThinking #UnicornCommute #Weeshr
              </span>
            </div>
          </div>
          <form className="mt-8 space-y-6">
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

            <div className="pt-6 pb-10" >
              <button
                type="submit"
                className="relative flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-[#4537BA] border border-transparent rounded-full group hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Sign in
              </button>
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
