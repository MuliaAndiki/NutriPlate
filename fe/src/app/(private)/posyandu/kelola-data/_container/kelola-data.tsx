import KelolaDataSection from "@/components/section/private/posyandu/kelola-data/kelola-data-section";
import { SidebarLayout } from "@/core/layouts/sidebar.layout";

const KelolaDataContainer = () => {
  return (
    <SidebarLayout>
      <main className="w-full min-h-screen">
        <KelolaDataSection />
      </main>
    </SidebarLayout>
  );
};

export default KelolaDataContainer;
