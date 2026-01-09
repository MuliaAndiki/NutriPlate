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
  const updatePasswordMutation = service.user.mutation.updatePassword();
  const [showPassword, setShowPassword] = useState({
    password: true,
    confirm: true,
  });
  const [formUpdatePassword, setFormUpdatePassword] =
    useState<FormUpdatePassword>({
      password: "",
    });
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const handleUpdatePassword = () => {
    if (confirmPassword !== formUpdatePassword.password) return null;
    updatePasswordMutation.mutate(formUpdatePassword, {
      onSuccess: () => {
        nameSpace.router.back();
      },
    });
  };
  return (
    <SidebarLayout>
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
            isPending: updatePasswordMutation.isPending,
            onUpdate: () => handleUpdatePassword(),
          }}
        />
      </main>
    </SidebarLayout>
  );
};

export default UbahPasswordContainer;
