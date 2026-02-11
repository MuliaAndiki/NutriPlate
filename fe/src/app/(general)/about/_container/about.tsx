"use client";

import AboutSoftwareSection from "@/components/section/general/about/about-section";
import { useAppNameSpace } from "@/hooks/useAppNameSpace";

const AboutSoftwareContainer = () => {
  const namespace = useAppNameSpace();
  return (
    <main className="w-full min-h-screen">
      <AboutSoftwareSection
        namespace={{
          router: namespace.router,
        }}
      />
    </main>
  );
};

export default AboutSoftwareContainer;
