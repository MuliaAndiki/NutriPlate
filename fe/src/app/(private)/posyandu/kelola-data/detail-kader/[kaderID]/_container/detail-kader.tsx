"use client";

import DetailKaderPosyanduSection from "@/components/section/private/posyandu/kelola-data/detail-kader/detail-kader-section";
import useService from "@/hooks/mutation/prop.service";
import { useAppNameSpace } from "@/hooks/useAppNameSpace";
import { useParams } from "next/navigation";

const DetailKaderPosyanduContainer = () => {
  const namespace = useAppNameSpace();
  const service = useService();
  const { kaderID } = useParams<{ kaderID: string }>();

  //kader
  const kaderByIdQuery = service.user.query.parentById(kaderID);
  const kaderByData = kaderByIdQuery.data?.data ?? null;
  return (
    <main className="w-full min-h-screen">
      <DetailKaderPosyanduSection
        namespace={{
          router: namespace.router,
        }}
        service={{
          query: {
            isLoading: kaderByIdQuery.isLoading,
            kader: kaderByData ?? null,
          },
        }}
      />
    </main>
  );
};

export default DetailKaderPosyanduContainer;
