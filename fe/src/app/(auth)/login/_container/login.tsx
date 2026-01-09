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
  const loginMutation = service.auth.mutation.login();
  const loginGoogleMutation = service.auth.mutation.loginGoogle();

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
    loginMutation.mutate(payload, {
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
    loginGoogleMutation.mutate(
      { code },
      {
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
      }
    );
  };

  return (
    <main className="w-full min-h-screen overflow-x-hidden">
      <LoginHeroSection
        service={{
          mutation: {
            isPending: loginGoogleMutation.isPending || loginMutation.isPending,
            onLogin: () => handleLogin(),
            onLoginGoogle: handleLoginGoogle,
          },
        }}
        state={{
          formLogin: formLogin,
          setFormLogin: setFormLogin,
        }}
      />
    </main>
  );
};

export default LoginContainer;
