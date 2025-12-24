"use client";
import VerifyOtpHeroSection from "@/components/section/auth/verifyOtp-section";
import { useAppSelector } from "@/hooks/dispatch/dispatch";
import { useEffect } from "react";
const VerifyOtpContainer = () => {
  const curent = useAppSelector((state) => state.otp.email);
  useEffect(() => {
    console.log("data", curent);
  }, [curent]);
  return (
    <main className="w-full min-h-full">
      <VerifyOtpHeroSection />
    </main>
  );
};

export default VerifyOtpContainer;
