import { ReactNode } from "react";
import clsx from "clsx";

interface LayoutProps {
  children: ReactNode;
  narrow?: boolean;
  className?: string;
  fullWidthMobile?: boolean;
}

const WidthLayout: React.FC<LayoutProps> = ({
  children,
  narrow = false,
  className,
  fullWidthMobile = false,
}) => {
  const defaultClass = narrow
    ? fullWidthMobile
      ? "w-full md:w-[96%]"
      : "w-[96%]"
    : fullWidthMobile
    ? "w-full md:w-[92.50%]"
    : "w-[92.50%]";
  const extraLargeClass = narrow ? "2xl:w-[75%]" : "2xl:w-[80%]";

  return (
    <div
      className={clsx(
        defaultClass,
        extraLargeClass,
        "mx-auto 2xl:max-w-7xl lg:pt-16 flex flex-col flex-1",
        className
      )}
    >
      {children}
    </div>
  );
};

export default WidthLayout;
