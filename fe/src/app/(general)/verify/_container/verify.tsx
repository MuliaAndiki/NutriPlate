"use client";
import { useEffect, useState } from "react";

import VerifyOtpHeroSection from "@/components/section/auth/verifyOtp-section";
import useService from "@/hooks/mutation/prop.service";
import { useAppNameSpace } from "@/hooks/useAppNameSpace";
import { useSearchParams } from "next/navigation";
import { FormVerify } from "@/types/form/auth.form";

const VerifyContainer = () => {
  const nameSpace = useAppNameSpace();
  const searchParams = useSearchParams();
  const identifier = searchParams.get("identifier");
  const target = searchParams.get("target");

  const [formVerifyOtp, setFormVerifyOtp] = useState<FormVerify>({
    email: "",
    otp: "",
  });
  const [colldown, setColldown] = useState<number>(0);
  const service = useService();
  const verifikasi = service.auth.mutation.verifyOtp();
  const resend = service.auth.mutation.resend();
  const hash = identifier?.slice(-12);

  if (!identifier || !target) {
    // not fix
    nameSpace.router.replace("/login");
    return null;
  }
  const handleVerfiyOtp = () => {
    verifikasi.mutate(formVerifyOtp, {
      onSuccess: () => {
        nameSpace.router.push(`${target}`);
      },
    });
  };

  const handleResend = () => {
    resend.mutate(
      {
        email: identifier ?? "",
      },
      {
        onSuccess: () => {
          setColldown(300);
        },
      }
    );
  };

  useEffect(() => {
    if (colldown <= 0) return;
    const interfal = setInterval(() => {
      setColldown((prev) => {
        if (prev <= 0) {
          clearInterval(interfal);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interfal);
  }, [colldown]);

  useEffect(() => {
    setFormVerifyOtp((prev) => ({
      ...prev,
      email: identifier,
      otp: "",
    }));
  }, [identifier]);

  return (
    <main className="w-full min-h-full">
      <VerifyOtpHeroSection
        formVerifyOtp={formVerifyOtp}
        setFormVerifyOtp={setFormVerifyOtp}
        isPending={verifikasi.isPending}
        onVerify={() => handleVerfiyOtp()}
        colldown={colldown}
        resendOtp={() => handleResend()}
        hashIdentifer={hash!}
      />
    </main>
  );
};

export default VerifyContainer;
