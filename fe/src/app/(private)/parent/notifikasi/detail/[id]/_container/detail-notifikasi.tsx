"use client";
import NotifikasiDetailSection from "@/components/section/private/parent/notifikasi/detail/notifikasi-detail-section";
import { SidebarLayout } from "@/core/layouts/sidebar.layout";
import useService from "@/hooks/mutation/prop.service";
import { useAppNameSpace } from "@/hooks/useAppNameSpace";
import { useDebugLog } from "@/utils/useDebug";
import { useParams } from "next/navigation";

const DetailNotifikasiContainer = () => {
  const namespace = useAppNameSpace();
  const service = useService();
  const { id } = useParams<{ id: string }>();
  const notifikasiQuery = service.notafication.query.getNotificationByID(id);
  const notifikasiData = notifikasiQuery.data?.data ?? null;

  useDebugLog(notifikasiData, [notifikasiQuery], {
    label: "here",
  });
  return (
    <SidebarLayout>
      <main className="w-full min-h-screen overflow-x-hidden">
        <NotifikasiDetailSection
          namespace={{
            router: namespace.router,
          }}
          service={{
            query: {
              isLoading: notifikasiQuery.isLoading,
              notifikasi: notifikasiData ?? null,
            },
          }}
        />
      </main>
    </SidebarLayout>
  );
};

export default DetailNotifikasiContainer;
