"use client";

import ProfileAnakHeroSection from "@/components/section/private/parent/profile-anak/profile-anak-section";
import { SidebarLayout } from "@/core/layouts/sidebar.layout";

const ProfileAnakContainer = () => {
  return (
    <SidebarLayout>
      <main className="w-full min-h-screen overflow-x-hidden">
        <ProfileAnakHeroSection />
      </main>
    </SidebarLayout>
  );
};

export default ProfileAnakContainer;
