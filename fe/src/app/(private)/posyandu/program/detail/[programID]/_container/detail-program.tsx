"use client";

import DetailProgramPosyanduSection from "@/components/section/private/posyandu/program/detail-program/detail-program-section";
import useService from "@/hooks/mutation/prop.service";
import { useAppNameSpace } from "@/hooks/useAppNameSpace";
import { useParams } from "next/navigation";

const DetailProgramPosyanduContainer = () => {
  const namespace = useAppNameSpace();
  const service = useService();
  const { programID } = useParams<{ programID: string }>();

  //program by id
  const programByIdQuery = service.program.query.getProgramById(programID);
  const programByIdData = programByIdQuery.data?.data ?? null;

  //mutation
  const deleteProgramMutation = service.program.mutation.deleteProgram();

  //handler
  const handlerDeleteProgram = () => {
    if (!programID) return null;
    deleteProgramMutation.mutate(programID);
  };
  //update here
  return (
    <main className="w-full">
      <DetailProgramPosyanduSection
        namespace={{
          router: namespace.router,
          alert: namespace.alert,
        }}
        service={{
          query: {
            isLoading: programByIdQuery.isLoading,
            program: programByIdData ?? null,
          },
          mutation: {
            deleteProgram: handlerDeleteProgram,
            isPending: deleteProgramMutation.isPending,
          },
        }}
      />
    </main>
  );
};

export default DetailProgramPosyanduContainer;
