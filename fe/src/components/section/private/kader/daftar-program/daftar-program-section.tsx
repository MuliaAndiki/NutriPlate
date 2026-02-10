import ProgramCard from "@/components/card/program/program-card";
import { ProgramRespone } from "@/types/res";
import { ChevronLeft } from "lucide-react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import DaftarProgramSectionSkeleton from "@/components/skeleton/private/kader/daftar-program/daftar-program-section-skeleton";
import EmptyCard from "@/components/fallback/empty-card";
import DataNotFound from "@/components/empty/data-not-found";

interface DaftarProgramKaderSectionProps {
  namespace: {
    router: AppRouterInstance;
  };
  service: {
    query: {
      program: ProgramRespone[];
      isLoading: boolean;
    };
  };
  selector: {
    role: string;
  };
}
const DaftarProgramKaderSection: React.FC<DaftarProgramKaderSectionProps> = ({
  namespace,
  service,
  selector,
}) => {
  const resProgram = service.query.program;
  if (!resProgram) {
    return <DataNotFound />;
  }
  if (service.query.isLoading) {
    return <DaftarProgramSectionSkeleton />;
  }
  return (
    <section className="-full min-h-screen flex justify-start items-center flex-col p-2 space-y-2">
      <div className="w-full flex items-center">
        <ChevronLeft
          className="scale-120"
          onClick={() => namespace.router.back()}
        />
        <h1 className="text-2xl font-bold">Program Posyandu</h1>
      </div>
      <div className="w-full">
        {resProgram.length === 0 ? (
          <EmptyCard message="Belum ada program tersedia" />
        ) : (
          resProgram.map((items) => (
            <ProgramCard
              res={items}
              role={selector.role}
              key={items.id}
              onClick={() =>
                namespace.router.push(
                  `/kader/daftar-program/detail/${items.id}`,
                )
              }
            />
          ))
        )}
      </div>
    </section>
  );
};

export default DaftarProgramKaderSection;
