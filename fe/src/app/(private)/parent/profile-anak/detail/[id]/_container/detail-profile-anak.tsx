import DetailProfileAnakHeroSection from "@/components/section/private/parent/detail-profile-anak/detail-profile-anak-section";
import { SidebarLayout } from "@/core/layouts/sidebar.layout";
import { ProfileChildData } from "@/configs/component.config";
const DetailProfileAnakContainer = () => {
  return (
    <SidebarLayout>
      <main className="w-full min-h-screen overflow-x-hidden">
        <DetailProfileAnakHeroSection profileChild={ProfileChildData ?? []} />
      </main>
    </SidebarLayout>
  );
};

export default DetailProfileAnakContainer;
