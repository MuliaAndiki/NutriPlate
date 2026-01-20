"use client";

import SplashHeroSection from "@/components/section/public/SplashHero";
import StepTwo from "@/components/section/public/SplashTwo";
import StepThree from "@/components/section/public/SplashTree";
import StepFour from "@/components/section/public/SplashFour";
import { useEffect, useState } from "react";
import StepFinal from "@/components/section/public/SplashFinal";

export default function ContainerHome() {
  const [showSplash, setShowSplash] = useState(true);
  const [step, setStep] = useState<"sp1" | "sp2" | "sp3" | "sp4" | "final">(
    "sp1",
  );

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
          setStep={setStep}
        />
      )}

      {step === "sp2" && <StepTwo setStep={setStep} />}
      {step === "sp3" && <StepThree setStep={setStep} />}
      {step === "sp4" && <StepFour setStep={setStep} />}
      {step === "final" && <StepFinal />}
    </main>
  );
}
