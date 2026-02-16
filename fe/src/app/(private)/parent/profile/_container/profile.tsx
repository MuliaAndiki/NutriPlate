"use client";
import ProfileParentHeroSection from "@/components/section/private/parent/profile/profile-section";
import { SidebarLayout } from "@/core/layouts/sidebar.layout";
import { useAppSelector } from "@/hooks/dispatch/dispatch";
import useService from "@/hooks/mutation/prop.service";
import { useAppNameSpace } from "@/hooks/useAppNameSpace";

const ProfileParentContainer = () => {
  const namespace = useAppNameSpace();
  const service = useService();
  const selector = useAppSelector((state) => state.posyandu);

  //profile
  const useGetProfileQuery = service.user.query.profile();
  const useGetProfileData = useGetProfileQuery.data?.data ?? null;

  //mutation
  const logoutMutation = service.auth.mutation.logout();
  const handleLogout = () => {
    logoutMutation.mutate({});
  };
  return (
    <SidebarLayout>
      <main className="w-full min-h-screen overflow-x-hidden">
        <ProfileParentHeroSection
          namespace={{
            alert: namespace.alert,
          }}
          service={{
            mutation: {
              onLogout: () => handleLogout(),
              isPending: logoutMutation.isPending,
            },
            query: {
              userProfileType: useGetProfileData ?? undefined,
              isLoading: useGetProfileQuery.isLoading,
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

export default ProfileParentContainer;
