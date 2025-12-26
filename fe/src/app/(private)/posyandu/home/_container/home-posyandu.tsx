import HomePosyanduHeroSection from "@/components/section/private/posyandu/home/home-posyandu";
import { SidebarLayout } from "@/core/layouts/sidebar.layout";

const HomePosyanduContainer = () => {
  return (
    <SidebarLayout>
      <main className="w-full min-h-screen overflow-x-hidden">
        <HomePosyanduHeroSection />
      </main>
    </SidebarLayout>
  );
};

export default HomePosyanduContainer;
