"use client";
import KelolaDataSection from "@/components/section/private/posyandu/kelola-data/kelola-data-section";
import { SidebarLayout } from "@/core/layouts/sidebar.layout";
import { useAppSelector } from "@/hooks/dispatch/dispatch";
import useService from "@/hooks/mutation/prop.service";
import { useAppNameSpace } from "@/hooks/useAppNameSpace";
import { NutritionStatus } from "@/types/partial";
import { useState } from "react";

const KelolaDataContainer = () => {
  const service = useService();
  const selector = useAppSelector((state) => state.posyandu);
  const namespace = useAppNameSpace();

  //measurement Child
  const measurementChildAllQuery = service.measuremnt.query.allMeasurement(
    selector.posyanduId!,
  );
  const measurementChildAllData = measurementChildAllQuery.data?.data ?? [];

  //kader
  const kaderQuery = service.posyandu.query.getKaderList();
  const kaderData = kaderQuery.data?.data ?? [];

  //parent
  const parentQuery = service.user.query.parent();
  const parentData = parentQuery.data?.data ?? [];

  //mutation
  const deleteKaderMutation = service.registerKader.mutation.deleteKader();

  //state
  const [filter, setFilter] = useState<"PARENT" | "KADER" | "CHILDREN">(
    "CHILDREN",
  );
  const [detailFilter, setDetailFilter] = useState<NutritionStatus | "Semua">(
    "Semua",
  );
  const [registerKaderID, setRegisterKaderID] = useState<string>("");
  const [searchValue, setSearchValue] = useState<string>("");

  //handler
  const handleDeleteKader = () => {
    if (!registerKaderID) return null;
    deleteKaderMutation.mutate(registerKaderID);
  };

  return (
    <SidebarLayout>
      <main className="w-full min-h-screen">
        <KelolaDataSection
          namespace={{
            router: namespace.router,
            alert: namespace.alert,
          }}
          service={{
            query: {
              children: measurementChildAllData,
              kader: kaderData,
              parent: parentData,
              isLoading:
                measurementChildAllQuery.isLoading ||
                kaderQuery.isLoading ||
                parentQuery.isLoading,
            },
            mutation: {
              isPending: deleteKaderMutation.isPending,
              onDeleteKader: handleDeleteKader,
            },
          }}
          state={{
            filter: filter,
            setFilter: setFilter,
            detailFilter: detailFilter,
            setDetailFilter: setDetailFilter,
            setRegisterKaderId: setRegisterKaderID,
            search: {
              value: searchValue,
              onChange: setSearchValue,
            },
          }}
        />
      </main>
    </SidebarLayout>
  );
};

export default KelolaDataContainer;
