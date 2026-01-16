import AktifitasPropgramCard from "@/components/card/program/aktivitas-program";
import BenefitPropgramCard from "@/components/card/program/benefit-program";
import DeskripsiPropgramCard from "@/components/card/program/deskripsi-program";
import PopUp from "@/components/ui/pop-up";
import { ButtonWrapper } from "@/components/wrapper/ButtonWrapper";
import { IProgram } from "@/types/schema/program.schema";
import { PopUpNavigate } from "@/types/ui";
import { formatDateTime } from "@/utils/time.format";
import { Icon } from "@iconify/react/dist/iconify.js";
import { ChevronLeft } from "lucide-react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import RegisterProgram from "./_register-program/register-program";
import { ChildRespone } from "@/types/res/child.respone";

interface DetailProgramSectionProps {
  service: {
    query: {
      program: IProgram;
      isLoading: boolean;
      children: ChildRespone[];
    };
  };
  namespace: {
    router: AppRouterInstance;
    pathname: string;
  };
  state: {
    popUp: PopUpNavigate;
    setPopUp: React.Dispatch<React.SetStateAction<PopUpNavigate>>;
    setIdChild: React.Dispatch<React.SetStateAction<string | null>>;
    idChild: string | null;
  };
}
const DetailProgramHeroSection: React.FC<DetailProgramSectionProps> = ({
  service,
  namespace,
  state,
}) => {
  //falback skeleton
  if (service.query.isLoading) {
    return <div>loading....</div>;
  }
  return (
    <section className="w-full flex justify-start items-center flex-col min-h-screen overflow-x-hidden space-y-4">
      <div className="w-full h-auto flex items-center">
        <ChevronLeft
          onClick={() => namespace.router.back()}
          width={36}
          height={36}
        />
        <h1 className="text-3xl font-extrabold">
          {service.query.program.name}
        </h1>
      </div>
      <DeskripsiPropgramCard res={service.query.program} />
      <div className="p-4 w-full rounded-lg border border-primary">
        <h1 className="">
          Batas Pendaftaran:
          {formatDateTime(service.query.program.durationRegister, {
            style: "day-date-slash",
          })}
        </h1>
      </div>
      <AktifitasPropgramCard res={service.query.program} />
      <BenefitPropgramCard res={service.query.program} />
      <div className="w-full h-auto">
        <ButtonWrapper
          className="w-full p-4"
          onClick={() => state.setPopUp("fProgram")}
          startIcon={<Icon icon="mingcute:plus-fill" width="24" height="24" />}
        >
          Ikuti Program
        </ButtonWrapper>
      </div>
      <PopUp
        isOpen={state.popUp === "fProgram"}
        onClose={() => state.setPopUp(null)}
      >
        <RegisterProgram
          idChild={state.idChild}
          setIdChild={state.setIdChild}
          children={service.query.children}
          pathname={namespace.pathname}
        />
      </PopUp>
    </section>
  );
};

export default DetailProgramHeroSection;
