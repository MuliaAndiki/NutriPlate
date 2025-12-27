"use client";
import DetailGiziHeroSection from "@/components/section/private/parent/detail-gizi/detail-gizi-section";
import { SidebarLayout } from "@/core/layouts/sidebar.layout";
import { useAppNameSpace } from "@/hooks/useAppNameSpace";
import { useParams } from "next/navigation";

const DetailGiziContainer = () => {
  const nameSpace = useAppNameSpace();
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
