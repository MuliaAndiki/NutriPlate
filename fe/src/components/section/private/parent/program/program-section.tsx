import ChildProgramCard from "@/components/card/child/child-program-card";
import ProgramCard from "@/components/card/program/program-card";
import { Button } from "@/components/ui/button";
import { ButtonWrapper } from "@/components/wrapper/ButtonWrapper";
import { ChildRespone } from "@/types/res/child.respone";
import { Icon } from "@iconify/react/dist/iconify.js";
import { ProgramRespone } from "@/types/res/program-with-progres";

interface ProgramSectionProps {
  service: {
    query: {
      childType: ChildRespone[];
      programType: ProgramRespone[];
    };
  };
  namespace: {
    pathname: string;
  };
  state: {
    programFilter: "ALL" | "FOLLOWED";
    setProgramFilter: React.Dispatch<React.SetStateAction<"ALL" | "FOLLOWED">>;
  };
}
const ProgramHeroSection: React.FC<ProgramSectionProps> = ({
  service,
  namespace,
  state,
}) => {
  const programRender = service.query.programType.filter((program) => {
    if (state.programFilter === "ALL") return true;
    return program.progress.length > 0;
  });
  return (
    <div className="w-full min-h-full flex justify-start items-start flex-col space-y-5">
      <h1 className="text-3xl font-extrabold">Program Gizi Anak</h1>
      <p className="text-lg font-bold text-foreground/80">
        Ikuti program pendampingan gizi untuk mendukung tumbuh kembang anak
      </p>
      <div className="w-full">
        {service.query.childType.slice(0, 3).map((items) => (
          <ChildProgramCard
            key={items.id}
            childType={items}
            pathname={namespace.pathname}
          />
        ))}
      </div>
      <ButtonWrapper
        className="w-full"
        variant={"btn"}
        startIcon={<Icon icon="line-md:arrow-down" width="24" height="24" />}
      >
        Ikuti Program
      </ButtonWrapper>
      <div className="w-full flex items-center justify-start">
        <Icon
          icon="si:ai-note-duotone"
          width="24"
          height="24"
          className="text-primary"
        />
        <h1 className="font-bold text-2xl">Program Posyandu</h1>
      </div>
      <div className="flex w-full justify-between items-center gap-4">
        <div className="w-full">
          <Button
            className="w-full"
            variant={state.programFilter === "ALL" ? "linter" : "notLinter"}
            onClick={() => state.setProgramFilter("ALL")}
          >
            Semua Program
          </Button>
        </div>

        <div className="w-full">
          <Button
            className="w-full"
            variant={
              state.programFilter === "FOLLOWED" ? "linter" : "notLinter"
            }
            onClick={() => state.setProgramFilter("FOLLOWED")}
          >
            Program Diikuti
          </Button>
        </div>
      </div>
      <div className="w-full space-y-2">
        {programRender.length === 0 ? (
          <p className="text-sm text-foreground/60">
            {state.programFilter === "FOLLOWED"
              ? "Belum ada program yang diikuti anak"
              : "Program belum tersedia"}
          </p>
        ) : (
          programRender.map((items) => (
            <ProgramCard res={items} key={items.id} />
          ))
        )}
      </div>
    </div>
  );
};

export default ProgramHeroSection;
