"use client";
import { useEffect, useState } from "react";

import ResetPasswordHeroSection from "@/components/section/auth/resetPassword-section";
import useService from "@/hooks/mutation/prop.service";
import { useAppNameSpace } from "@/hooks/useAppNameSpace";
import { FormResetPassword } from "@/types/form/auth.form";
import { useSearchParams } from "next/navigation";

const ResetPasswordContainer = () => {
  const nameSpace = useAppNameSpace();
  const searchParams = useSearchParams();
  const identifier = searchParams.get("identifier");

  const [formResetPassword, setFormResetPassword] = useState<FormResetPassword>(
    {
      identifier: "",
      password: "",
    },
  );

  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const service = useService();
  const resetPassword = service.auth.mutation.resetPassword();

  useEffect(() => {
    if (!identifier) {
      nameSpace.router.replace("/login");
      return;
    }

    setFormResetPassword((prev) => ({
      ...prev,
      identifier: identifier,
      password: "",
    }));
  }, [identifier]);

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
      formResetPassword.identifier,
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
