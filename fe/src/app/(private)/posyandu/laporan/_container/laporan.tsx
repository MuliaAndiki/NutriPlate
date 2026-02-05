"use client";

import LaporanPosyanduSection from "@/components/section/private/posyandu/laporan/laporan-section";
import { useAppNameSpace } from "@/hooks/useAppNameSpace";

const LaporanPosyanduContainer = () => {
  const namespace = useAppNameSpace();
  return (
    <main className="w-full min-h-screen">
      <LaporanPosyanduSection
        namespace={{
          router: namespace.router,
        }}
      />
    </main>
  );
};

export default LaporanPosyanduContainer;
