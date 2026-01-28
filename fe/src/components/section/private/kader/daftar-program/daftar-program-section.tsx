import ProgramCard from "@/components/card/program/program-card";
import { ProgramRespone } from "@/types/res";
import { ChevronLeft } from "lucide-react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

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
}
const DaftarProgramKaderSection: React.FC<DaftarProgramKaderSectionProps> = ({
  namespace,
  service,
}) => {
  if (service.query.isLoading) {
    return <div>loading ..</div>;
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
        {service.query.program.map((items) => (
          <ProgramCard res={items} key={items.id} />
        ))}
      </div>
    </section>
  );
};

export default DaftarProgramKaderSection;
