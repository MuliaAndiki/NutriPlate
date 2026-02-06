"use client";

import DataAnakPosyanduHeroSection from "@/components/section/private/posyandu/kelola-data/detail-anak/data-anak/data-anak-section";
import useService from "@/hooks/mutation/prop.service";
import { useAppNameSpace } from "@/hooks/useAppNameSpace";
import { useParams } from "next/navigation";

const DataAnakPosyanduContainer = () => {
  const namespace = useAppNameSpace();
  const { childrenID } = useParams<{ childrenID: string }>();
  const service = useService();

  //children
  const childQueryByID = service.user.query.childById(childrenID);
  const chilDataByID = childQueryByID.data?.data ?? null;

  return (
    <main className="w-full min-h-screen overflow-x-hidden">
      <DataAnakPosyanduHeroSection
        namespace={{
          alert: namespace.alert,
          router: namespace.router,
        }}
        service={{
          query: {
            isLoading: childQueryByID.isLoading,
            children: chilDataByID ?? null,
          },
        }}
      />
    </main>
  );
};

export default DataAnakPosyanduContainer;
