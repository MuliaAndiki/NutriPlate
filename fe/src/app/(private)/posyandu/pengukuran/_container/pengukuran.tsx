import PengukuranSection from "@/components/section/private/posyandu/pengukuran/pengukuran-section";
import { SidebarLayout } from "@/core/layouts/sidebar.layout";

const PengukuranContainer = () => {
  return (
    <SidebarLayout>
      <main className="w-full min-h-screen">
        <PengukuranSection />
      </main>
    </SidebarLayout>
  );
};

export default PengukuranContainer;
