"use client";
import ProfileParentHeroSection from "@/components/section/private/parent/profile/profile-section";
import { SidebarLayout } from "@/core/layouts/sidebar.layout";
import useService from "@/hooks/mutation/prop.service";

const ProfileParentContainer = () => {
  const service = useService();
  const useGetProfileQuery = service.user.query.profile();
  const useGetProfileData = useGetProfileQuery.data?.data ?? [];
  return (
    <SidebarLayout>
      <main className="w-full min-h-screen overflow-x-hidden">
        <ProfileParentHeroSection userProfileType={useGetProfileData ?? []} />
      </main>
    </SidebarLayout>
  );
};

export default ProfileParentContainer;
