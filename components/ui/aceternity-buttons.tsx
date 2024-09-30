"use client";
import React from "react";
// import { IconClipboard } from "@tabler/icons-react";
import { cn } from "@/lib/utils";

export const ButtonsCard = ({
  children,
  className,
  onClick,
}: {
  children?: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) => {
  return (
    <div onClick={onClick} className={cn("", className)}>
      <div className="" />
      <div className="relative ">{children}</div>
    </div>
  );
};
