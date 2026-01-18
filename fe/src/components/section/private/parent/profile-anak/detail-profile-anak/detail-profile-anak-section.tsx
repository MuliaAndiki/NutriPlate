import { Icon } from "@iconify/react/dist/iconify.js";
import { ChevronLeft } from "lucide-react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import Link from "next/link";
import ChildCard from "@/components/card/child/child-card";
import ProfileChildCard from "@/components/card/user/profile-child";
import StatusAsupan from "@/components/card/growth/status-asupan";
import { Button } from "@/components/ui/button";
import {
  profileChildCardsConfig,
  RouteDetailChild,
} from "@/configs/component.config";
import { formatDateTime } from "@/utils/time.format";
import { ChildRespone } from "@/types/res/child.respone";
import { MeasurementRespone } from "@/types/res/measurement.respone";

interface DetailProfileAnakProps {
  namespace: {
    router: AppRouterInstance;
  };
  service: {
    query: {
      ChildCard: ChildRespone;
      isLoading: boolean;
      Measuremnt: MeasurementRespone[];
    };
  };
}
const DetailProfileAnakHeroSection: React.FC<DetailProfileAnakProps> = ({
  namespace,
  service,
}) => {
  // fallback skeleton
  if (service.query.isLoading) {
    return <div>loading</div>;
  }
  const lastMeasurement = service.query.Measuremnt?.[0] ?? null;
  return (
    <div className="w-full min-h-screen flex justify-start items-center flex-col p-2">
      <div className="w-full flex  flex-col space-y-4">
        <div className="w-full flex justify-start items-center">
          <ChevronLeft
            onClick={() => namespace.router.back()}
            className="scale-120"
          />
          <h1 className="text-3xl font-bold">Profil Anak</h1>
        </div>

        <div className="w-full flex">
          <h1 className="text-lg font-bold">
            Pantau tumbuh kembang dan asupan gizi anak Anda
          </h1>
        </div>
        <div className="w-full">
          <ChildCard res={service.query.ChildCard} />
        </div>
        <div className="w-full flex justify-between items-center">
          <h1 className="font-extralight text-xs">Terakhir Diperbarui</h1>
          <h1 className="font-extralight text-xs">
            {formatDateTime(service.query.ChildCard.updatedAt, {
              style: "date",
            })}
            {formatDateTime(service.query.ChildCard.updatedAt, {
              style: "time",
            })}
          </h1>
        </div>
        <div className="w-full grid grid-cols-3 gap-2">
          {profileChildCardsConfig.map((item) => {
            const sourceData =
              item.source === "measurement" ? lastMeasurement : null;
            const value = item.getValue(sourceData);
            return (
              <ProfileChildCard
                key={item.key}
                label={item.label}
                value={value}
                unit={item.unit}
                icon={item.icon}
                color={item.color}
                border={item.border}
                header={item.header}
                text={item.text}
              />
            );
          })}
        </div>
        <div className="w-full space-y-4">
          <div className="w-full flex items-center space-x-1">
            <Icon
              icon="streamline:task-list-remix"
              width="25"
              height="25"
              className="text-primary"
            />
            <h1 className="text-xl font-extrabold">Data Pertumbuhan Anak</h1>
          </div>
          <p className="font-light">
            Kelola informasi, kesehatan, dan pertumbuhan anak
          </p>
          <div className="w-full h-auto  space-y-2 ">
            {RouteDetailChild.map((items, key) => (
              <Button variant={"btn"} className="w-full h-auto " key={key}>
                <Link
                  href={`${items.href}/${service.query.ChildCard.id}/${items.slice}`}
                  className="w-full h-auto  "
                >
                  <div className="w-full grid grid-cols-2 grid-rows-1 items-center ">
                    <div className="w-full flex justify-start items-center space-x-1">
                      <Icon
                        icon={items.icon}
                        width={34}
                        height={34}
                        className="scale-120"
                      />
                      <h1 className="text-lg font-extrabold">{items.title}</h1>
                    </div>
                    <div className="w-full border  flex justify-end">
                      <Icon icon={items.icon2} width={34} height={34} />
                    </div>
                  </div>
                </Link>
              </Button>
            ))}
          </div>
          <div className="w-full">
            <div className="w-full flex justify-start items-center space-x-2">
              <Icon
                icon="lsicon:rice-outline"
                width="36"
                height="36"
                className="text-primary"
              />
              <h1 className="text-2xl font-bold">Asupan Gizi Hari Ini</h1>
            </div>
            <p className="font-light">
              Kondisi gizi anak berdasarkan makanan hari ini
            </p>
            <div className="w-full mb-15">
              <StatusAsupan />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailProfileAnakHeroSection;
