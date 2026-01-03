import AsupanGiziHeroSection from "@/components/section/private/parent/asupan-gizi/asupan-gizi-section";
//dummpy data
import { HistoryFoodData } from "@/configs/component.config";
import { SidebarLayout } from "@/core/layouts/sidebar.layout";

const AsupanGiziContainer = () => {
  return (
    <SidebarLayout>
      <main className="w-full min-h-screen overflow-x-hidden">
        <AsupanGiziHeroSection HistoryFoodData={HistoryFoodData ?? []} />
      </main>
    </SidebarLayout>
  );
};

export default AsupanGiziContainer;
