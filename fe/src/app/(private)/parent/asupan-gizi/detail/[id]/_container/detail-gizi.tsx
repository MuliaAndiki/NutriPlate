"use client";
import DetailGiziHeroSection from "@/components/section/private/parent/detail-gizi/detail-gizi-section";
import { SidebarLayout } from "@/core/layouts/sidebar.layout";
import useService from "@/hooks/mutation/prop.service";
import { useAppNameSpace } from "@/hooks/useAppNameSpace";
import { useParams } from "next/navigation";
import { useEffect } from "react";

const DetailGiziContainer = () => {
  const nameSpace = useAppNameSpace();
  const service = useService()
  const { id } = useParams<{ id: string }>();


  
  useEffect(() => {
    console.log("ini id anak", id);
  }, [id]);
  return (
    <SidebarLayout>
      <main className="w-full min-h-screen overflow-x-hidden">
        <DetailGiziHeroSection router={nameSpace.router} />
      </main>
    </SidebarLayout>
  );
};

export default DetailGiziContainer;
