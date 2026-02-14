"use client";

import DataAnakKaderHeroSection from "@/components/section/private/kader/daftar-balita/detail-anak/data-anak/data-anak-section";

import useService from "@/hooks/mutation/prop.service";
import { useAppNameSpace } from "@/hooks/useAppNameSpace";
import { useParams } from "next/navigation";

const DataAnakKaderContainer = () => {
  const namespace = useAppNameSpace();
  const { childrenID } = useParams<{ childrenID: string }>();
  const service = useService();

  //children
  const childQueryByID = service.user.query.childById(childrenID);
  const chilDataByID = childQueryByID.data?.data ?? null;

  return (
    <main className="w-full min-h-screen overflow-x-hidden">
      <DataAnakKaderHeroSection
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

export default DataAnakKaderContainer;
