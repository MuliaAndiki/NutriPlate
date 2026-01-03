"use client";
import { useParams } from "next/navigation";
import { useEffect } from "react";

import DetailProfileAnakHeroSection from "@/components/section/private/parent/detail-profile-anak/detail-profile-anak-section";
import { SidebarLayout } from "@/core/layouts/sidebar.layout";
import useService from "@/hooks/mutation/prop.service";
import { useAppNameSpace } from "@/hooks/useAppNameSpace";
const DetailProfileAnakContainer = () => {
  const nameSpace = useAppNameSpace();
  const service = useService();
  const { id } = useParams<{ id: string }>();
  const childQueryByID = service.user.query.childById(id);
  const chilDataByID = childQueryByID.data?.data ?? [];

  return (
    <SidebarLayout>
      <main className="w-full min-h-screen overflow-x-hidden">
        <DetailProfileAnakHeroSection
          data={chilDataByID ?? []}
          isPending={childQueryByID.isPending}
          router={nameSpace.router}
          isLoading={childQueryByID.isLoading}
        />
      </main>
    </SidebarLayout>
  );
};

export default DetailProfileAnakContainer;
