import HomeAdminHeroSection from "@/components/section/private/admin/home/home-admin-sction";
import { SidebarLayout } from "@/core/layouts/sidebar.layout";

const HomeContainerAdmin = () => {
  return (
    <SidebarLayout>
      <main className="w-full min-h-screen overflow-x-hidden">
        <HomeAdminHeroSection />
      </main>
    </SidebarLayout>
  );
};

export default HomeContainerAdmin;
