"use client";
import DaftarKaderPosyanduSection from "@/components/section/private/posyandu/daftar-kader/daftar-kader-section";
import { SidebarLayout } from "@/core/layouts/sidebar.layout";
import { useAppNameSpace } from "@/hooks/useAppNameSpace";

const DaftarKaderPosyanduContainer = () => {
  const namespace = useAppNameSpace();
  return (
    <SidebarLayout>
      <main className="w-full min-h-screen">
        <DaftarKaderPosyanduSection
          namespace={{
            router: namespace.router,
          }}
        />
      </main>
    </SidebarLayout>
  );
};

export default DaftarKaderPosyanduContainer;
