"use client";

import { GetListKader } from "@/types/res";
import { Icon } from "@iconify/react";
import { ChevronLeft } from "lucide-react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import Link from "next/link";
import KaderCard from "@/components/card/kader/kader-list";
import DaftarKaderSectionSkeleton from "@/components/skeleton/private/posyandu/daftar-kader/daftar-kader-section-skeleton";
import DataNotFound from "@/components/empty/data-not-found";
import EmptyCard from "@/components/fallback/empty-card";

interface DaftarKaderPosyanduSectionProps {
  namespace: {
    router: AppRouterInstance;
  };
  service: {
    query: {
      kader: GetListKader[];
      isLoading: boolean;
    };
  };
}

const DaftarKaderPosyanduSection: React.FC<DaftarKaderPosyanduSectionProps> = ({
  namespace,
  service,
}) => {
  const resKader = service.query.kader;
  if (service.query.isLoading) {
    return <DaftarKaderSectionSkeleton />;
  }
  if (!resKader) {
    return <DataNotFound />;
  }

  return (
    <section className="flex w-full min-h-screen flex-col p-3 space-y-3">
      <div className="w-full flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <ChevronLeft
            onClick={() => namespace.router.back()}
            className="cursor-pointer"
          />
          <h1 className="text-xl font-bold">Daftar Kader</h1>
        </div>

        <Link href="/posyandu/daftar-kader/status">
          <Icon
            icon="fluent:status-12-filled"
            width={22}
            height={22}
            className="text-primary"
          />
        </Link>
      </div>

      {resKader.length === 0 ? (
        <EmptyCard message="Belum ada kader terdaftar" />
      ) : (
        <div className="flex flex-col space-y-2">
          {resKader.map((item, index) => (
            <KaderCard
              key={item.kader.id}
              index={index}
              data={item}
              onDetail={() =>
                namespace.router.push(
                  `/posyandu/kelola-data/detail-kader/${item.kader.id}`,
                )
              }
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default DaftarKaderPosyanduSection;
