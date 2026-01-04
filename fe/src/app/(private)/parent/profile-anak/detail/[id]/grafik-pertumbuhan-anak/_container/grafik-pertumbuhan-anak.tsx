"use client";
import GrafikPertumbuhanAnakHeroSection from "@/components/section/private/parent/detail-profile-anak/grafik-pertumbuhan-anak/grafik-pertumbuhan-anak-section";
import { SidebarLayout } from "@/core/layouts/sidebar.layout";
import useService from "@/hooks/mutation/prop.service";
import { useAppNameSpace } from "@/hooks/useAppNameSpace";

const GrafikPertumbuhanAnakContainer = () => {
  const nameSpace = useAppNameSpace();
  const service = useService();

  return (
    <SidebarLayout>
      <main className="w-full">
        <GrafikPertumbuhanAnakHeroSection router={nameSpace.router} />
      </main>
    </SidebarLayout>
  );
};

export default GrafikPertumbuhanAnakContainer;
