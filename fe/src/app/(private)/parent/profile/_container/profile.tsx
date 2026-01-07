"use client";
import ProfileParentHeroSection from "@/components/section/private/parent/profile/profile-section";
import { SidebarLayout } from "@/core/layouts/sidebar.layout";
import useService from "@/hooks/mutation/prop.service";

const ProfileParentContainer = () => {
  const service = useService();
  const useGetProfileQuery = service.user.query.profile();
  const useGetProfileData = useGetProfileQuery.data?.data ?? [];
  const logoutMutation = service.auth.mutation.logout();
  const handleLogout = () => {
    logoutMutation.mutate({});
  };
  return (
    <SidebarLayout>
      <main className="w-full min-h-screen overflow-x-hidden">
        <ProfileParentHeroSection
          userProfileType={useGetProfileData ?? []}
          onLogout={handleLogout}
        />
      </main>
    </SidebarLayout>
  );
};

export default ProfileParentContainer;
