"use client";
import NotifikasiParentSection from "@/components/section/private/parent/notifikasi/notifikasi-section";
import { SidebarLayout } from "@/core/layouts/sidebar.layout";
import useService from "@/hooks/mutation/prop.service";
import { useAppNameSpace } from "@/hooks/useAppNameSpace";
import { useDebugLog } from "@/utils/useDebug";

const NotafikasiParentContainer = () => {
  const namespace = useAppNameSpace();
  const service = useService();
  const notifikasiQuery = service.notafication.query.getNotification();
  const notifikasiData = notifikasiQuery.data?.data ?? [];

  useDebugLog(notifikasiData, [notifikasiQuery], { label: "here" });
  return (
    <SidebarLayout>
      <main className="w-full overflow-x-hidden min-h-screen">
        <NotifikasiParentSection
          namespace={{
            router: namespace.router,
          }}
          service={{
            query: {
              notifikasi: notifikasiData ?? [],
              isLoading: notifikasiQuery.isLoading,
            },
          }}
        />
      </main>
    </SidebarLayout>
  );
};

export default NotafikasiParentContainer;
