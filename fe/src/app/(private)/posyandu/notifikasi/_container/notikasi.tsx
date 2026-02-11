"use client";
import NotifikasiPosyanduSection from "@/components/section/private/posyandu/notifikasi/notifikasi-section";
import { SidebarLayout } from "@/core/layouts/sidebar.layout";
import { useAppSelector } from "@/hooks/dispatch/dispatch";
import useService from "@/hooks/mutation/prop.service";
import { useAppNameSpace } from "@/hooks/useAppNameSpace";
import Api from "@/services/props.module";
import { NotifTypeInterface } from "@/types/partial";
import { useEffect, useState } from "react";

const NotifikasiPosyanduContainer = () => {
  const namespace = useAppNameSpace();
  const service = useService();
  const selector = useAppSelector((state) => state.posyandu);

  const notifikasiQuery = service.notafication.query.getNotification(
    selector.token!,
  );

  const notifikasiData = notifikasiQuery.data?.data ?? [];

  const [filtered, setFiltered] = useState<"Read" | "NotRead">("NotRead");
  const [selectTypes, setSelectedTypes] = useState<NotifTypeInterface[]>([]);
  const [broadcastFilter, setBroadcastFilter] = useState<
    "all" | "broadcast" | "draft"
  >("all");
  const [readStatus, setReadStatus] = useState<Record<string, boolean>>({});

  const deleteMutation = service.notafication.mutation.delete();
  const broadcastMutation = service.notafication.mutation.broadcast();

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

  const handleDetail = (id: string) => {
    namespace.router.push(`/posyandu/notifikasi/detail-notifikasi/${id}`);
  };

  const handleEdit = (id: string) => {
    namespace.router.push(`/posyandu/notifikasi/update/${id}`);
  };

  const handleDelete = (id: string) => {
    namespace.alert.confirm({
      icon: "question",
      title: "Perhatian",
      deskripsi: "Apakah Kamu Yakin Menghapus notifikasi ini",
      onConfirm: () => deleteMutation.mutate(id),
    });
  };

  const handleBroadcast = (id: string) => {
    namespace.alert.confirm({
      icon: "question",
      title: "Perhatian",
      deskripsi: "Broadcast notifikasi ini ke semua pengguna?",
      onConfirm: () => broadcastMutation.mutate(id),
    });
  };

  const handleToggleType = (type: NotifTypeInterface) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type],
    );
  };

  return (
    <SidebarLayout>
      <main className="w-full overflow-x-hidden min-h-screen">
        <NotifikasiPosyanduSection
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
            selectedTypes: selectTypes,
            broadcastFilter: broadcastFilter,
          }}
          handler={{
            onDetail: handleDetail,
            onEdit: handleEdit,
            onDelete: handleDelete,
            onBroadcast: handleBroadcast,
            onFilterChange: setFiltered,
            onToggleType: handleToggleType,
            onBroadcastFilterChange: setBroadcastFilter,
          }}
          readStatus={readStatus}
        />
      </main>
    </SidebarLayout>
  );
};

export default NotifikasiPosyanduContainer;
