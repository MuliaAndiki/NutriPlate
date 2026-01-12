import ChildProgramCard from "@/components/card/child-program-card";
import ProgramCard from "@/components/card/program-card";
import { Button } from "@/components/ui/button";
import { ButtonWrapper } from "@/components/wrapper/ButtonWrapper";
import { ChildCardType } from "@/types/card";
import { ProgramRespon } from "@/types/res";
import { Icon } from "@iconify/react/dist/iconify.js";

interface ProgramSectionProps {
  service: {
    query: {
      childType: ChildCardType[];
      programType: ProgramRespon[];
    };
  };
}
const ProgramHeroSection: React.FC<ProgramSectionProps> = ({ service }) => {
  return (
    <div className="w-full min-h-full flex justify-start items-start flex-col space-y-2">
      <h1 className="text-3xl font-extrabold">Program Gizi Anak</h1>
      <p className="text-lg font-bold text-foreground/80">
        Ikuti program pendampingan gizi untuk mendukung tumbuh kembang anak
      </p>
      <div className="w-full">
        {service.query.childType.slice(0, 3).map((items) => (
          <ChildProgramCard key={items.id} childType={items} />
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
      <div className="flex w-full justify-between items-center gap-4 ">
        <div className="w-full">
          <Button className="w-full" variant={"linter"}>
            Semua Program
          </Button>
        </div>
        <div className="w-full">
          <Button className="w-full" variant={"notLinter"}>
            Program Diikuti
          </Button>
        </div>
      </div>
      <div className="w-full space-y-2">
        {service.query.programType.map((items) => (
          <ProgramCard res={items} key={items.id} />
        ))}
      </div>
    </div>
  );
};

export default ProgramHeroSection;
