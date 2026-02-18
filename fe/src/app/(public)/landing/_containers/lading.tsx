import AboutSection from "@/components/section/public/landing/about-section";
import CtaSection from "@/components/section/public/landing/cta-section";
import HeroSection from "@/components/section/public/landing/hero-section";
import SaySection from "@/components/section/public/landing/say-section";
import SolutionSection from "@/components/section/public/landing/solution-section";
import StartSection from "@/components/section/public/landing/start-section";
import WhySection from "@/components/section/public/landing/why-section";
import NavLayout from "@/core/layouts/nav.layout";

const LandingContainer = () => {
  return (
    <NavLayout>
      <main className="w-full min-h-screen  ">
        <HeroSection />
        <AboutSection />
        <WhySection />
        <SolutionSection />
        <SaySection />
        <StartSection />
        <CtaSection />
      </main>
    </NavLayout>
  );
};

export default LandingContainer;
