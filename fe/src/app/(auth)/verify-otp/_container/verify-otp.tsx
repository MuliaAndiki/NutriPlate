"use client";
import VerifyOtpHeroSection from "@/components/section/auth/verifyOtp-section";
import { useAppSelector } from "@/hooks/dispatch/dispatch";
import useService from "@/hooks/mutation/prop.service";
import { useAppNameSpace } from "@/hooks/useAppNameSpace";
import { clearOtp } from "@/stores/otpSlice/otpSlice";
import { FormVerify } from "@/types/form/auth.form";
import { useEffect, useState } from "react";

const VerifyOtpContainer = () => {
  const nameSpace = useAppNameSpace();
  const { email, soure } = useAppSelector((state) => state.otp);
  const [formVerifyOtp, setFormVerifyOtp] = useState<FormVerify>({
    email: email!,
    otp: "",
  });
  const [colldown, setColldown] = useState<number>(0);
  const service = useService();
  const verifikasi = service.auth.mutation.useVerify();
  const resend = service.auth.mutation.useResend();
  const hash = email?.slice(-12);
  const handleVerfiyOtp = () => {
    if (soure === "Register") {
      verifikasi.mutate(formVerifyOtp, {
        onSuccess: () => {
          nameSpace.router.push("/login");
          nameSpace.dispatch(clearOtp());
        },
      });
    } else if (soure === "Forgot-Password") {
      verifikasi.mutate(formVerifyOtp, {
        onSuccess: () => {
          nameSpace.router.push("/reset-password");
        },
      });
    } else {
      // Callback Ui
      return null;
    }
  };

  const handleResend = () => {
    resend.mutate(
      {
        email: email ?? "",
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

export default VerifyOtpContainer;
