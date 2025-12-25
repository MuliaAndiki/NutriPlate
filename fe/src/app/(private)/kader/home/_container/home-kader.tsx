import HomeKaderHeroSection from "@/components/section/private/kader/home/home-kader-section";
import { SidebarLayout } from "@/core/layouts/sidebar.layout";

const HomeKaderContainer = () => {
  return (
    <SidebarLayout>
      <main className="w-full min-h-screen ">
        <HomeKaderHeroSection />
      </main>
    </SidebarLayout>
  );
};

export default HomeKaderContainer;
