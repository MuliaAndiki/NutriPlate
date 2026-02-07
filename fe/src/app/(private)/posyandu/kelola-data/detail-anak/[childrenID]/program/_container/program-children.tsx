"use client";

import ProgramChildrenPosyanduSection from "@/components/section/private/posyandu/kelola-data/program/program-children-section";
import { useAppSelector } from "@/hooks/dispatch/dispatch";
import useService from "@/hooks/mutation/prop.service";
import { useAppNameSpace } from "@/hooks/useAppNameSpace";
import { useParams } from "next/navigation";

const ProgramChildrenPosyanduContainer = () => {
  const namespace = useAppNameSpace();
  const { childrenID } = useParams<{ childrenID: string }>();
  const service = useService();
  const selector = useAppSelector((state) => state.posyandu);

  //childQuery
  const childQueryById = service.user.query.childById(childrenID);
  const childDataById = childQueryById.data?.data ?? null;

  //progres
  const progresInChildQuery = service.progres.query.progresInChild(childrenID);
  const progresInChildData = progresInChildQuery.data?.data ?? [];

  const segments = namespace.pathname.split("/");
  const section = segments[2];

  console.log(section, "ini section");

  return (
    <main className="w-full min-h-screen">
      <ProgramChildrenPosyanduSection
        namespace={{
          pathname: namespace.pathname,
          router: namespace.router,
        }}
        service={{
          query: {
            isLoading:
              childQueryById.isLoading || progresInChildQuery.isLoading,
            childType: childDataById ?? null,
            progres: progresInChildData ?? [],
          },
        }}
        state={{
          role: selector.role!,
          section: section,
        }}
      />
    </main>
  );
};

export default ProgramChildrenPosyanduContainer;
