import ChildSelectTask from "@/components/card/child/child-select-task";
import AktifitasPropgramCard from "@/components/card/program/aktivitas-program";
import BenefitPropgramCard from "@/components/card/program/benefit-program";
import DeskripsiPropgramCard from "@/components/card/program/deskripsi-program";
import { ChildRespone, ProgramRespone } from "@/types/res";
import { camelCaseToWords } from "@/utils/string.format";
import { formatDateTime } from "@/utils/time.format";
import { ChevronLeft } from "lucide-react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

interface DetailProgramKaderSectionProps {
  namespace: {
    router: AppRouterInstance;
    pathname: string;
  };
  service: {
    query: {
      isLoading: boolean;
      children: ChildRespone[];
      program: ProgramRespone;
    };
  };
}
const DetailProgramKaderSection: React.FC<DetailProgramKaderSectionProps> = ({
  namespace,
  service,
}) => {
  const resProgram = service.query.program;
  const resChildren = service.query.children;

  const childFilter = resChildren.filter((item) =>
    item.programProgress?.some((progresId) => progresId.programId),
  );
  // need fallback
  if (!resProgram || !resChildren) {
    return <div>data tidak di temukan</div>;
  }
  if (service.query.isLoading) {
    return <div>loading...</div>;
  }
  return (
    <section className="-full min-h-screen flex justify-start items-center flex-col p-2 space-y-2">
      <div className="w-full flex items-center">
        <ChevronLeft
          className="scale-120"
          onClick={() => namespace.router.back()}
        />
        <h1 className="text-2xl font-bold">
          {camelCaseToWords(resProgram.name)}
        </h1>
      </div>
      <DeskripsiPropgramCard res={resProgram} />
      <div className="p-4 w-full rounded-lg border border-primary">
        <h1 className="">
          Batas Pendaftaran:
          {resProgram.durationRegister
            ? formatDateTime(resProgram.durationRegister, {
                style: "day-date-slash",
              })
            : "-"}
        </h1>
      </div>
      <AktifitasPropgramCard res={resProgram} />
      <BenefitPropgramCard res={resProgram} />
      <div className="w-full">
        {childFilter.map((items) => (
          <ChildSelectTask
            res={items}
            key={items.id}
            onClick={() =>
              namespace.router.push(
                `/kader/daftar-program/detail/${resProgram.id}/task/${items.id}`,
              )
            }
          />
        ))}
      </div>
    </section>
  );
};

export default DetailProgramKaderSection;
