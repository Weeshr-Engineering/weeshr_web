"use client";
import React from "react";
import { ButtonsCard } from "../ui/aceternity-buttons";
import Link from "next/link";

interface ButtonProps {
  svgIcon: React.ReactNode;
  topText: string;
  bottomText: string;
}

const ButtonComponent: React.FC<ButtonProps> = ({
  svgIcon,
  topText,
  bottomText,
}) => (
  <button className="px-3 py-2 rounded-lg w-full md:w-48 bg-primary/60 text-white text-sm hover:shadow-[4px_4px_0px_0px_rgba(2,7,33)] transition duration-200 flex justify-center  md:justify-start items-center min-w-52">
    <div className="mr-3">{svgIcon}</div>
    <div>
      <div className="text-xs w-full text-left  font-light">{topText}</div>
      <div className="-mt-1 text-xl  font-light">{bottomText}</div>
    </div>
  </button>
);

export function TailwindcssButtons() {
  return (
    <div className=" ">
      <div className="flex w-full justify-center gap-3 md:flex-row flex-col items-center">
        {buttons.map((button, idx) => (
          <a
            href={button.href}
            key={idx}
            target="_blank"
            rel="noopener noreferrer"
          >
            <ButtonsCard>{button.component}</ButtonsCard>{" "}
          </a>
        ))}
      </div>
    </div>
  );
}

const AppStoreIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="40"
    height="40"
    viewBox="0 0 512 512"
  >
    <path
      fill="currentColor"
      d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"
    ></path>
  </svg>
);

const GooglePlayIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="40"
    height="40"
    viewBox="0 0 512 512"
  >
    <path
      fill="white"
      d="M48 59.49v393a4.33 4.33 0 0 0 7.37 3.07L260 256L55.37 56.42A4.33 4.33 0 0 0 48 59.49M345.8 174L89.22 32.64l-.16-.09c-4.42-2.4-8.62 3.58-5 7.06l201.13 192.32ZM84.08 472.39c-3.64 3.48.56 9.46 5 7.06l.16-.09L345.8 338l-60.61-57.95ZM449.38 231l-71.65-39.46L310.36 256l67.37 64.43L449.38 281c19.49-10.77 19.49-39.23 0-50"
    />
  </svg>
);

export const buttons = [
  {
    name: "App Store",
    description: "App Store button for your website",
    component: (
      <ButtonComponent
        svgIcon={AppStoreIcon}
        topText="Download on the"
        bottomText="App Store"
      />
    ),
    href: "https://apps.apple.com/ng/app/weeshr/id6602884408",
  },
  {
    name: "Google Play",
    description: "Google Play button for your website",
    component: (
      <ButtonComponent
        svgIcon={GooglePlayIcon}
        topText="Get it on"
        bottomText="Google Play"
      />
    ),
    href: "https://play.google.com/store/apps/details?id=com.app.weeshr&pcampaignid=web_share",
  },
];
