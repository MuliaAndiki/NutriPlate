"use client";

import ProfileKaderSection from "@/components/section/private/kader/profile/profile-section";
import { SidebarLayout } from "@/core/layouts/sidebar.layout";
import { useAppSelector } from "@/hooks/dispatch/dispatch";
import useService from "@/hooks/mutation/prop.service";
import { useAppNameSpace } from "@/hooks/useAppNameSpace";

const ProfileAdminContainer = () => {
  const namespace = useAppNameSpace();
  const service = useService();
  const selector = useAppSelector((state) => state.posyandu);

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
          namespace={{
            alert: namespace.alert,
          }}
          service={{
            mutation: {
              onLogout: handleLogout,
              isPending: logout.isPending,
            },
            query: {
              isLoading: profileQuery.isLoading,
              userProfileType: profileData ?? undefined,
            },
          }}
          seletor={{
            role: selector.role!,
          }}
        />
      </main>
    </SidebarLayout>
  );
};

export default ProfileAdminContainer;
