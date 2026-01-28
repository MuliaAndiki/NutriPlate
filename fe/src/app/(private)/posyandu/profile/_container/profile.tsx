"use client";
import ProfilePosyanduSection from "@/components/section/private/posyandu/profile/profile";
import { ButtonWrapper } from "@/components/wrapper/ButtonWrapper";
import { SidebarLayout } from "@/core/layouts/sidebar.layout";
import useService from "@/hooks/mutation/prop.service";

const ProfilePosyanduContainer = () => {
  const service = useService();
  const logout = service.auth.mutation.logout();
  const handleLogout = () => {
    logout.mutate({});
  };
  return (
    <SidebarLayout>
      <main className="w-full min-h-screen overflow-x-hidden">
        <ButtonWrapper onClick={() => handleLogout()}>keluar</ButtonWrapper>
        <ProfilePosyanduSection />
      </main>
    </SidebarLayout>
  );
};

export default ProfilePosyanduContainer;
