"use client";
import { useParams } from "next/navigation";

import DetailGiziHeroSection from "@/components/section/private/parent/asupan-gizi/detail-gizi/detail-gizi-section";
import { SidebarLayout } from "@/core/layouts/sidebar.layout";
import useService from "@/hooks/mutation/prop.service";
import { useAppNameSpace } from "@/hooks/useAppNameSpace";

const DetailGiziContainer = () => {
  const nameSpace = useAppNameSpace();
  const service = useService();
  const { id } = useParams<{ id: string }>();

  return (
    <SidebarLayout>
      <main className="w-full min-h-screen overflow-x-hidden">
        <DetailGiziHeroSection router={nameSpace.router} />
      </main>
    </SidebarLayout>
  );
};

export default DetailGiziContainer;
