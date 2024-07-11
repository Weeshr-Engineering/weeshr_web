"use client";

import React from "react";

const ErrorPage = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full h-screen bg-[#F8F9FF] p-4">
      <img
        className="mb-4"
        src="https://res.cloudinary.com/dufimctfc/image/upload/v1719761079/errorpage_kkjhkb.svg"
        alt="gradient"
      />
      <div className="flex flex-col items-center justify-center mb-5 text-center">
        <p className="text-2xl font-bold text-[#111827] md:text-3xl lg:text-4xl">
          Page not Found
        </p>
        <p className="mt-4 text-sm text-[#6B7280] md:text-lg lg:text-xl">
          Oops! Looks like you followed a bad link. If you think this is a problem with us, please tell us.
        </p>
      </div>
    </div>
  );
};

export default ErrorPage;
