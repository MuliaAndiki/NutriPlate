"use client";

import NotifikasiAdminSection from "@/components/section/private/admin/notifikasi/notifikasi-section";
import { SidebarLayout } from "@/core/layouts/sidebar.layout";
import { useAppSelector } from "@/hooks/dispatch/dispatch";
import useService from "@/hooks/mutation/prop.service";
import { NotifTypeInterface } from "@/types/partial";
import { INotification } from "@/types/schema";
import { useEffect, useState } from "react";
import Api from "@/services/props.module";

const NotifikasiAdminContainer = () => {
  const service = useService();
  const selector = useAppSelector((state) => state.posyandu);

  const notificationQuery = service.notafication.query.getNotification(
    selector.token!,
  );
  const notificationData = notificationQuery.data?.data ?? [];

  const [filter, setFilter] = useState<"Read" | "NotRead">("NotRead");
  const [selectedTypes, setSelectedTypes] = useState<NotifTypeInterface[]>([]);
  const [readStatus, setReadStatus] = useState<Record<string, boolean>>({});

  useEffect(() => {
    let isMounted = true;

    const fetchReadStatus = async () => {
      if (notificationData.length === 0) {
        if (isMounted) setReadStatus({});
        return;
      }

      const statuses: Record<string, boolean> = {};

      await Promise.all(
        notificationData.map(async (notif: INotification) => {
          try {
            const res = await Api.Notification.isNotificationRead(notif.id);
            statuses[notif.id] = res?.data?.isRead ?? notif.isRead ?? false;
          } catch {
            statuses[notif.id] = notif.isRead ?? false;
          }
        }),
      );

      if (isMounted) setReadStatus(statuses);
    };

    fetchReadStatus();

    return () => {
      isMounted = false;
    };
  }, [notificationData]);

  return (
    <SidebarLayout>
      <main className="w-full min-h-screen overflow-x-hidden">
        <NotifikasiAdminSection
          service={{
            query: {
              isLoading: notificationQuery.isLoading,
              notifikasi: notificationData,
            },
          }}
          state={{
            filter,
            setFilter,
            selectedTypes,
            setSelectedTypes,
          }}
          readStatus={readStatus}
        />
      </main>
    </SidebarLayout>
  );
};

export default NotifikasiAdminContainer;
