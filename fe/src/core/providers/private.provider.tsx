import { redirect } from "next/navigation";

import { authValidator } from "@/services/module/auth/auth.store";

import { ClientGate } from "./client-gate";

export default async function PrivateProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  const isAuth = await authValidator();

  if (!isAuth) {
    redirect("/login");
  }

  return (
    <>
      <ClientGate>{children}</ClientGate>
    </>
  );
}
