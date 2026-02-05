import ChildrenList from "@/components/card/child/children-list";
import HeaderHomeCard from "@/components/card/general/header/home";
import BalitaRiskList from "@/components/card/kader/balita-risk";
import BalitaWarningList from "@/components/card/kader/balita-warning";
import KaderList from "@/components/card/posyandu/kaderList";
import { ButtonWrapper } from "@/components/wrapper/ButtonWrapper";
import {
  ChildListByPosyanduData,
  KaderDetailResponse,
  MeasurementRespone,
  UserResponse,
} from "@/types/res";
import { Icon } from "@iconify/react/dist/iconify.js";
import Image from "next/image";
import Link from "next/link";

interface HomePosyanduHeroSectionProps {
  service: {
    query: {
      profile: UserResponse;
      isLoading: boolean;
      childInPosyandu: ChildListByPosyanduData[];
      kader: KaderDetailResponse[];
      measurement: MeasurementRespone[];
    };
  };
}
const HomePosyanduHeroSection: React.FC<HomePosyanduHeroSectionProps> = ({
  service,
}) => {
  const resMeasuremnt = service.query.measurement;
  const resKader = service.query.kader;
  const resChild = service.query.childInPosyandu;
  const resProfile = service.query.profile;

  if (!resMeasuremnt || !resKader || !resChild || !resProfile) {
    return <div>data tidak ditemukan</div>;
  }
  if (service.query.isLoading) {
    return <div>loading..</div>;
  }
  const lengthChild = resChild.length;
  const nutritionStatusLenghtWarning = resMeasuremnt.filter(
    (item) => item.nutritionStatus === "severely_underweight",
  ).length;
  const nutritionStatusLenghtError = resMeasuremnt.filter(
    (item) => item.nutritionStatus === "underweight",
  ).length;
  const KaderLenght = resKader.length;

  const ActionFast = [
    {
      title: "Buat Program",
      image: "/images/board.png",
      href: "/posyandu/program",
    },
    {
      title: "Input Pengukuran",
      image: "/images/folder.png",
      href: "/posyandu/pengukuran",
    },
    {
      title: "Pantau Laporan",
      image: "/images/sheet.png",
      href: "/posyandu/laporan",
    },
  ];

  const buttonRouting = [
    {
      title: "Kader & Orang Tua",
      rightIcon: "fluent:arrow-right-24-filled",
      leftIcon: "mdi:human-male-child",
      href: "#",
    },
    {
      title: "Program Posyandu",
      rightIcon: "fluent:arrow-right-24-filled",
      leftIcon: "mdi:human-male-child",
      href: "#",
    },
  ];

  return (
    <section className="w-full overflow-hidden">
      <HeaderHomeCard res={resProfile ?? null} role={resProfile.role} />

      <section className="relative z-10 bg-background px-4  rounded-t-3xl  space-y-1">
        <div className="w-full p-2 grid grid-cols-2 grid-rows-2 gap-2">
          <ChildrenList lengthChild={lengthChild} />
          <BalitaRiskList lengthChild={nutritionStatusLenghtWarning} />
          <BalitaWarningList lengthChild={nutritionStatusLenghtError} />
          <KaderList length={KaderLenght} />
        </div>
        <div className="w-full flex items-center space-x-1">
          <Icon
            icon="uis:calender"
            width="24"
            height="24"
            className="text-primary"
          />
          <h1 className="text-lg font-bold">Aksi Cepat</h1>
        </div>
        <div className="w-full flex justify-between items-center gap-2">
          {ActionFast.map((items, key) => (
            <Link
              key={key}
              href={items.href}
              className="w-full p-2 rounded-lg bg-primary/40 flex border justify-center flex-col items-center"
            >
              <Image
                alt="pict"
                src={items.image}
                width={70}
                height={70}
                className="object-cover aspect-square"
              />
              <h1 className="text-lg font-bold">{items.title}</h1>
            </Link>
          ))}
        </div>
        <div className="w-full flex items-center space-x-1">
          <Icon
            icon="mdi:database"
            width="24"
            height="24"
            className="text-primary"
          />
          <h1 className="text-lg font-bold">Akses Data & Program</h1>
        </div>
        <div className="w-full">
          {buttonRouting.map((items, idx) => (
            <Link key={idx} href={items.href} className="w-full h-auto">
              <ButtonWrapper
                className="w-full p-2 my-1"
                rightIcon={
                  <Icon
                    icon={items.rightIcon}
                    width="38"
                    height="38"
                    className="text-background"
                  />
                }
                leftIcon={
                  <Icon
                    icon={items.leftIcon}
                    width="38"
                    height="38"
                    className="text-background"
                  />
                }
              >
                {items.title}
              </ButtonWrapper>
            </Link>
          ))}
        </div>
      </section>
    </section>
  );
};

export default HomePosyanduHeroSection;
