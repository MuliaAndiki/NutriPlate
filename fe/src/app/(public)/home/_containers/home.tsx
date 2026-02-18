"use client";

import SplashHeroSection from "@/components/section/public/splash/SplashHero";
import StepTwo from "@/components/section/public/splash/SplashTwo";
import StepThree from "@/components/section/public/splash/SplashTree";
import StepFour from "@/components/section/public/splash/SplashFour";
import { useEffect, useState } from "react";
import StepFinal from "@/components/section/public/splash/SplashFinal";

export default function ContainerHome() {
  const [showSplash, setShowSplash] = useState(true);
  const stepOrder = ["sp1", "sp2", "sp3", "sp4", "final"] as const;
  type Step = (typeof stepOrder)[number];
  const [step, setStep] = useState<Step>("sp1");
  const setStepSafe = (next: Step) => {
    setStep((current) => {
      const currentIndex = stepOrder.indexOf(current);
      const nextIndex = stepOrder.indexOf(next);
      if (nextIndex === currentIndex + 1 || nextIndex === currentIndex) {
        return next;
      }
      return current;
    });
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="w-full min-h-screen overflow-x-hidden">
      {step === "sp1" && (
        <SplashHeroSection
          showSplash={showSplash}
          step={step}
          setStep={setStepSafe}
        />
      )}

      {step === "sp2" && <StepTwo setStep={setStepSafe} />}
      {step === "sp3" && <StepThree setStep={setStepSafe} />}
      {step === "sp4" && <StepFour setStep={setStepSafe} />}
      {step === "final" && <StepFinal />}
    </main>
  );
}
