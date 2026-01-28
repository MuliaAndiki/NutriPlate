"use client";

import { PosyanduRespone } from "@/types/res";
import { ChevronLeft, MapPin, Calendar, Phone, Mail } from "lucide-react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import Image from "next/image";

interface DetailPosyanduKaderSectionProps {
  namespace: {
    router: AppRouterInstance;
  };
  service: {
    query: {
      posyandu: PosyanduRespone | null;
      isLoading: boolean;
    };
  };
}

const dayLabel = (day: number) => {
  const map: Record<number, string> = {
    1: "Senin",
    2: "Selasa",
    3: "Rabu",
    4: "Kamis",
    5: "Jumat",
    6: "Sabtu",
    7: "Minggu",
  };
  return map[day] ?? "-";
};

const DetailPosyanduKaderSection: React.FC<DetailPosyanduKaderSectionProps> = ({
  namespace,
  service,
}) => {
  const data = service.query.posyandu;

  if (service.query.isLoading) {
    return (
      <section className="w-full min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading detail posyandu...</p>
      </section>
    );
  }

  if (!data) {
    return (
      <section className="w-full min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Data posyandu tidak ditemukan</p>
      </section>
    );
  }

  return (
    <section className="w-full min-h-screen flex flex-col p-3 space-y-4">
      <div className="flex items-center space-x-2">
        <ChevronLeft
          className="cursor-pointer"
          onClick={() => namespace.router.back()}
        />
        <h1 className="text-lg font-bold">Detail Posyandu</h1>
      </div>

      <div className="w-full flex flex-col items-center space-y-2 pt-2">
        <Image
          src={data.avaUrl || "/images/posyanduDummy.png"}
          alt={data.name}
          width={80}
          height={80}
          className="rounded-full object-cover"
        />
        <h2 className="text-xl font-bold text-center">{data.name}</h2>
      </div>

      <div className="w-full flex flex-col space-y-3">
        <div className="w-full border rounded-xl p-3 space-y-1">
          <div className="flex items-center text-sm font-medium">
            <MapPin className="w-4 h-4 mr-2 text-muted-foreground" />
            Lokasi
          </div>
          <p className="text-sm text-muted-foreground">
            {data.district}, {data.village}, {data.subDistrict}
          </p>
        </div>

        <div className="w-full border rounded-xl p-3 space-y-1">
          <div className="flex items-center text-sm font-medium">
            <Calendar className="w-4 h-4 mr-2 text-muted-foreground" />
            Jadwal Kegiatan
          </div>
          <p className="text-sm text-muted-foreground">
            Hari {dayLabel(data.scheduleDay)}
          </p>
        </div>

        {(data.phone || data.email) && (
          <div className="w-full border rounded-xl p-3 space-y-2">
            <p className="text-sm font-medium">Kontak</p>

            {data.phone && (
              <div className="flex items-center text-sm text-muted-foreground">
                <Phone className="w-4 h-4 mr-2" />
                {data.phone}
              </div>
            )}

            {data.email && (
              <div className="flex items-center text-sm text-muted-foreground">
                <Mail className="w-4 h-4 mr-2" />
                {data.email}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default DetailPosyanduKaderSection;
