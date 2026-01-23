"use client";
import ProgresProgramSection from "@/components/section/private/parent/program/progres/progres-section";
import { SidebarLayout } from "@/core/layouts/sidebar.layout";
import useService from "@/hooks/mutation/prop.service";
import { useAppNameSpace } from "@/hooks/useAppNameSpace";

import { useParams } from "next/navigation";

const ProgresProgramContainer = () => {
  const namespace = useAppNameSpace();
  const params = useParams();
  const id = params?.id as string | undefined;

  const service = useService();

  // query
  const childQueryById = service.user.query.childById(id ?? "");
  const childDataById = childQueryById.data?.data ?? null;

  const progresInChildQuery = service.progres.query.progresInChild();
  const progresInChildData = progresInChildQuery.data?.data ?? [];

  return (
    <SidebarLayout>
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
        />
      </main>
    </SidebarLayout>
  );
};

export default ProgresProgramContainer;
