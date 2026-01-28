import ChildrenList from "@/components/card/child/children-list";
import HeaderHomeCard from "@/components/card/general/header/home";
import { ButtonWrapper } from "@/components/wrapper/ButtonWrapper";
import {
  ChildListByPosyanduData,
  MeasurementRespone,
  PosyanduRespone,
  UserResponse,
} from "@/types/res";
import { PopUpNavigate } from "@/types/ui";
import PopUp from "@/components/ui/pop-up";

import { Icon } from "@iconify/react/dist/iconify.js";
import RegisterKaderForm from "./_registerKader/registerKader";
import Link from "next/link";
import BalitaRiskList from "@/components/card/kader/balita-risk";
import BalitaWarningList from "@/components/card/kader/balita-warning";
import PosyanduList from "@/components/card/kader/list-posyandu";

interface HomeKaderHeroSectionProps {
  service: {
    query: {
      profile: UserResponse;
      isLoading: boolean;
      childInPosyandu: ChildListByPosyanduData[];
      posyandu: PosyanduRespone[];
      measurement: MeasurementRespone[];
    };
    mutation: {
      onRegisterKader: () => void;
      isPending: boolean;
    };
  };
  state: {
    popup: PopUpNavigate;
    setPopup: React.Dispatch<React.SetStateAction<PopUpNavigate>>;
    posyanduId: string;
    setPosyabduId: React.Dispatch<React.SetStateAction<string>>;
  };
}

const HomeKaderHeroSection: React.FC<HomeKaderHeroSectionProps> = ({
  service,
  state,
}) => {
  if (service.query.isLoading) {
    return <div>loading..</div>;
  }
  const buttonRouting = [
    {
      title: "Daftar Orang Tua",
      rightIcon: "fluent:arrow-right-24-filled",
      leftIcon: "raphael:parent",
      href: "/kader/daftar-orang-tua",
    },
    {
      title: "Program Posyandu",
      rightIcon: "fluent:arrow-right-24-filled",
      leftIcon: "raphael:parent",
      href: "/kader/daftar-program",
    },
  ];
  const lengthChild = service.query.childInPosyandu.length;
  const nutritionStatusLenghtWarning = service.query.measurement.filter(
    (item) => item.nutritionStatus === "severely_underweight",
  ).length;
  const nutritionStatusLenghtError = service.query.measurement.filter(
    (item) => item.nutritionStatus === "underweight",
  ).length;
  const posyanduLenght = service.query.posyandu.length;
  return (
    <div className="w-full overflow-hidden">
      <HeaderHomeCard
        res={service.query.profile ?? null}
        role={service.query.profile.role}
      />
      <section className="relative z-10 bg-background px-4  rounded-t-3xl  space-y-1">
        <div className="w-full p-2 grid grid-cols-2 grid-rows-2 gap-2">
          <ChildrenList lengthChild={lengthChild} />
          <BalitaRiskList lengthChild={nutritionStatusLenghtWarning} />
          <BalitaWarningList lengthChild={nutritionStatusLenghtError} />
          <PosyanduList length={posyanduLenght} />
        </div>
        <div className="w-full flex items-center  space-x-1">
          <Icon
            icon="uil:calender"
            width="34"
            height="34"
            className="text-primary"
          />
          <h1 className="text-2xl font-bold">Jadwal Posyandu</h1>
        </div>
        <div className="w-full">
          {service.query.profile.posyanduId === null && (
            <div className="w-full border border-dashed rounded-xl p-4 flex flex-col items-center justify-center text-center space-y-3 bg-muted/30">
              <Icon
                icon="mdi:home-plus-outline"
                width={48}
                height={48}
                className="text-muted-foreground"
              />

              <h2 className="text-lg font-semibold">
                Belum Terdaftar di Posyandu
              </h2>

              <p className="text-sm text-muted-foreground max-w-xs">
                Kamu belum terhubung dengan posyandu manapun. Silakan daftar
                atau hubungi admin posyandu untuk mulai mengelola data anak.
              </p>

              <ButtonWrapper
                className="mt-2 px-4 py-2 rounded-lg bg-primary text-background text-sm font-medium hover:bg-primary/90 transition"
                onClick={() => state.setPopup("fRegisterKader")}
              >
                Daftar Posyandu
              </ButtonWrapper>
            </div>
          )}
        </div>
        <div className="w-full">
          <div className="w-full flex items-center">
            <Icon
              icon="bx:data"
              width="38"
              height="38"
              className="text-primary"
            />
            <h1 className="font-bold text-2xl">Akses Data & Program</h1>
          </div>
          {buttonRouting.map((items, idx) => (
            <Link key={idx} href={items.href} className="w-full h-auto">
              <ButtonWrapper
                className="w-full text-start my-1"
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
        <div className="w-full">
          <h1 className="text-2xl font-bold">Balita Perlu Perhatian</h1>
        </div>
        <PopUp
          isOpen={state.popup === "fRegisterKader"}
          onClose={() => state.setPopup(null)}
        >
          <RegisterKaderForm
            posyandu={service.query.posyandu ?? []}
            onRegisterKader={() => service.mutation.onRegisterKader()}
            posyanduId={state.posyanduId}
            setPosyanduId={state.setPosyabduId}
            isPending={service.mutation.isPending}
          />
        </PopUp>
      </section>
    </div>
  );
};

export default HomeKaderHeroSection;
