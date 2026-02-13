"use client";
import UbahPasswordSection from "@/components/section/private/parent/profile/ubah-password/ubah-password";
import { SidebarLayout } from "@/core/layouts/sidebar.layout";
import useService from "@/hooks/mutation/prop.service";
import { useAppNameSpace } from "@/hooks/useAppNameSpace";
import { FormUpdatePassword } from "@/types/form/auth.form";
import { useState } from "react";

const UbahPasswordContainer = () => {
  const nameSpace = useAppNameSpace();
  const service = useService();
  //mutation
  const updatePasswordMutation = service.user.mutation.updatePassword();

  //state
  const [showPassword, setShowPassword] = useState({
    password: true,
    confirm: true,
  });
  const [formUpdatePassword, setFormUpdatePassword] =
    useState<FormUpdatePassword>({
      password: "",
    });
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  //handler
  const handleUpdatePassword = () => {
    if (confirmPassword !== formUpdatePassword.password) return null;
    updatePasswordMutation.mutate(formUpdatePassword, {
      onSuccess: () => {
        nameSpace.router.back();
      },
    });
  };
  return (
    <main className="w-full min-h-screen overflow-x-hidden">
      <UbahPasswordSection
        nameSpace={{
          router: nameSpace.router,
        }}
        state={{
          formUpdatePassword: formUpdatePassword,
          setFormUpdatePassword: setFormUpdatePassword,
          confirmPassword: confirmPassword,
          setConfirmPassword: setConfirmPassword,
          setShowPassword: setShowPassword,
          showPassword: showPassword,
        }}
        service={{
          mutation: {
            isPending: updatePasswordMutation.isPending,
            onUpdate: () => handleUpdatePassword(),
          },
        }}
      />
    </main>
  );
};

export default UbahPasswordContainer;
