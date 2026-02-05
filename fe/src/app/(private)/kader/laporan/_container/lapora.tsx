"use client";
import LaporanSection from "@/components/section/private/kader/laporan/laporan-section";
import { SidebarLayout } from "@/core/layouts/sidebar.layout";
import { useAppNameSpace } from "@/hooks/useAppNameSpace";

const LaporanContainer = () => {
  const namespace = useAppNameSpace();
  return (
    <SidebarLayout>
      <main className="w-full overflow-x-hidden min-h-screen">
        <LaporanSection />
      </main>
    </SidebarLayout>
  );
};

export default LaporanContainer;
