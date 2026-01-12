import AktifitasPropgramCard from "@/components/card/aktivitas-program";
import BenefitPropgramCard from "@/components/card/benefit-program";
import DeskripsiPropgramCard from "@/components/card/deskripsi-program";
import { IProgramNutriPlate } from "@/types/schema/program.schema";
import { formatDateTime } from "@/utils/time.format";
import { ChevronLeft } from "lucide-react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

interface DetailProgramSectionProps {
  service: {
    query: {
      program: IProgramNutriPlate;
      isLoading: boolean;
    };
  };
  namespace: {
    router: AppRouterInstance;
  };
}
const DetailProgramHeroSection: React.FC<DetailProgramSectionProps> = ({
  service,
  namespace,
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
          Batas Pendaftaran:{" "}
          {formatDateTime(service.query.program.durationRegister, {
            style: "day-date-slash",
          })}
        </h1>
      </div>
      <AktifitasPropgramCard res={service.query.program} />
      <BenefitPropgramCard res={service.query.program} />
    </section>
  );
};

export default DetailProgramHeroSection;
