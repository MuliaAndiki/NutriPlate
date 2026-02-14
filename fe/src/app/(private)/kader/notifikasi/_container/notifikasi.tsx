"use client";
import NotifikasiKaderSection from "@/components/section/private/kader/notifikasi/notifikasi-section";

import { SidebarLayout } from "@/core/layouts/sidebar.layout";
import { useAppSelector } from "@/hooks/dispatch/dispatch";
import useService from "@/hooks/mutation/prop.service";
import { useAppNameSpace } from "@/hooks/useAppNameSpace";
import { NotifTypeInterface } from "@/types/partial";
import { useState, useEffect } from "react";
import Api from "@/services/props.module";

const NotafikasiKaderContainer = () => {
  const namespace = useAppNameSpace();
  const service = useService();
  const selector = useAppSelector((state) => state.posyandu);

  //notafikasi
  const notifikasiQuery = service.notafication.query.getNotification(
    selector.token!,
  );
  const notifikasiData = notifikasiQuery.data?.data ?? [];

  const [filtered, setFiltered] = useState<"Read" | "NotRead">("NotRead");
  const [selectTypes, setSelectedTypes] = useState<NotifTypeInterface[]>([]);

  const [readStatus, setReadStatus] = useState<Record<string, boolean>>({});

  useEffect(() => {
    let isMounted = true;
    const fetchReadStatus = async () => {
      if (notifikasiData.length === 0) {
        if (isMounted) setReadStatus({});
        return;
      }

      const statuses: Record<string, boolean> = {};
      await Promise.all(
        notifikasiData.map(async (notif: any) => {
          try {
            const res = await Api.Notification.isNotificationRead(notif.id);
            statuses[notif.id] = res?.data?.isRead ?? false;
          } catch (error) {
            console.warn("Failed to fetch read status:", error);
            statuses[notif.id] = false;
          }
        }),
      );

      if (isMounted) setReadStatus(statuses);
    };

    fetchReadStatus();
    return () => {
      isMounted = false;
    };
  }, [notifikasiData]);

  return (
    <SidebarLayout>
      <main className="w-full overflow-x-hidden min-h-screen">
        <NotifikasiKaderSection
          namespace={{
            router: namespace.router,
          }}
          service={{
            query: {
              notifikasi: notifikasiData ?? [],
              isLoading: notifikasiQuery.isLoading,
            },
          }}
          state={{
            filter: filtered,
            setFilter: setFiltered,
            selectedTypes: selectTypes,
            setSelectedTypes: setSelectedTypes,
          }}
          readStatus={readStatus}
        />
      </main>
    </SidebarLayout>
  );
};

export default NotafikasiKaderContainer;
