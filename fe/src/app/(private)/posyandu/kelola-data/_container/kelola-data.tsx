"use client";
import KelolaDataSection from "@/components/section/private/posyandu/kelola-data/kelola-data-section";
import { SidebarLayout } from "@/core/layouts/sidebar.layout";
import { useAppSelector } from "@/hooks/dispatch/dispatch";
import useService from "@/hooks/mutation/prop.service";
import { useAppNameSpace } from "@/hooks/useAppNameSpace";
import { useState } from "react";

const KelolaDataContainer = () => {
  const service = useService();
  const selector = useAppSelector((state) => state.posyandu);
  const namespace = useAppNameSpace();

  //child
  const childrenQuery = service.user.query.childAll({
    role: selector.role!,
    posyanduId: selector.posyanduId!,
  });
  const childrenData = childrenQuery.data?.data ?? [];

  //kader
  const kaderQuery = service.posyandu.query.getKaderList();
  const kaderData = kaderQuery.data?.data ?? [];

  //parent
  const parentQuery = service.user.query.parent();
  const parentData = parentQuery.data?.data ?? [];

  //state
  const [filter, setFilter] = useState<"PARENT" | "KADER" | "CHILDREN">(
    "PARENT",
  );
  return (
    <SidebarLayout>
      <main className="w-full min-h-screen">
        <KelolaDataSection
          namespace={{
            router: namespace.router,
          }}
          service={{
            query: {
              children: childrenData,
              kader: kaderData,
              parent: parentData,
              isLoading:
                childrenQuery.isLoading ||
                kaderQuery.isLoading ||
                parentQuery.isLoading,
            },
          }}
          state={{
            filter: filter,
            setFilter: setFilter,
          }}
        />
      </main>
    </SidebarLayout>
  );
};

export default KelolaDataContainer;
