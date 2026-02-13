import ProgramCard from "@/components/card/program/program-card";
import DataNotFound from "@/components/empty/data-not-found";
import EmptyCard from "@/components/fallback/empty-card";
import ProgramSkeleton from "@/components/skeleton/private/posyandu/program/program-skeleton";
import { ButtonWrapper } from "@/components/wrapper/ButtonWrapper";
import { ProgramRespone } from "@/types/res/program-with-progres";
import { Icon } from "@iconify/react/dist/iconify.js";
import Link from "next/link";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

interface ProgramPosyanduSectionProps {
  namespace: {
    router: AppRouterInstance;
  };
  service: {
    query: {
      isLoading: boolean;
      program: ProgramRespone[];
      filteredProgram: ProgramRespone[];
      filter: "running" | "all";
    };
  };
  handler: {
    setFilter: (filter: "running" | "all") => void;
  };
  selector: {
    role: string;
  };
}

const ProgramPosyanduSection: React.FC<ProgramPosyanduSectionProps> = ({
  service,
  namespace,
  handler,
  selector,
}) => {
  const resProgram = service.query.program;
  const filter = service.query.filter;
  const filteredProgram = service.query.filteredProgram;

  if (!resProgram) {
    return <DataNotFound />;
  }
  if (service.query.isLoading) {
    return <ProgramSkeleton />;
  }

  return (
    <section className="flex w-full min-h-screen flex-col items-center justify-start overflow-x-hidden space-y-2 p-2">
      <div className="w-full">
        <h1 className="text-2xl font-bold">Program & Laporan</h1>
      </div>
      <div className="w-full flex items-center  justify-between">
        <div className="w-full flex items-center">
          <Icon
            icon="hugeicons:task-01"
            width="34"
            height="34"
            className="text-primary"
          />
          <h1 className="font-bold text-lg">Daftar Program</h1>
        </div>
        {resProgram.length !== 0 && (
          <ButtonWrapper
            variant={"notLinter"}
            onClick={() => namespace.router.push("/posyandu/program/create")}
          >
            Tambah
          </ButtonWrapper>
        )}
        <Link href={`/posyandu/program/status`}>
          <Icon
            icon="fluent:status-12-filled"
            width="44"
            height="44"
            className="text-primary"
          />
        </Link>
      </div>
      <p className="font-light text-start">
        Kelola seluruh program kesehatan posyandu dari sini.
      </p>
      <div className="w-full grid grid-cols-2 grid-rows-1 gap-2 border-y py-4">
        <ButtonWrapper
          variant={filter === "running" ? "notLinter" : "linter"}
          onClick={() => handler.setFilter("running")}
        >
          Program Berjalan
        </ButtonWrapper>
        <ButtonWrapper
          variant={filter === "all" ? "notLinter" : "linter"}
          onClick={() => handler.setFilter("all")}
        >
          Semua Program
        </ButtonWrapper>
      </div>
      <div className="w-full space-y-2">
        {filteredProgram.length === 0 ? (
          <EmptyCard message="Belum ada program berjalan" />
        ) : (
          filteredProgram.map((items) => (
            <ProgramCard
              res={items}
              key={items.id}
              role={selector.role}
              onClick={() =>
                namespace.router.push(
                  `/${selector.role.toLocaleLowerCase()}/program/detail/${items.id}`,
                )
              }
            />
          ))
        )}
      </div>
    </section>
  );
};

export default ProgramPosyanduSection;
