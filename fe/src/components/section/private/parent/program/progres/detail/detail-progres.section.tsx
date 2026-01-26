import ProgresListCard from "@/components/card/program/program-list";
import ListTask from "@/components/card/task/list-task";
import { Spinner } from "@/components/ui/spinner";
import { ButtonWrapper } from "@/components/wrapper/ButtonWrapper";
import { ProgresRespone, TaskProgramResponse } from "@/types/res";
import { AlertContexType } from "@/types/ui";
import { Icon } from "@iconify/react/dist/iconify.js";
import { ChevronLeft } from "lucide-react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

interface ProgresDetailSectionProps {
  namespace: {
    router: AppRouterInstance;
    pathname: string;
    alert: AlertContexType;
  };
  service: {
    mutation: {
      isPending: boolean;
      onCancelPropgram: () => void;
    };
    query: {
      progres: ProgresRespone;
      isLoading: boolean;
      task: TaskProgramResponse[];
    };
  };
  state: {
    taskId: string | null;
    setTaskId: React.Dispatch<React.SetStateAction<string | null>>;
  };
  actions: {
    onOpenCameraForTask: (taskId: string) => void;
  };
}
const ProgresDetailSection: React.FC<ProgresDetailSectionProps> = ({
  namespace,
  service,
  state,
  actions,
}) => {
  const LIMIT = 9;
  const tasks = service.query.task;
  const slicedTasks = tasks.slice(0, LIMIT);
  const remainingCount = tasks.length - LIMIT;
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
        <ButtonWrapper
          variant={"destructive"}
          disabled={service.mutation.isPending}
          onClick={() => {
            namespace.alert.modal({
              title: "batalkan",
              deskripsi: "yakin batalkan program ini?",
              icon: "warning",
              onConfirm: () => {
                service.mutation.onCancelPropgram();
              },
            });
          }}
          className="text-background"
        >
          {service.mutation.isPending ? <Spinner /> : "Batalkan Program"}
        </ButtonWrapper>
      </div>
      <div className="w-full">
        <ProgresListCard
          key={service.query.progres.id}
          res={service.query.progres}
          pathname={namespace.pathname}
          childId={service.query.progres.childId}
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
        <div className="w-full space-y-2">
          {slicedTasks.map((items) => (
            <div key={items.id} className="w-full space-y-2">
              <ListTask
                res={items}
                setTaskId={state.setTaskId}
                taskId={state.taskId}
              />

              <button
                onClick={() => actions.onOpenCameraForTask(items.id)}
                className="w-full px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg font-medium text-sm flex items-center justify-center space-x-2 transition"
              >
                <Icon icon="tabler:line-scan" width="20" height="20" />
                <span> Scan untuk Selesaikan Task Ini</span>
              </button>
            </div>
          ))}

          {remainingCount > 0 && (
            <div className="w-full text-center text-sm text-muted-foreground py-2">
              +{remainingCount} tugas lainnya belum ditampilkan
            </div>
          )}
        </div>
      </div>
      <div className="fixed bottom-20 left-0 w-full z-21 p-2">
        <ButtonWrapper
          className="w-full"
          disabled={!state.taskId}
          onClick={() => namespace.router.push("/parent/asupan-gizi")}
        >
          Tandai Selesai
        </ButtonWrapper>
      </div>
    </section>
  );
};

export default ProgresDetailSection;
