"use client";
import { useState } from "react";

import LoginHeroSection from "@/components/section/auth/login-section";
import useService from "@/hooks/mutation/prop.service";
import { useAppNameSpace } from "@/hooks/useAppNameSpace";
import { FormLogin } from "@/types/form/auth.form";

const LoginContainer = () => {
  const nameSpace = useAppNameSpace();
  const [formLogin, setFormLogin] = useState<FormLogin>({
    identifier: "",
    password: "",
  });
  const service = useService();
  const login = service.auth.mutation.login();
  const loginGoogle = service.auth.mutation.loginGoogle();

  const handleLogin = () => {
    const payload: any = {
      password: formLogin.password,
    };
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formLogin.identifier);
    if (isEmail) {
      payload.email = formLogin.identifier;
    } else {
      payload.phone = formLogin.identifier;
    }
    login.mutate(payload, {
      onSuccess: (res) => {
        const baseRole = res.data.role;
        switch (baseRole) {
          case "PARENT":
            nameSpace.router.push("/parent/home");
            break;
          case "KADER":
            nameSpace.router.push("/kader/home");
            break;
          case "POSYANDU":
            nameSpace.router.push("/posyandu/home");
            break;
          case "ADMIN":
            nameSpace.router.push("/admin/home");
            break;
        }
      },
    });
  };

  const handleLoginGoogle = (code: string) => {
    loginGoogle.mutate(
      { code },
      {
        onSuccess: (res) => {
          const baseRole = res.data.role;
          console.log("login goole", baseRole);
          switch (baseRole) {
            case "PARENT":
              nameSpace.router.push("/parent/home");
              break;
            case "KADER":
              nameSpace.router.push("/kader/home");
              break;
            case "POSYANDU":
              nameSpace.router.push("/posyandu/home");
              break;
            case "ADMIN":
              nameSpace.router.push("/admin/home");
              break;
          }
        },
      }
    );
  };

  return (
    <main className="w-full min-h-screen overflow-x-hidden">
      <LoginHeroSection
        formLogin={formLogin}
        setFormLogin={setFormLogin}
        onLogin={() => handleLogin()}
        isPending={login.isPending}
        onLoginGoogle={handleLoginGoogle}
      />
    </main>
  );
};

export default LoginContainer;
