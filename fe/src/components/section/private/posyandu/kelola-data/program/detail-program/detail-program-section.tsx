import ProgresListCard from "@/components/card/program/program-list";
import ListTask from "@/components/card/task/list-task";
import { Spinner } from "@/components/ui/spinner";
import { ButtonWrapper } from "@/components/wrapper/ButtonWrapper";
import { ProgresRespone, TaskProgramResponse } from "@/types/res";
import { AlertContexType } from "@/types/ui";
import { Icon } from "@iconify/react/dist/iconify.js";
import { ChevronLeft } from "lucide-react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

interface DetailProgramPosyanduSectionProps {
  namespace: {
    router: AppRouterInstance;
    pathname: string;
    alert: AlertContexType;
  };
  service: {
    query: {
      progres: ProgresRespone;
      isLoading: boolean;
      // task: TaskProgramResponse[];
    };
  };
  state: {
    taskId: string | null;
    setTaskId: React.Dispatch<React.SetStateAction<string | null>>;
  };
}
const DetailProgramPosyanduSection: React.FC<
  DetailProgramPosyanduSectionProps
> = ({ namespace, service, state }) => {
  // const LIMIT = 9;
  // const tasks = service.query.task;
  // const slicedTasks = tasks.slice(0, LIMIT);
  // const remainingCount = tasks.length - LIMIT;
  if (service.query.isLoading) {
    return <div>loading...</div>;
  }
  return (
    <section className="w-full min-h-screen overflow-x-hidden flex items-center justify-start flex-col space-y-2 p-2">
      <div className="w-full flex items-center justify-between">
        <div className="w-full flex items-center">
          <ChevronLeft
            onClick={() => namespace.router.back()}
            width={36}
            height={36}
          />
          <h1 className="font-bold text-xl">Detail Program</h1>
        </div>
      </div>
      <div className="w-full">
        <ProgresListCard
          key={service.query.progres.id}
          res={service.query.progres}
          pathname={namespace.pathname}
        />
      </div>
      <div className="w-full flex items-center flex-col space-y-1 justify-start">
        <div className="w-full flex items-center">
          <Icon
            icon="mingcute:task-2-fill"
            width="34"
            height="34"
            className="text-primary"
          />
          <h1 className="text-2xl font-bold">Daftar Gizi Harian</h1>
        </div>
        <p className="font-light ">
          Ikuti panduan berikut untuk membantu memenuhi kebutuhan makan anak
          hari ini.
        </p>
        <div className="w-full flex items-center space-x-1">
          <Icon
            icon="material-symbols:info-outline"
            width="24"
            height="24"
            className="text-info"
          />
          <h1 className="text-lg font-bold text-info">
            Centang setelah selesai dilakukan.
          </h1>
        </div>
      </div>
    </section>
  );
};

export default DetailProgramPosyanduSection;
