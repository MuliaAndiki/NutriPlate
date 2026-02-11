"use client";
import HomeParentHeroSection from "@/components/section/private/parent/home/home-parent-section";
import { SidebarLayout } from "@/core/layouts/sidebar.layout";
import { useAppSelector } from "@/hooks/dispatch/dispatch";
import useService from "@/hooks/mutation/prop.service";

const HomeParentContainer = () => {
  const service = useService();
  const selector = useAppSelector((state) => state.posyandu);

  //profile
  const profileQuery = service.user.query.profile();
  const profileData = profileQuery.data?.data ?? null;

  const notifikasiQuery = service.notafication.query.getNotification(
    selector.token!,
  );
  const notifikasiData = notifikasiQuery.data?.data ?? [];

  return (
    <SidebarLayout>
      <main className="w-full min-h-screen overflow-x-hidden">
        <HomeParentHeroSection
          service={{
            query: {
              profile: profileData ?? null,
              isLoading: profileQuery.isLoading || notifikasiQuery.isLoading,
              notifikasi: notifikasiData,
            },
          }}
        />
      </main>
    </SidebarLayout>
  );
};

export default HomeParentContainer;
