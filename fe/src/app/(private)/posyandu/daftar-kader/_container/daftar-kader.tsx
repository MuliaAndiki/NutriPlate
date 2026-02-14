"use client";
import DaftarKaderPosyanduSection from "@/components/section/private/posyandu/daftar-kader/daftar-kader-section";
import { SidebarLayout } from "@/core/layouts/sidebar.layout";
import useService from "@/hooks/mutation/prop.service";
import { useAppNameSpace } from "@/hooks/useAppNameSpace";

const DaftarKaderPosyanduContainer = () => {
  const namespace = useAppNameSpace();
  const servce = useService();
  const kaderQuery = servce.posyandu.query.getKaderList();
  const kaderData = kaderQuery.data?.data ?? [];

  return (
    <SidebarLayout>
      <main className="w-full min-h-screen">
        <DaftarKaderPosyanduSection
          namespace={{
            router: namespace.router,
          }}
          service={{
            query: {
              isLoading: kaderQuery.isLoading,
              kader: kaderData ?? [],
            },
          }}
        />
      </main>
    </SidebarLayout>
  );
};

export default DaftarKaderPosyanduContainer;
