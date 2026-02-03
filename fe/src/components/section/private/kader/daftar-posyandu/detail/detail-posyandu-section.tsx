"use client";

import { PosyanduRespone } from "@/types/res";
import { Icon } from "@iconify/react/dist/iconify.js";
import { ChevronLeft, MapPin, Calendar, Phone, Mail } from "lucide-react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import Image from "next/image";
import React from "react";

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

  const mappingContent = [
    {
      icon: "solar:hospital-bold",
      name: "Nama Posyandu",
      res: data.name,
    },
    {
      icon: "solar:phone-bold",
      name: "Nomor HP",
      res: data.phone || "-",
    },
    {
      icon: "solar:letter-bold",
      name: "Email",
      res: data.email || "-",
    },
    {
      icon: "solar:map-point-bold",
      name: "Alamat",
      res: `${data.district}, ${data.subDistrict}, ${data.village}`,
    },
    {
      icon: "solar:calendar-bold",
      name: "Jadwal Posyandu",
      res: dayLabel(data.scheduleDay),
    },
  ];

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
          width={150}
          height={150}
          className="rounded-full aspect-square object-cover"
        />
        <h2 className="text-xl font-bold text-center">{data.name}</h2>
      </div>

      <div className="w-full border grid grid-cols-2 gap-y-3 p-3 rounded-lg">
        {mappingContent.map((item, index) => (
          <React.Fragment key={index}>
            <div className="flex items-center gap-2">
              <Icon
                icon={item.icon}
                width={22}
                height={22}
                className="text-primary"
              />
              <span className="text-lg font-semibold">{item.name}</span>
              <span className="text-end">:</span>
            </div>
            <span className="text-sm text-muted-foreground">{item.res}</span>
          </React.Fragment>
        ))}
      </div>
    </section>
  );
};

export default DetailPosyanduKaderSection;
