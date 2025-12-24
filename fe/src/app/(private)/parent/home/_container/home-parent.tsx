import HomeParentHeroSection from "@/components/section/private/parent/home/home-parent-section";
import { SidebarLayout } from "@/core/layouts/sidebar.layout";

const HomeParentContainer = () => {
  return (
    <SidebarLayout>
      <main className="w-full min-h-screen overflow-x-hidden">
        <HomeParentHeroSection />
      </main>
    </SidebarLayout>
  );
};

export default HomeParentContainer;
