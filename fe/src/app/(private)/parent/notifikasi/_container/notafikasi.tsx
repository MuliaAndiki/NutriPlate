"use client";
import NotifikasiParentSection from "@/components/section/private/parent/notifikasi/notifikasi-section";
import { SidebarLayout } from "@/core/layouts/sidebar.layout";
import useService from "@/hooks/mutation/prop.service";
import { useAppNameSpace } from "@/hooks/useAppNameSpace";
import { NotifTypeInterface } from "@/types/partial";
import { useDebugLog } from "@/utils/useDebug";
import { useState } from "react";

const NotafikasiParentContainer = () => {
  const namespace = useAppNameSpace();
  const service = useService();
  const notifikasiQuery = service.notafication.query.getNotification();
  const notifikasiData = notifikasiQuery.data?.data ?? [];
  const [filtered, setFiltered] = useState<"Read" | "NotRead">("NotRead");
  const [selectTypes, setSelectedTypes] = useState<NotifTypeInterface[]>([]);

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
        />
      </main>
    </SidebarLayout>
  );
};

export default NotafikasiParentContainer;
