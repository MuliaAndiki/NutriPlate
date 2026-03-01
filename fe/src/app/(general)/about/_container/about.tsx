"use client";
import AboutSoftwareSection from "@/components/section/general/about/about-section";
import { useAppNameSpace } from "@/hooks/useAppNameSpace";

const AboutSoftwareContainer = () => {
  const namespace = useAppNameSpace();
  return (
    <AboutSoftwareSection
      namespace={{
        router: namespace.router,
      }}
    />
  );
};

export default AboutSoftwareContainer;
