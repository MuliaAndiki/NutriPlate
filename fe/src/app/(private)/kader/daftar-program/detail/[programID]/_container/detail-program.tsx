"use client";

import DetailProgramKaderSection from "@/components/section/private/kader/daftar-program/detail-program/detail-program-section";
import useService from "@/hooks/mutation/prop.service";
import { useAppNameSpace } from "@/hooks/useAppNameSpace";
import { useDebugLog } from "@/utils/useDebug";
import { useParams } from "next/navigation";

const DetailProgramKaderContainer = () => {
  const namespace = useAppNameSpace();
  const { programID } = useParams<{ programID: string }>();
  const service = useService();

  //programById
  const programByIdQuery = service.program.query.getProgramById(programID);
  const programByIdData = programByIdQuery.data?.data ?? [];

  useDebugLog(programByIdData, [programByIdQuery], { label: "disini husi" });
  return (
    <main className="w-full min-h-screen">
      <DetailProgramKaderSection
        namespace={{
          router: namespace.router,
        }}
        service={{
          isLoading: programByIdQuery.isLoading,
          program: programByIdData ?? [],
        }}
      />
    </main>
  );
};

export default DetailProgramKaderContainer;
