"use client";
import ProfilePosyanduSection from "@/components/section/private/posyandu/profile/profile";
import { SidebarLayout } from "@/core/layouts/sidebar.layout";
import { useAppSelector } from "@/hooks/dispatch/dispatch";
import useService from "@/hooks/mutation/prop.service";

const ProfilePosyanduContainer = () => {
  const service = useService();
  const selector = useAppSelector((state) => state.posyandu);
  //profile
  const profileQuery = service.user.query.profile();
  const profileData = profileQuery.data?.data ?? null;

  //mutation
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
              isPending: logout.isPending,
            },
            query: {
              isLoading: profileQuery.isLoading,
              userProfileType: profileData ?? null,
            },
          }}
          selector={{
            role: selector.role!,
          }}
        />
      </main>
    </SidebarLayout>
  );
};

export default ProfilePosyanduContainer;
