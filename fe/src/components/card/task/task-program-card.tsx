import { ButtonWrapper } from "@/components/wrapper/ButtonWrapper";
import { TaskProgramResponse } from "@/types/res";
import { AlertContexType, PopUpNavigate } from "@/types/ui";
import { formatDateTime } from "@/utils/time.format";
import PopUp from "@/components/ui/pop-up";
import UpdateTaskForm from "@/components/section/private/kader/daftar-program/detail-program/task/_update-task/update-task";
import { FormUpdateTask } from "@/types/form";

interface TaskProgramCardProps {
  res: TaskProgramResponse;
  taskID: string;
  setTaskID: React.Dispatch<React.SetStateAction<string>>;
  alert: AlertContexType;
  onDelete: () => void;
  onBroadcast?: (id: string) => void;
  popUp: PopUpNavigate;
  setPopUp: React.Dispatch<React.SetStateAction<PopUpNavigate>>;
  formUpdateTask: FormUpdateTask | null;
  setFormUpdateTask: React.Dispatch<
    React.SetStateAction<FormUpdateTask | null>
  >;
  isPending: boolean;
  onUpdateTask: () => void;
}

const TaskProgramCard: React.FC<TaskProgramCardProps> = ({
  res,
  setTaskID,
  taskID,
  alert,
  onDelete,
  onBroadcast,
  popUp,
  formUpdateTask,
  setFormUpdateTask,
  onUpdateTask,
  isPending,

  setPopUp,
}) => {
  const statusLabel = res.isComplated ? "Selesai" : "Belum";
  const statusStyle = res.isComplated
    ? "bg-info/10 text-info/80"
    : "bg-primary/10 text-primary/80";
  const broadcastLabel = res.isBroadcast ? "Broadcast" : "Belum Broadcast";
  const broadcastStyle = res.isBroadcast
    ? "bg-emerald-100 text-emerald-700"
    : "bg-foreground/10 text-foreground/70";

  return (
    <div
      className={`w-full border rounded-lg p-3 bg-background space-y-2 ${
        taskID === res.id ? "border-primary" : "border"
      } `}
      onClick={() => setTaskID(res.id)}
    >
      <div className="w-full flex items-start justify-between gap-2">
        <div className="flex flex-col">
          <h1 className="text-base font-semibold">{res.title}</h1>
          <p className="text-xs text-muted-foreground">
            Untuk: {res.progres?.child?.fullName ?? "-"}
          </p>
        </div>

        <div className="flex flex-col items-end gap-1">
          <span className={`text-xs px-2 py-0.5 rounded-full ${statusStyle}`}>
            {statusLabel}
          </span>
          <span
            className={`text-xs px-2 py-0.5 rounded-full ${broadcastStyle}`}
          >
            {broadcastLabel}
          </span>
        </div>
      </div>

      <p className="text-sm text-muted-foreground">{res.description}</p>

      {(res.mealType ||
        res.targetEnergyKcal ||
        res.targetProteinGram ||
        res.targetFatGram ||
        res.targetCarbGram ||
        res.targetFiberGram) && (
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-muted-foreground">
          {res.mealType && <p>Jenis: {res.mealType}</p>}
          {res.targetEnergyKcal && <p>Energi: {res.targetEnergyKcal} kkal</p>}
          {res.targetProteinGram && <p>Protein: {res.targetProteinGram} g</p>}
          {res.targetFatGram && <p>Lemak: {res.targetFatGram} g</p>}
          {res.targetCarbGram && <p>Karbo: {res.targetCarbGram} g</p>}
          {res.targetFiberGram && <p>Serat: {res.targetFiberGram} g</p>}
        </div>
      )}

      <div className="flex items-center justify-between pt-2 mt-2 border-t text-xs text-muted-foreground">
        <span>
          Dibuat: {formatDateTime(res.createdAt, { style: "day-date-slash" })}
        </span>
        <span>
          Update: {formatDateTime(res.updatedAt, { style: "day-date-slash" })}
        </span>
      </div>
      {taskID === res.id && (
        <div className="w-full grid grid-cols-2 grid-rows-1 gap-2">
          <ButtonWrapper
            className="w-full"
            variant={"info"}
            onClick={() => setPopUp("fuTask")}
          >
            Edit
          </ButtonWrapper>
          <ButtonWrapper
            className="w-full text-background"
            variant={"destructive"}
            onClick={() =>
              alert.confirm({
                title: "Perhatian",
                deskripsi: "Apakah Anda Yakin Menghapus Task Ini?",
                icon: "warning",
                onConfirm: () => {
                  onDelete();
                },
              })
            }
          >
            Hapus
          </ButtonWrapper>
        </div>
      )}
      {taskID === res.id && onBroadcast && !res.isBroadcast && (
        <div className="w-full">
          <ButtonWrapper
            className="w-full"
            variant={"btn"}
            onClick={() =>
              alert.confirm({
                title: "Perhatian",
                deskripsi: "Broadcast task ini ke semua pengguna?",
                icon: "warning",
                onConfirm: () => onBroadcast(res.id),
              })
            }
          >
            Broadcast
          </ButtonWrapper>
        </div>
      )}
      <PopUp isOpen={popUp === "fuTask"} onClose={() => setPopUp(null)}>
        <UpdateTaskForm
          formUpdateTask={formUpdateTask}
          isPending={isPending}
          onUpdateTask={onUpdateTask}
          setFormUpdateTask={setFormUpdateTask}
          setPopUp={setPopUp}
        />
      </PopUp>
    </div>
  );
};

export default TaskProgramCard;
