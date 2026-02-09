"use client";
import ProfileKaderSection from "@/components/section/private/kader/profile/profile-section";
import { ButtonWrapper } from "@/components/wrapper/ButtonWrapper";
import { SidebarLayout } from "@/core/layouts/sidebar.layout";
import useService from "@/hooks/mutation/prop.service";

const ProfileKaderContainer = () => {
  const service = useService();
  const profileQuery = service.user.query.profile();
  const profileData = profileQuery.data?.data ?? null;
  const logout = service.auth.mutation.logout();

  const handleLogout = () => {
    logout.mutate({});
  };
  return (
    <SidebarLayout>
      <main className="w-full min-h-screen overflow-x-hidden">
        <ProfileKaderSection
          service={{
            mutation: {
              onLogout: handleLogout,
            },
            query: {
              isLoading: profileQuery.isLoading,
              userProfileType: profileData ?? undefined,
            },
          }}
        />
      </main>
    </SidebarLayout>
  );
};

export default ProfileKaderContainer;
