"use client";

import ProfileAnakHeroSection from "@/components/section/private/parent/profile-anak/profile-anak-section";
import { SidebarLayout } from "@/core/layouts/sidebar.layout";
import useService from "@/hooks/mutation/prop.service";
import { useAuthentic } from "@/hooks/useAuthentic";

const ProfileAnakContainer = () => {
  const service = useService();
  const { role } = useAuthentic();
  const childQuery = service.user.query.childAll({
    role: role,
  });
  const childData = childQuery.data?.data ?? [];

  return (
    <SidebarLayout>
      <main className="w-full min-h-screen overflow-x-hidden">
        <ProfileAnakHeroSection
          servive={{
            query: {
              profileAnak: childData ?? [],
            },
          }}
        />
      </main>
    </SidebarLayout>
  );
};

export default ProfileAnakContainer;
