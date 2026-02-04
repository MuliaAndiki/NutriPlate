import ChildParent from "@/components/card/child/child-parent";
import TaskProgramCard from "@/components/card/task/task-program-card";
import { ButtonWrapper } from "@/components/wrapper/ButtonWrapper";
import { ChildRespone, TaskProgramResponse } from "@/types/res";
import { AlertContexType, PopUpNavigate } from "@/types/ui";
import { camelCaseToWords } from "@/utils/string.format";
import { ChevronLeft } from "lucide-react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import PopUp from "@/components/ui/pop-up";
import { FormCreateTask } from "@/types/form";
import CreateTaskForm from "./_create-task/create-task";
import { Icon } from "@iconify/react/dist/iconify.js";

interface TaskKaderSectionProps {
  namespace: {
    router: AppRouterInstance;
    alert: AlertContexType;
  };
  service: {
    query: {
      children: ChildRespone;
      isLoading: boolean;
      task: TaskProgramResponse[];
    };
    mutation: {
      isPending: boolean;
      onCreateTask: () => void;
      onDelete: () => void;
    };
  };
  state: {
    popUp: PopUpNavigate;
    setPopUp: React.Dispatch<React.SetStateAction<PopUpNavigate>>;
    formCreateTask: FormCreateTask;
    setFormCreateTask: React.Dispatch<React.SetStateAction<FormCreateTask>>;
    taskID: string;
    setTaskID: React.Dispatch<React.SetStateAction<string>>;
  };
}
const TaskKaderSection: React.FC<TaskKaderSectionProps> = ({
  namespace,
  service,
  state,
}) => {
  const resChildren = service.query.children;
  const resTask = service.query.task;
  if (!resChildren || !resTask) {
    return <div>data tidak di temukan</div>;
  }
  if (service.query.isLoading) {
    return <div>loading..</div>;
  }
  return (
    <section className="-full min-h-screen flex justify-start items-center flex-col p-2 space-y-2">
      <div className="w-full flex items-center">
        <ChevronLeft
          className="scale-120"
          onClick={() => namespace.router.back()}
        />
        <h1 className="text-2xl font-bold">
          Tambah Anak Untuk
          {camelCaseToWords(resChildren.fullName)}
        </h1>
      </div>
      <div className="w-full flex items-center  flex-col space-y-1">
        <ChildParent res={resChildren} key={resChildren.id} />
      </div>
      <div className="w-full flex items-start flex-col justify-center ">
        <h1 className="text-lg font-bold">Task/Tugas</h1>
        {resTask.length > 0 ? (
          <div className="w-full space-y-2">
            {resTask.map((items) => (
              <TaskProgramCard
                res={items}
                key={items.id}
                setTaskID={state.setTaskID}
                taskID={state.taskID}
                alert={namespace.alert}
                onDelete={service.mutation.onDelete}
              />
            ))}
          </div>
        ) : (
          <div className="w-full border border-foreground/30 bg-foreground/20 rounded-lg flex justify-center p-2 ">
            Belum ada task ditambahkan
          </div>
        )}
      </div>

      <div className="w-full">
        <ButtonWrapper
          variant={"btn"}
          className="w-full"
          onClick={() => state.setPopUp("fTask")}
          leftIcon={
            <Icon
              icon="typcn:plus"
              width="24"
              height="24"
              className="text-background"
            />
          }
        >
          Tambah Task
        </ButtonWrapper>
      </div>
      <PopUp
        isOpen={state.popUp === "fTask"}
        onClose={() => state.setPopUp(null)}
      >
        <CreateTaskForm
          formCreateTask={state.formCreateTask}
          setFormCreateTask={state.setFormCreateTask}
          isPending={service.mutation.isPending}
          onCreateTask={service.mutation.onCreateTask}
          setPopUp={state.setPopUp}
        />
      </PopUp>
    </section>
  );
};

export default TaskKaderSection;
