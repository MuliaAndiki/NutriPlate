import { TaskProgramResponse } from "@/types/res";
import { formatDateTime } from "@/utils/time.format";
import { Icon } from "@iconify/react";

interface ListTaskProps {
  res: TaskProgramResponse;
  setTaskId: React.Dispatch<React.SetStateAction<string | null>>;
  taskId: string | null;
}

const ListTask: React.FC<ListTaskProps> = ({ res, setTaskId, taskId }) => {
  const isDone = res.isComplated;

  return (
    <div
      className={`w-full border  rounded-lg p-3 bg-background ${taskId ? "border-primary" : "border"} `}
    >
      <input
        type="checkbox"
        id={`task-toggle-${res.id}`}
        className="peer hidden"
        onChange={(e) => {
          setTaskId(e.target.checked ? res.id : null);
        }}
      />

      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-base font-semibold">{res.title}</h1>
          <p className="text-xs text-muted-foreground">
            Untuk: {res.progres?.child?.fullName}
          </p>
        </div>

        <span
          className={`text-xs px-2 py-0.5 rounded-full ${
            isDone ? "bg-info/10 text-info/80" : "bg-primary/10 text-primary/80"
          }`}
        >
          {isDone ? "Selesai" : "Belum"}
        </span>
      </div>

      <div className="max-h-0 overflow-hidden transition-all duration-300 peer-checked:max-h-96">
        <div className="mt-2 flex flex-col gap-2">
          <p className="text-sm text-muted-foreground">{res.description}</p>

          {res.mealType && (
            <div className="flex items-center gap-1 text-xs text-primary">
              <Icon icon="mdi:food" width={14} />
              <span>{res.mealType}</span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-muted-foreground">
            {res.targetEnergyKcal && <p>Energi: {res.targetEnergyKcal} kkal</p>}
            {res.targetProteinGram && <p>Protein: {res.targetProteinGram} g</p>}
            {res.targetFatGram && <p>Lemak: {res.targetFatGram} g</p>}
            {res.targetCarbGram && <p>Karbo: {res.targetCarbGram} g</p>}
            {res.targetFiberGram && <p>Serat: {res.targetFiberGram} g</p>}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-2 mt-2 border-t text-xs text-muted-foreground">
        <span>
          Dibuat: {formatDateTime(res.createdAt, { style: "day-date-slash" })}
        </span>

        <label
          htmlFor={`task-toggle-${res.id}`}
          className="cursor-pointer text-primary underline flex items-center gap-1"
        >
          <span className="peer-checked:hidden">Selengkapnya</span>
          <span className="hidden peer-checked:inline">Tutup</span>
          <Icon
            icon="mdi:chevron-down"
            className="transition-transform peer-checked:rotate-180"
            width={14}
          />
        </label>
      </div>
    </div>
  );
};

export default ListTask;
