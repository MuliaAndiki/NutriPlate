"use client";
import NotifikasiDetailSection from "@/components/section/private/parent/notifikasi/detail/notifikasi-detail-section";
import { SidebarLayout } from "@/core/layouts/sidebar.layout";
import useService from "@/hooks/mutation/prop.service";
import { useAppNameSpace } from "@/hooks/useAppNameSpace";

import { useParams } from "next/navigation";
import { useEffect } from "react";

const DetailNotifikasiContainer = () => {
  const namespace = useAppNameSpace();
  const service = useService();
  const { notifikasiID } = useParams<{ notifikasiID: string }>();

  //notifikasi
  const notifikasiQuery =
    service.notafication.query.getNotificationByID(notifikasiID);
  const notifikasiData = notifikasiQuery.data?.data ?? null;

  //read
  const readStatusQuery =
    service.notafication.query.isNotificationRead(notifikasiID);
  const isRead = readStatusQuery.data?.data?.isRead ?? false;

  const markAsReadMutation = service.notafication.mutation.markAsRead();

  useEffect(() => {
    if (notifikasiData && !isRead && notifikasiID) {
      return markAsReadMutation.mutate(notifikasiID);
    }
  }, [markAsReadMutation]);

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
