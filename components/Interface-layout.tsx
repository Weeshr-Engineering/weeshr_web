

import React, { FC, ReactNode } from "react";

interface InterfaceLayoutProps {
  children: ReactNode;
}

const InterfaceLayout: FC<InterfaceLayoutProps> = ({ children }) => {
  return (
    <div className="bg-white md:bg-primary md:bg-[url('https://res.cloudinary.com/drykej1am/image/upload/v1721040197/weehser%20pay/wtktvvjoepkr1zfk0a8q.png');] bg-no-repaet  bg-cover">
      {children}
    </div>
  );
};

export default InterfaceLayout;
