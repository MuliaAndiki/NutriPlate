"use client";

import { Input } from "@/components/ui/input";
import { ParentListResponse } from "@/types/res";
import { ChevronLeft, Search } from "lucide-react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import ParentCard from "@/components/card/parent/parent-list";
interface DaftarOrangTuaSectionProps {
  namespace: {
    router: AppRouterInstance;
  };
  service: {
    query: {
      parent: ParentListResponse[];
      isLoading: boolean;
    };
  };
  state: {
    value: string;
    onChange: (value: string) => void;
  };
}

const DaftarOrangTuaSection: React.FC<DaftarOrangTuaSectionProps> = ({
  namespace,
  service,
  state,
}) => {
  if (service.query.isLoading) {
    return (
      <section className="w-full min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">
          Belum ada data orang tua yang tersedia...
        </p>
      </section>
    );
  }

  return (
    <section className="w-full min-h-screen flex flex-col p-3 space-y-3">
      <div className="flex items-center space-x-2">
        <ChevronLeft
          className="cursor-pointer"
          onClick={() => namespace.router.back()}
        />
        <h1 className="text-lg font-bold">Daftar Orang Tua</h1>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Cari disini..."
          className="pl-9"
          value={state.value}
          onChange={(e) => state.onChange(e.target.value)}
        />
      </div>

      <div className="flex flex-col space-y-2">
        {service.query.parent.length === 0 ? (
          <div className="text-center text-muted-foreground py-10">
            Data tidak ditemukan
          </div>
        ) : (
          service.query.parent.map((item, index) => (
            <ParentCard key={item.id} index={index} data={item} />
          ))
        )}
      </div>
    </section>
  );
};

export default DaftarOrangTuaSection;
