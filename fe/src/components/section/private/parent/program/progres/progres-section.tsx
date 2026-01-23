import ProgramListCard from "@/components/card/program/program-list";
import { ProgresRespone } from "@/types/res";
import { ChildRespone } from "@/types/res/child.respone";
import { Icon } from "@iconify/react/dist/iconify.js";
import { ChevronLeft } from "lucide-react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

interface ProgresProgramSectionProps {
  namespace: {
    router: AppRouterInstance;
  };
  service: {
    query: {
      childType: ChildRespone;
      isLoading: boolean;
      progres: ProgresRespone;
    };
  };
}
const ProgresProgramSection: React.FC<ProgresProgramSectionProps> = ({
  namespace,
  service,
}) => {
  // Falback Skeleton
  if (service.query.isLoading) {
    return <div>loading..</div>;
  }
  return (
    <section className="w-full min-h-screen flex justify-start p-2 items-center flex-col overflow-x-hidden space-y-3">
      <div className="w-full flex items-center justify-between">
        <div className="w-full items-center flex">
          <ChevronLeft
            onClick={() => namespace.router.back()}
            width={36}
            height={36}
          />
          <h1 className="text-2xl font-bold">
            Program <span>{service.query.childType.fullName}</span>
          </h1>
        </div>
      </div>
      <div className="w-full flex items-center">
        <Icon
          icon="si:ai-note-duotone"
          width="30"
          height="30"
          className="text-primary"
        />
        <h1 className="text-2xl font-bold">Program Berjalan</h1>
      </div>
      <div className="w-full">
        <ProgramListCard />
      </div>
    </section>
  );
};

export default ProgresProgramSection;
