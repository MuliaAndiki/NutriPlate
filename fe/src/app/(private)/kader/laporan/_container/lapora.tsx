import LaporanSection from "@/components/section/private/kader/laporan/laporan-section";
import { SidebarLayout } from "@/core/layouts/sidebar.layout";

const LaporanContainer = () => {
  return (
    <SidebarLayout>
      <main className="w-full overflow-x-hidden min-h-screen">
        <LaporanSection />
      </main>
    </SidebarLayout>
  );
};

export default LaporanContainer;
