"use client";

import ProfileAnakHeroSection from "@/components/section/private/parent/profile-anak/profile-anak-section";
import { SidebarLayout } from "@/core/layouts/sidebar.layout";
import useService from "@/hooks/mutation/prop.service";
import { useAppNameSpace } from "@/hooks/useAppNameSpace";

const ProfileAnakContainer = () => {
  const nameSpace = useAppNameSpace();
  const service = useService();

  return (
    <SidebarLayout>
      <main className="w-full min-h-screen overflow-x-hidden">
        <ProfileAnakHeroSection />
      </main>
    </SidebarLayout>
  );
};

export default ProfileAnakContainer;
