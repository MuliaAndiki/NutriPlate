"use client";

import DaftarPosyanduKaderSection from "@/components/section/private/kader/daftar-posyandu/daftar-posyandu-section";
import { SidebarLayout } from "@/core/layouts/sidebar.layout";
import useService from "@/hooks/mutation/prop.service";
import { useAppNameSpace } from "@/hooks/useAppNameSpace";
import { useMemo, useState } from "react";

const DaftarPosyanduKaderContainer = () => {
  const namespace = useAppNameSpace();
  const service = useService();

  const [search, setSearch] = useState("");

  const posyanduQuery = service.posyandu.query.getPosyandu();
  const posyanduData = posyanduQuery.data?.data ?? [];

  const filteredPosyandu = useMemo(() => {
    if (!search) return posyanduData;

    const keyword = search.toLowerCase();

    return posyanduData.filter((item: any) =>
      [item.name, item.district, item.village, item.subDistrict]
        .join(" ")
        .toLowerCase()
        .includes(keyword),
    );
  }, [search, posyanduData]);

  return (
    <SidebarLayout>
      <main className="w-full min-h-screen">
        <DaftarPosyanduKaderSection
          namespace={{ router: namespace.router }}
          service={{
            query: {
              posyandu: filteredPosyandu,
              isLoading: posyanduQuery.isLoading,
            },
            search: {
              value: search,
              onChange: setSearch,
            },
          }}
        />
      </main>
    </SidebarLayout>
  );
};

export default DaftarPosyanduKaderContainer;
