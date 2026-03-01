"use client";
import DaftarKaderPosyanduSection from "@/components/section/private/posyandu/daftar-kader/daftar-kader-section";
import { SidebarLayout } from "@/core/layouts/sidebar.layout";
import useService from "@/hooks/mutation/prop.service";
import { useAppNameSpace } from "@/hooks/useAppNameSpace";
import { useState } from "react";

const DaftarKaderPosyanduContainer = () => {
  const namespace = useAppNameSpace();
  const service = useService();

  //mutation
  const deleteKaderMutation = service.registerKader.mutation.deleteKader();

  //kader
  const kaderQuery = service.posyandu.query.getKaderList();
  const kaderData = kaderQuery.data?.data ?? [];

  //state
  const [registerKaderID, setRegisterKaderID] = useState<string>("");

  //handler
  const handleDeleteKader = () => {
    if (!registerKaderID) return null;

    deleteKaderMutation.mutate(registerKaderID);
  };

  return (
    <SidebarLayout>
      <main className="w-full min-h-screen">
        <DaftarKaderPosyanduSection
          namespace={{
            router: namespace.router,
            alert: namespace.alert,
          }}
          service={{
            query: {
              isLoading: kaderQuery.isLoading,
              kader: kaderData ?? [],
            },
            mutation: {
              onDelete: handleDeleteKader,
            },
          }}
          state={{
            setRegisterdKaderId: setRegisterKaderID,
          }}
        />
      </main>
    </SidebarLayout>
  );
};

export default DaftarKaderPosyanduContainer;
