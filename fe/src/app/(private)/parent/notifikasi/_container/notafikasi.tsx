"use client";
import NotifikasiParentSection from "@/components/section/private/parent/notifikasi/notifikasi-section";
import { SidebarLayout } from "@/core/layouts/sidebar.layout";
import useService from "@/hooks/mutation/prop.service";
import { useAppNameSpace } from "@/hooks/useAppNameSpace";
import { NotifTypeInterface } from "@/types/partial";
import { useState, useEffect } from "react";
import { useAuthentic } from "@/hooks/useAuthentic";

const NotafikasiParentContainer = () => {
  const namespace = useAppNameSpace();
  const service = useService();
  const { token } = useAuthentic();
  const notifikasiQuery = service.notafication.query.getNotification(token);
  const notifikasiData = notifikasiQuery.data?.data ?? [];

  const [filtered, setFiltered] = useState<"Read" | "NotRead">("NotRead");
  const [selectTypes, setSelectedTypes] = useState<NotifTypeInterface[]>([]);

  const [readStatus, setReadStatus] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchReadStatus = async () => {
      const statuses: Record<string, boolean> = {};
      for (const notif of notifikasiData) {
        try {
          const readStatusQuery = service.notafication.query.isNotificationRead(
            notif.id,
          );

          if (readStatusQuery.data?.data?.isRead !== undefined) {
            statuses[notif.id] = readStatusQuery.data.data.isRead;
          } else {
            statuses[notif.id] = false;
          }
        } catch (error) {
          console.warn("Failed to fetch read status:", error);
          statuses[notif.id] = false;
        }
      }
      setReadStatus(statuses);
    };

    if (notifikasiData.length > 0) {
      fetchReadStatus();
    }
  }, [notifikasiData, service]);

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

export default NotafikasiParentContainer;
