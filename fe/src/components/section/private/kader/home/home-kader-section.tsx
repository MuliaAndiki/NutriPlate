import ChildrenList from "@/components/card/child/children-list";
import HeaderHomeCard from "@/components/card/general/header/home";
import { ButtonWrapper } from "@/components/wrapper/ButtonWrapper";
import {
  ChildListByPosyanduData,
  PosyanduRespone,
  UserResponse,
} from "@/types/res";
import { PopUpNavigate } from "@/types/ui";
import PopUp from "@/components/ui/pop-up";

import { Icon } from "@iconify/react/dist/iconify.js";
import RegisterKaderForm from "./_registerKader/registerKader";

interface HomeKaderHeroSectionProps {
  service: {
    query: {
      profile: UserResponse;
      isLoading: boolean;
      childInPosyandu: ChildListByPosyanduData[];
      posyandu: PosyanduRespone[];
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

  const lengthChild = service.query.childInPosyandu.length;
  return (
    <div className="w-full overflow-hidden">
      <HeaderHomeCard
        res={service.query.profile ?? null}
        role={service.query.profile.role}
      />
      <section className="relative z-10 bg-background px-4  rounded-t-3xl  space-y-1">
        <div className="w-full p-2 grid grid-cols-2 grid-rows-2">
          <ChildrenList lengthChild={lengthChild} />
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
