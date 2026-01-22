"use client";
import HomeParentHeroSection from "@/components/section/private/parent/home/home-parent-section";
import { SidebarLayout } from "@/core/layouts/sidebar.layout";
import useService from "@/hooks/mutation/prop.service";

const HomeParentContainer = () => {
  const service = useService();
  const profileQuery = service.user.query.profile();
  const profileData = profileQuery.data?.data ?? null;
  return (
    <SidebarLayout>
      <main className="w-full min-h-screen overflow-x-hidden">
        <HomeParentHeroSection
          service={{
            query: {
              profile: profileData ?? null,
              isLoading: profileQuery.isLoading,
            },
          }}
        />
      </main>
    </SidebarLayout>
  );
};

export default HomeParentContainer;
