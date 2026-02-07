"use client";

import { GetListKader } from "@/types/res";
import { Icon } from "@iconify/react";
import { ChevronLeft } from "lucide-react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import Link from "next/link";
import KaderCard from "@/components/card/kader/kader-list";

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
  if (service.query.isLoading) {
    return (
      <section className="w-full min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Memuat data kader...</p>
      </section>
    );
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

      {service.query.kader.length === 0 ? (
        <div className="text-center text-muted-foreground py-10">
          Belum ada kader terdaftar
        </div>
      ) : (
        <div className="flex flex-col space-y-2">
          {service.query.kader.map((item, index) => (
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
