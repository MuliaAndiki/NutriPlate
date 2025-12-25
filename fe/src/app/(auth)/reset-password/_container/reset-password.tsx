"use client";
import { useState } from "react";

import ResetPasswordHeroSection from "@/components/section/auth/resetPassword-section";
import { useAppSelector } from "@/hooks/dispatch/dispatch";
import useService from "@/hooks/mutation/prop.service";
import { useAppNameSpace } from "@/hooks/useAppNameSpace";
import { FormResetPassword } from "@/types/form/auth.form";

const ResetPasswordContainer = () => {
  const nameSpace = useAppNameSpace();
  const { email, phone } = useAppSelector((state) => state.otp);
  const [formResetPassword, setFormResetPassword] = useState<FormResetPassword>(
    {
      identifier: email! ? email! : phone!,
      password: "",
    }
  );
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const service = useService();
  const resetPassword = service.auth.mutation.resetPassword();

  const handleResetPassword = () => {
    if (confirmPassword !== formResetPassword.password) {
      nameSpace.alert.toast({
        title: "warning",
        message: "colum password & confirm tidak sama",
        icon: "warning",
      });
      return;
    }
    const payload: any = {
      password: formResetPassword.password,
    };
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
      formResetPassword.identifier
    );
    if (isEmail) {
      payload.email = formResetPassword.identifier;
    } else {
      payload.phone = formResetPassword.identifier;
    }

    resetPassword.mutate(payload, {
      onSuccess: () => {
        nameSpace.router.push("/login");
      },
    });
  };
  return (
    <main className="w-full min-h-screen">
      <ResetPasswordHeroSection
        router={nameSpace.router}
        confirmPassword={confirmPassword}
        setConfirmPassword={setConfirmPassword}
        formResetPassword={formResetPassword}
        setFormResetPassword={setFormResetPassword}
        isPending={resetPassword.isPending}
        onReset={() => handleResetPassword()}
      />
    </main>
  );
};

export default ResetPasswordContainer;
