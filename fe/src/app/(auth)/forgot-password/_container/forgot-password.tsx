"use client";
import { useState } from "react";
import ForgotPasswordHeroSection from "../../../../components/section/auth/fotgotPassword-section";
import { FormForgotPassword } from "@/types/form/auth.form";
import useService from "@/hooks/mutation/prop.service";
import { useAppNameSpace } from "@/hooks/useAppNameSpace";

const ForgotPasswordContainer = () => {
  const [formForgotPassword, setFormForgotPassword] =
    useState<FormForgotPassword>({
      identifier: "",
    });
  const service = useService();
  const forgot = service.auth.mutation.useForgotPasswsord();
  const nameSpace = useAppNameSpace();
  const handleForgotPassword = () => {
    const payload: any = {};
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
      formForgotPassword.identifier
    );
    if (isEmail) {
      payload.email = formForgotPassword.identifier;
    } else {
      payload.phone = formForgotPassword.identifier;
    }

    forgot.mutate(payload);
  };
  return (
    <main className="w-full min-h-screen">
      <ForgotPasswordHeroSection
        formForgotPassword={formForgotPassword}
        isPending={forgot.isPending}
        setFormForgotPassword={setFormForgotPassword}
        onForgot={() => handleForgotPassword()}
        router={nameSpace.router}
      />
    </main>
  );
};

export default ForgotPasswordContainer;
