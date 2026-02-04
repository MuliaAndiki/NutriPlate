"use client";

import ProfileAnakHeroSection from "@/components/section/private/parent/profile-anak/profile-anak-section";
import { SidebarLayout } from "@/core/layouts/sidebar.layout";
import { useAppSelector } from "@/hooks/dispatch/dispatch";
import useService from "@/hooks/mutation/prop.service";

const ProfileAnakContainer = () => {
  const service = useService();
  const selector = useAppSelector((state) => state.posyandu);
  console.log(selector.role, "inirole");
  const childQuery = service.user.query.childAll({
    role: selector.role!,
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
