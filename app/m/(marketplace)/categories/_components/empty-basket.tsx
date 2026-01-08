import React from "react";
import Image from "next/image";

const EmptyBasket = () => {
  return (
    <div className="relative flex flex-col items-center justify-center  bg-transparent pt-20">
      <div className="relative z-10 flex flex-col items-center">
        {" "}
        <p className="text-muted-foreground text-sm text-center w-[100px] font-light">
          Your gift basket is empty.
        </p>
        <div className="w-28 h-32  flex items-center justify-center mb-0">
          {" "}
          {/* Placeholder for basket icon - replace with actual image if available */}
          <Image
            src="https://res.cloudinary.com/drykej1am/image/upload/v1758537513/weeshr-marketplace/Group_ajyqqg.png" // Replace with your basket icon path
            alt="Basket Icon"
            width={200}
            height={240}
            className=""
          />
        </div>
      </div>
    </div>
  );
};

export default EmptyBasket;
