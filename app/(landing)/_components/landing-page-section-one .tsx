import { TailwindcssButtons } from "@/components/commons/tailwind-buttons";

export const LandingPageSectionOne = () => {
  return (
    <div className="mx-auto  px-4 sm:px-6 lg:px-8 pb-0 text-center lg:pt-32 pt-14 space-y-9 lg:space-y-10">
      <h1 className="mx-auto max-w-4xl  text-5xl tracking-normal text-slate-900 sm:text-7xl font-normal ">
        <span className="inline-block">
          Send and receive gifts seamlessly on your
          <span className="relative whitespace-nowrap text-blue-600 pr-1">
            <span
              className={`relative whitespace-nowrap px-2 bg-gradient-custom bg-clip-text text-transparent text-4xl sm:text-5xl `}
              style={{ fontFamily: "Playwrite CU, sans-serif" }}
            >
              special days
            </span>
          </span>
          <span className="inline-block">& events</span>
        </span>
      </h1>

      <p className="mx-auto  max-w-4xl text-lg tracking-tight ">
        <span className="inline-block text-muted-foreground w-4/5 lg:w-[60%]">
          Weeshr helps you curate and share your wishlist with friends and family and allows the people that love fulfill or contribute towards your gift list
        </span>
      </p>

      <div className=" flex flex-col justify-center gap-y-5  sm:flex-row sm:gap-y-0 sm:gap-x-6">
        <TailwindcssButtons />
      </div>
    </div>
  );
};
