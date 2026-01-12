"use client";
import { useParams } from "next/navigation";

import DetailProfileAnakHeroSection from "@/components/section/private/parent/profile-anak/detail-profile-anak/detail-profile-anak-section";
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
          namespace={{
            router: nameSpace.router,
          }}
          service={{
            query: {
              ChildCard: chilDataByID ?? [],
              isLoading: childQueryByID.isLoading,
              isPending: childQueryByID.isPending,
            },
          }}
        />
      </main>
    </SidebarLayout>
  );
};

export default DetailProfileAnakContainer;
