import DaftarOrangTuaSection from "@/components/section/private/kader/daftar-orang-tua/daftar-orang-tua-section";
import { SidebarLayout } from "@/core/layouts/sidebar.layout";

const DaftarOrangTuaContainer = () => {
  return (
    <SidebarLayout>
      <main className="w-full overflow-x-hidden min-h-screen">
        <DaftarOrangTuaSection />
      </main>
    </SidebarLayout>
  );
};

export default DaftarOrangTuaContainer;
