"use client";

import DetailProgramKaderSection from "@/components/section/private/kader/daftar-program/detail-program/detail-program-section";
import { useAppSelector } from "@/hooks/dispatch/dispatch";
import useService from "@/hooks/mutation/prop.service";
import { useAppNameSpace } from "@/hooks/useAppNameSpace";

import { useParams } from "next/navigation";
const DetailProgramKaderContainer = () => {
  const namespace = useAppNameSpace();
  const { programID } = useParams<{ programID: string }>();
  const service = useService();

  const selector = useAppSelector((state) => state.posyandu);
  //programById
  const programByIdQuery = service.program.query.getProgramById(programID);
  const programByIdData = programByIdQuery.data?.data ?? [];

  // children
  const childQuery = service.user.query.childAll({
    role: selector.role!,
    posyanduId: selector.posyanduId!,
  });
  const childData = childQuery.data?.data ?? [];

  return (
    <main className="w-full min-h-screen">
      <DetailProgramKaderSection
        namespace={{
          router: namespace.router,
          pathname: namespace.pathname,
        }}
        service={{
          query: {
            isLoading: programByIdQuery.isLoading || childQuery.isLoading,
            program: programByIdData ?? [],
            children: childData ?? [],
          },
        }}
      />
    </main>
  );
};

export default DetailProgramKaderContainer;
