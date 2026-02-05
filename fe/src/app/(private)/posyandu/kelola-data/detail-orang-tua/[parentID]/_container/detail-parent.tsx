"use client";

import DetailParentPosyanduSection from "@/components/section/private/posyandu/kelola-data/detail-orang-tua/detail-orant-tua-section";
import useService from "@/hooks/mutation/prop.service";
import { useAppNameSpace } from "@/hooks/useAppNameSpace";
import { useParams } from "next/navigation";

const DetailParentPosyanduContainer = () => {
  const namespace = useAppNameSpace();
  const service = useService();
  const { parentID } = useParams<{ parentID: string }>();

  //parent Detail
  const parentByIdQuery = service.user.query.parentById(parentID);
  const parentByIdData = parentByIdQuery.data?.data ?? null;

  return (
    <main className="w-full min-h-screen">
      <DetailParentPosyanduSection
        namespace={{
          router: namespace.router,
        }}
        service={{
          query: {
            isLoading: parentByIdQuery.isLoading,
            parentDetail: parentByIdData ?? null,
          },
        }}
      />
    </main>
  );
};

export default DetailParentPosyanduContainer;
