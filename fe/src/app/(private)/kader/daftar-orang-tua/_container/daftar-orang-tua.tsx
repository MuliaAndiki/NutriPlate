"use client";

import DaftarOrangTuaSection from "@/components/section/private/kader/daftar-orang-tua/daftar-orang-tua-section";
import { SidebarLayout } from "@/core/layouts/sidebar.layout";
import useService from "@/hooks/mutation/prop.service";
import { useAppNameSpace } from "@/hooks/useAppNameSpace";
import { useMemo, useState } from "react";
import { ParentListResponse } from "@/types/res";

const DaftarOrangTuaContainer = () => {
  const namespace = useAppNameSpace();
  const service = useService();

  const [search, setSearch] = useState("");

  const parentQuery = service.user.query.parent();
  const parentData: ParentListResponse[] = parentQuery.data?.data ?? [];

  const filteredParent = useMemo(() => {
    if (!search) return parentData;

    const keyword = search.toLowerCase();

    return parentData.filter((item) =>
      [item.fullName, item.email, item.phone]
        .join(" ")
        .toLowerCase()
        .includes(keyword),
    );
  }, [search, parentData]);

  return (
    <SidebarLayout>
      <main className="w-full overflow-x-hidden min-h-screen">
        <DaftarOrangTuaSection
          namespace={{ router: namespace.router }}
          service={{
            query: {
              isLoading: parentQuery.isLoading,
              parent: filteredParent,
            },
          }}
          state={{
            onChange: setSearch,
            value: search,
          }}
        />
      </main>
    </SidebarLayout>
  );
};

export default DaftarOrangTuaContainer;
