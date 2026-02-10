import AktifitasPropgramCard from "@/components/card/program/aktivitas-program";
import BenefitPropgramCard from "@/components/card/program/benefit-program";
import DeskripsiPropgramCard from "@/components/card/program/deskripsi-program";
import DataNotFound from "@/components/empty/data-not-found";
import DetailProgramSectionSkeleton from "@/components/skeleton/private/kader/daftar-program/detail-program/detail-program-section-skeleton";
import { IProgram } from "@/types/schema";
import { AlertContexType } from "@/types/ui";
import { camelCaseToWords } from "@/utils/string.format";
import { formatDateTime } from "@/utils/time.format";
import { Icon } from "@iconify/react/dist/iconify.js";
import { ChevronLeft } from "lucide-react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

interface DetailProgramPosyanduSectionProps {
  namespace: {
    router: AppRouterInstance;
    alert: AlertContexType;
  };
  service: {
    query: {
      program: IProgram;
      isLoading: boolean;
    };
    mutation: {
      deleteProgram: () => void;
      isPending: boolean;
    };
  };
}
const DetailProgramPosyanduSection: React.FC<
  DetailProgramPosyanduSectionProps
> = ({ service, namespace }) => {
  const resProgram = service.query.program;

  if (!resProgram) {
    return <DataNotFound />;
  }
  if (service.query.isLoading) {
    return <DetailProgramSectionSkeleton />;
  }
  return (
    <section className="flex w-full min-h-screen flex-col items-center justify-start overflow-x-hidden space-y-2 p-2">
      <div className="w-full h-auto flex items-center">
        <ChevronLeft
          onClick={() => namespace.router.back()}
          width={36}
          height={36}
        />
        <h1 className="text-3xl font-extrabold">
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
      <div className="w-full flex items-center justify-between p-4 rounded-lg border">
        <h1 className="text-lg font-bold">Aksi</h1>
        <div className="flex items-center space-x-5">
          <Icon
            icon="uil:edit"
            width="26"
            height="26"
            className="text-primary"
          />
          <Icon
            icon="pajamas:remove"
            width="26"
            height="26"
            className="text-destructive"
            onClick={() =>
              namespace.alert.confirm({
                icon: "question",
                title: "Perhatian",
                deskripsi: "Apakah Kamu Yakin Menghapus ini",
                onConfirm: () => {
                  service.mutation.deleteProgram();
                },
              })
            }
          />
        </div>
      </div>
    </section>
  );
};

export default DetailProgramPosyanduSection;
