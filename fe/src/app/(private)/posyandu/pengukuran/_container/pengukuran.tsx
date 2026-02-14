"use client";
import PengukuranSection from "@/components/section/private/posyandu/pengukuran/pengukuran-section";
import { SidebarLayout } from "@/core/layouts/sidebar.layout";
import { useAppSelector } from "@/hooks/dispatch/dispatch";
import useService from "@/hooks/mutation/prop.service";
import { useAppNameSpace } from "@/hooks/useAppNameSpace";

const PengukuranContainer = () => {
  const namespace = useAppNameSpace();
  const service = useService();
  const selector = useAppSelector((state) => state.posyandu);

  //child
  const childrenQuery = service.user.query.childAll({
    role: selector.role!,
    posyanduId: selector.posyanduId!,
  });

  const childrenData = childrenQuery.data?.data ?? [];
  return (
    <SidebarLayout>
      <main className="w-full min-h-screen">
        <PengukuranSection
          service={{
            query: {
              children: childrenData ?? [],
              isLoading: childrenQuery.isLoading,
            },
          }}
          namespace={{
            pathname: namespace.pathname,
            router: namespace.router,
          }}
        />
      </main>
    </SidebarLayout>
  );
};

export default PengukuranContainer;
