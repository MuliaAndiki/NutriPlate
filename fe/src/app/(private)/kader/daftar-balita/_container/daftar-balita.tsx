"use client";
import DaftarBalitaKaderSection from "@/components/section/private/kader/daftar-balita/daftar-balita-section";
import { SidebarLayout } from "@/core/layouts/sidebar.layout";

import { useAppNameSpace } from "@/hooks/useAppNameSpace";

const DaftarBalitaKaderContainer = () => {
  const namespace = useAppNameSpace();

  return (
    <SidebarLayout>
      <main className="w-full overflow-x-hidden min-h-screen">
        <DaftarBalitaKaderSection />
      </main>
    </SidebarLayout>
  );
};

export default DaftarBalitaKaderContainer;
