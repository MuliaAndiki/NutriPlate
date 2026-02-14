"use client";

import NotifikasiDetailPosyanduSection from "@/components/section/private/posyandu/notifikasi/detail/notifikasi-detail-section";
import { SidebarLayout } from "@/core/layouts/sidebar.layout";
import useService from "@/hooks/mutation/prop.service";
import { useAppNameSpace } from "@/hooks/useAppNameSpace";
import { useParams } from "next/navigation";

const DetailNotifikasiPosyanduContainer = () => {
  const namespace = useAppNameSpace();
  const service = useService();
  const { notifikasiID } = useParams<{ notifikasiID: string }>();

  const notifikasiQuery =
    service.notafication.query.getNotificationByID(notifikasiID);
  const notifikasiData = notifikasiQuery.data?.data ?? null;

  const broadcastMutation = service.notafication.mutation.broadcast();

  const handleBroadcast = () => {
    if (!notifikasiID) return null;
    broadcastMutation.mutate(notifikasiID);
  };

  return (
    <SidebarLayout>
      <main className="w-full min-h-screen overflow-x-hidden">
        <NotifikasiDetailPosyanduSection
          namespace={{
            router: namespace.router,
            alert: namespace.alert,
          }}
          service={{
            query: {
              notifikasi: notifikasiData ?? null,
              isLoading: notifikasiQuery.isLoading,
            },
            mutation: {
              onBroadcast: handleBroadcast,
              isPending: broadcastMutation.isPending,
            },
          }}
        />
      </main>
    </SidebarLayout>
  );
};

export default DetailNotifikasiPosyanduContainer;
