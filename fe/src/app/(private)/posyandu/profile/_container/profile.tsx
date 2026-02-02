"use client";
import ProfilePosyanduSection from "@/components/section/private/posyandu/profile/profile";
import { SidebarLayout } from "@/core/layouts/sidebar.layout";
import useService from "@/hooks/mutation/prop.service";

const ProfilePosyanduContainer = () => {
  const service = useService();
  //profile
  const profileQuery = service.user.query.profile();
  const profileData = profileQuery.data?.data ?? null;

  const logout = service.auth.mutation.logout();
  const handleLogout = () => {
    logout.mutate({});
  };
  return (
    <SidebarLayout>
      <main className="w-full min-h-screen overflow-x-hidden">
        <ProfilePosyanduSection
          service={{
            mutation: {
              onLogout: handleLogout,
            },
            query: {
              isLoading: profileQuery.isLoading,
              userProfileType: profileData ?? null,
            },
          }}
        />
      </main>
    </SidebarLayout>
  );
};

export default ProfilePosyanduContainer;
