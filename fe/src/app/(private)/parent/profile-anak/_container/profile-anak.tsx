"use client";
import ProfileAnakHeroSection from "@/components/section/private/parent/profile-anak/profile-anak-section";
import { SidebarLayout } from "@/core/layouts/sidebar.layout";
import { ProfileChildData } from "@/configs/component.config";

const ProfileAnakContainer = () => {
  return (
    <SidebarLayout>
      <main className="w-full min-h-screen flex just">
        <ProfileAnakHeroSection profileChild={ProfileChildData ?? []} />
      </main>
    </SidebarLayout>
  );
};

export default ProfileAnakContainer;
