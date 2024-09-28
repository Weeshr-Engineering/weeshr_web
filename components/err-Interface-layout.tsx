// err-interface-layout

import React, { FC, ReactNode } from "react";

interface InterfaceLayoutProps {
  children: ReactNode;
}

const InterfaceLayout: FC<InterfaceLayoutProps> = ({ children }) => {
  return (
    <div className="bg-[url('https://res.cloudinary.com/dufimctfc/image/upload/v1724865851/BGLong_hkaxwc.svg')] md:bg-primary bg-no-repeat bg-cover  h-auto flex flex-col justify-between">
    {children}
  </div>
  );
};

export default InterfaceLayout;
