"use client";

import DetailProgramPosyanduSection from "@/components/section/private/posyandu/kelola-data/program/detail-program/detail-program-section";
import useService from "@/hooks/mutation/prop.service";
import { useAppNameSpace } from "@/hooks/useAppNameSpace";
import { useParams } from "next/navigation";
import { useState } from "react";

const DetailProgramPosyanduContainer = () => {
  const namespace = useAppNameSpace();
  const { childrenID, progresID } = useParams<{
    childrenID: string;
    progresID: string;
  }>();
  const service = useService();

  //progres
  const progresInChildDataByIdQuery =
    service.progres.query.progresInChildByID(childrenID);
  const progresInChildDataById = progresInChildDataByIdQuery.data?.data ?? null;

  //state
  const [taskId, setTaskId] = useState<string | null>(null);

  //task list not fix

  return (
    <main className="w-full min-h-screen">
      <DetailProgramPosyanduSection
        namespace={{
          router: namespace.router,
          pathname: namespace.pathname,
          alert: namespace.alert,
        }}
        service={{
          query: {
            progres: progresInChildDataById ?? null,
            isLoading: progresInChildDataByIdQuery.isLoading,
          },
        }}
        state={{
          setTaskId: setTaskId,
          taskId: taskId,
        }}
      />
    </main>
  );
};

export default DetailProgramPosyanduContainer;
