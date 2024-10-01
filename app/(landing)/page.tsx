import WidthLayout from "@/components/commons/width-layout";
import { LandingPageSectionOne } from "./_components/landing-page-section-one ";
import { LandingPageSectionTwo } from "./_components/landing-page-section-two";
import { LandingPageSectionThree } from "./_components/landing-page-section-three";

const LandingPage = () => {
  return (
    <div>
      <LandingPageSectionOne />
      <LandingPageSectionTwo />
      <LandingPageSectionThree />
    </div>
  );
};

export default LandingPage;
