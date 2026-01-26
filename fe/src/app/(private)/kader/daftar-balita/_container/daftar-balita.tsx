import DaftarBalitaKaderSection from "@/components/section/private/kader/daftar-balita/daftar-balita-section";
import { SidebarLayout } from "@/core/layouts/sidebar.layout";

const DaftarBalitaKaderContainer = () => {
  return (
    <SidebarLayout>
      <main className="w-full overflow-x-hidden min-h-screen">
        <DaftarBalitaKaderSection />
      </main>
    </SidebarLayout>
  );
};

export default DaftarBalitaKaderContainer;
