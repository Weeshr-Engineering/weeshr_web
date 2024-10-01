import Image from "next/image";

export const LandingPageSectionTwo = () => {
  return (
    <div className="relative flex items-center justify-center md:pt-20">
      <Image
        src="https://res.cloudinary.com/drykej1am/image/upload/v1727713418/weeshr_website/1_tsukgg.png"
        alt="Hero Image"
        width={200} // Adjust based on your design
        height={100} // Adjust based on your design
        className="md:hidden w-full object-cover" // Hide this on md and larger screens
      />
      <Image
        src="https://res.cloudinary.com/drykej1am/image/upload/v1727712591/weeshr_website/2_mwuork.png"
        alt="Hero Image"
        width={500} // Adjust based on your design
        height={500} // Adjust based on your design
        className="hidden md:block object-cover lg:w-[600px]" // Show this on md and larger screens
      />
    </div>
  );
};
