import HeaderHomeCard from "@/components/card/general/header/home";
import CardKontenHomeParent from "@/components/card/general/home-parent/card-content";
import CardKontenHomeParent2 from "@/components/card/general/home-parent/card-content2";
import CardKontenHomeParent3 from "@/components/card/general/home-parent/card-content3";
import CardKontenHomeParent4 from "@/components/card/general/home-parent/card-content4";
import {
  ChildRespone,
  GetStatusIotRespone,
  IotDeviceResponse,
  UserResponse,
} from "@/types/res";
import { Icon } from "@iconify/react/dist/iconify.js";
import HomeParentSectionSkeleton from "@/components/skeleton/private/parent/home/home-parent-section-skeleton";
import DataNotFound from "@/components/empty/data-not-found";
import { INotification } from "@/types/schema";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import ChildrenWiget from "@/components/wiget/child-home";
import PhoneScan from "@/components/svg/phone-scan";
import AsupanSvg from "@/components/svg/asupan";
import Grafik from "@/components/svg/grafix";
import Program from "@/components/svg/program";
import Link from "next/link";
import EmptyCard from "@/components/fallback/empty-card";
import IotStatus from "@/components/card/iot/iot-status";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface HomeParentSectionProps {
  namespace: {
    router: AppRouterInstance;
  };
  service: {
    query: {
      profile: UserResponse;
      isLoading: boolean;
      notifikasi: INotification;
      children: ChildRespone[];
      iotDevices: IotDeviceResponse[];
      iot: GetStatusIotRespone | null;
      selectedDeviceToken: string;
    };
  };
  actions: {
    onSelectDevice: (token: string) => void;
  };
}

const HomeParentHeroSection: React.FC<HomeParentSectionProps> = ({
  service,
  namespace,
  actions,
}) => {
  const resProfile = service.query.profile;
  const resChildren = service.query.children;
  const resIotDevices = service.query.iotDevices;
  const resIot = service.query.iot;

  const resNotifikasi = service.query.notifikasi;

  if (!resProfile || !resNotifikasi || !resChildren) {
    return <DataNotFound />;
  }
  if (service.query.isLoading) {
    return <HomeParentSectionSkeleton />;
  }
  const lengthIsRead = resNotifikasi.isRead === false;

  const AksiCepat = [
    {
      title: "Scan Makanan",
      image: PhoneScan(),
      border: "border border-info",
      background: "bg-info/20",
      href: "/parent/asupan-gizi",
    },
    {
      title: "Deteksi Makanan",
      image: AsupanSvg(),
      border: "border border-primary",
      background: "bg-primary/20",
      href: "/detection-food",
    },
    {
      title: "Grafik Pertumbuhan",
      image: Grafik(),
      border: "border border-primary",
      background: "bg-primary/20",
      href: "/parent/profile-anak",
    },
    {
      title: "Program Gizi",
      image: Program(),
      border: "border border-warning",
      background: "bg-warning/20",
      href: "/parent/program",
    },
  ];

  return (
    <div className="w-full overflow-hidden">
      <HeaderHomeCard
        res={resProfile ?? null}
        role={resProfile.role}
        isRead={lengthIsRead}
      />
      {resChildren ? (
        <section className="relative z-10 bg-background px-4 py-6 rounded-t-3xl  space-y-1">
          <Carousel className="w-full ">
            <CarouselContent>
              {resChildren.map((item, index) => (
                <CarouselItem key={index} className="w-full">
                  <ChildrenWiget res={item} key={item.id} index={index} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
          <div className="w-full flex items-center mt-2">
            <Icon
              icon="mingcute:star-fill"
              width="24"
              height="24"
              className="text-primary"
            />
            <h1 className="text-lg font-bold">Aksi Cepat</h1>
          </div>
          <div className="w-full grid grid-cols-2 grid-rows-2 gap-4">
            {AksiCepat.map((item, key) => (
              <Link
                href={item.href}
                className={`w-full flex items-center flex-col border rounded-lg p-2   ${item.border} ${item.background}`}
                key={key}
              >
                <div className="w-30 h-30 flex items-center">{item.image}</div>
                <h1 className="text-sm font-bold">{item.title}</h1>
              </Link>
            ))}
          </div>
          <div className="w-full flex items-center mt-1 space-x-1">
            <Icon
              icon="gravity-ui:cpu"
              width="26"
              height="26"
              className="text-primary"
            />
            <h1 className="text-lg font-bold">Perangkat Timbangan</h1>
          </div>
          <div className="w-full">
            {service.query.selectedDeviceToken ? (
              <IotStatus res={resIot} key={resIot?.id} />
            ) : (
              <EmptyCard
                message="Timbangan Belum Terhubung"
                title={
                  <Icon
                    icon="material-symbols:network-check-rounded"
                    width="34"
                    height="34"
                  />
                }
              />
            )}
          </div>
          <div className="w-full">
            <Select
              value={service.query.selectedDeviceToken}
              onValueChange={(value) => actions.onSelectDevice(value)}
            >
              <SelectTrigger className="w-full h-auto min-h-[48px]">
                <SelectValue placeholder="Pilih device" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Device Online</SelectLabel>
                  {resIotDevices.length === 0 && (
                    <SelectItem value="-" disabled>
                      Tidak ada device online
                    </SelectItem>
                  )}
                  {resIotDevices.map((item) => (
                    <SelectItem key={item.id} value={item.deviceToken}>
                      {item.deviceName} • {item.deviceToken}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </section>
      ) : (
        <section className="relative z-10 bg-background px-4 py-6 rounded-t-3xl  space-y-1">
          <CardKontenHomeParent />
          <div className="w-full flex items-center flex-col space-y-4 ">
            <div className="w-full flex items-center flex-col">
              <div className="w-full flex items-center">
                <Icon
                  icon="flowbite:star-solid"
                  width="36"
                  height="36"
                  className="text-primary"
                />
                <h1 className="text-2xl font-bold">Fitur Utama Aplikasi</h1>
              </div>

              <p className="font-light text-sm">
                Lengkapi data anak untuk mulai menggunakan semua fitur.
              </p>
            </div>

            <CardKontenHomeParent2 router={namespace.router} />
            <CardKontenHomeParent3 router={namespace.router} />
            <CardKontenHomeParent4 router={namespace.router} />
          </div>
        </section>
      )}
    </div>
  );
};

export default HomeParentHeroSection;
