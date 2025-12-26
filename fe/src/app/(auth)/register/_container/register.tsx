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
  const registered = service.auth.mutation.register();
  const loginGoogle = service.auth.mutation.loginGoogle();
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

    registered.mutate(payload);
  };

  const handleLoginGoogle = (code: string) => {
    loginGoogle.mutate(
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
      }
    );
  };
  return (
    <main className="w-full min-h-screen ">
      <RegisterHeroSection
        formRegister={formRegister}
        setFormRegister={setFormRegister}
        isPending={registered.isPending || loginGoogle.isPending}
        onRegister={() => handleRegister()}
        router={nameSpace.router}
        onLoginGoogle={handleLoginGoogle}
      />
    </main>
  );
};
export default RegisterContainer;
