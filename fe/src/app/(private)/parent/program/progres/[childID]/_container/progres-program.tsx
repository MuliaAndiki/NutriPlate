"use client";
import ProgresProgramSection from "@/components/section/private/parent/program/progres/progres-section";
import { useAppSelector } from "@/hooks/dispatch/dispatch";
import useService from "@/hooks/mutation/prop.service";
import { useAppNameSpace } from "@/hooks/useAppNameSpace";
import { useParams } from "next/navigation";

const ProgresProgramContainer = () => {
  const namespace = useAppNameSpace();
  const { childID } = useParams<{ childID: string }>();
  const service = useService();
  const selector = useAppSelector((state) => state.posyandu);

  // children
  const childQueryById = service.user.query.childById(childID);
  const childDataById = childQueryById.data?.data ?? null;

  //progres
  const progresInChildQuery = service.progres.query.progresInChild(childID);
  const progresInChildData = progresInChildQuery.data?.data ?? [];

  const segments = namespace.pathname.split("/");
  const section = segments[2];

  return (
    <main className="w-full min-h-screen overflow-x-hidden">
      <ProgresProgramSection
        namespace={{
          router: namespace.router,
          pathname: namespace.pathname,
        }}
        service={{
          query: {
            childType: childDataById ?? null,
            isLoading:
              childQueryById.isLoading || progresInChildQuery.isLoading,
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

export default ProgresProgramContainer;
