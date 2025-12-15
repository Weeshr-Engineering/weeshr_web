// err-interface-layout

import React, { FC, ReactNode } from "react";

interface InterfaceLayoutProps {
  children: ReactNode;
}

const InterfaceLayout: FC<InterfaceLayoutProps> = ({ children }) => {
  return (
    <div className="bg-[url('https://res.cloudinary.com/drykej1am/image/upload/v1727678040/weeshr_website/Home_W-BG_lshut6.png');]   bg-no-repeat bg-cover min-h-screen flex flex-col justify-between  bg-fixed">
      {children}
    </div>
  );
};

export default InterfaceLayout;
