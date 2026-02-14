"use client";
import { useState } from "react";

import RegisterHeroSection from "@/components/section/auth/register-section";
import useService from "@/hooks/mutation/prop.service";
import { useAppNameSpace } from "@/hooks/useAppNameSpace";
import { FormRegister } from "@/types/form/auth.form";

const RegisterContainer = () => {
  const nameSpace = useAppNameSpace();
  const [formRegister, setFormRegister] = useState<FormRegister>({
    fullName: "",
    identifier: "",
    password: "",
    role: "",
  });

  const service = useService();
  const registerMutation = service.auth.mutation.register();
  const loginGoogleMutation = service.auth.mutation.loginGoogle();
  const handleRegister = () => {
    const payload: any = {
      fullName: formRegister.fullName,
      password: formRegister.password,
      role: formRegister.role,
    };

    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formRegister.identifier);
    if (isEmail) {
      payload.email = formRegister.identifier;
    } else {
      payload.phone = formRegister.identifier;
    }

    registerMutation.mutate(payload);
  };

  const handleLoginGoogle = (code: string) => {
    loginGoogleMutation.mutate(
      {
        code,
      },
      {
        onSuccess: (res) => {
          const baseRole = res.data.role;
          switch (baseRole) {
            case "PARENT":
              return nameSpace.router.push("/parent/home");
            case "KADER":
              return nameSpace.router.push("/kader/home");
            case "POSYANDU":
              return nameSpace.router.push("/posyandu/home");
            case "ADMIN":
              return nameSpace.router.push("/admin/home");
          }
        },
      },
    );
  };
  return (
    <main className="w-full min-h-screen ">
      <RegisterHeroSection
        service={{
          mutation: {
            isPending:
              registerMutation.isPending || loginGoogleMutation.isPending,
            onLoginGoogle: handleLoginGoogle,
            onRegister: () => handleRegister(),
          },
        }}
        state={{
          formRegister: formRegister,
          setFormRegister: setFormRegister,
        }}
      />
    </main>
  );
};
export default RegisterContainer;
