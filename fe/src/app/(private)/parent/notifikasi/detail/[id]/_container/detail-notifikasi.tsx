"use client";
import NotifikasiDetailSection from "@/components/section/private/parent/notifikasi/detail/notifikasi-detail-section";
import { SidebarLayout } from "@/core/layouts/sidebar.layout";
import useService from "@/hooks/mutation/prop.service";
import { useAppNameSpace } from "@/hooks/useAppNameSpace";
import { useParams } from "next/navigation";

const DetailNotifikasiContainer = () => {
  const namespace = useAppNameSpace();
  const service = useService();
  const { id } = useParams<{ id: string }>();
  return (
    <SidebarLayout>
      <main className="w-full min-h-screen overflow-x-hidden">
        <NotifikasiDetailSection
          namespace={{
            router: namespace.router,
          }}
        />
      </main>
    </SidebarLayout>
  );
};

export default DetailNotifikasiContainer;
