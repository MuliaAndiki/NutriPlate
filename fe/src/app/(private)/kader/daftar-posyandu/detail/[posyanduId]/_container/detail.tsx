"use client";
import DetailPosyanduKaderSection from "@/components/section/private/kader/daftar-posyandu/detail/detail-posyandu-section";
import { SidebarLayout } from "@/core/layouts/sidebar.layout";
import useService from "@/hooks/mutation/prop.service";
import { useAppNameSpace } from "@/hooks/useAppNameSpace";
import { useParams } from "next/navigation";

const DetailPosyanduKaderContainer = () => {
  const namespace = useAppNameSpace();
  const service = useService();
  const { posyanduId } = useParams<{ posyanduId: string }>();
  const posyandubyIdQuery = service.posyandu.query.getPosyanduById(posyanduId);
  const posyandubyIdData = posyandubyIdQuery.data?.data ?? null;

  return (
    <SidebarLayout>
      <main className="w-full min-h-screen">
        <DetailPosyanduKaderSection
          namespace={{
            router: namespace.router,
          }}
          service={{
            query: {
              isLoading: posyandubyIdQuery.isLoading,
              posyandu: posyandubyIdData ?? null,
            },
          }}
        />
      </main>
    </SidebarLayout>
  );
};

export default DetailPosyanduKaderContainer;
