// err-interface-layout

import React, { FC, ReactNode } from "react";

interface InterfaceLayoutProps {
  children: ReactNode;
}

const InterfaceLayout: FC<InterfaceLayoutProps> = ({ children }) => {
  return (
    <div className="bg-[url('https://res.cloudinary.com/dufimctfc/image/upload/v1724865851/BGLong_hkaxwc.svg');]  bg-no-repeat bg-cover min-h-screen flex flex-col justify-between  bg-fixed">
      {children}
    </div>
  );
};

export default InterfaceLayout;
