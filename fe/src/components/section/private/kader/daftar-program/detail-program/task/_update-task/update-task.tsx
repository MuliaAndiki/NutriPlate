import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { ButtonWrapper } from "@/components/wrapper/ButtonWrapper";
import { FormUpdateTask } from "@/types/form";
import { PopUpNavigate } from "@/types/ui";
import { Icon } from "@iconify/react/dist/iconify.js";

interface UpdateTaskFormProps {
  formUpdateTask: FormUpdateTask | null;
  setFormUpdateTask: React.Dispatch<
    React.SetStateAction<FormUpdateTask | null>
  >;
  onUpdateTask: () => void;
  isPending: boolean;
  setPopUp: React.Dispatch<React.SetStateAction<PopUpNavigate>>;
}

const UpdateTaskForm: React.FC<UpdateTaskFormProps> = ({
  formUpdateTask,
  setFormUpdateTask,
  onUpdateTask,
  isPending,
  setPopUp,
}) => {
  if (!formUpdateTask) return null;

  const updateField = <K extends keyof FormUpdateTask>(
    key: K,
    value: FormUpdateTask[K],
  ) => {
    setFormUpdateTask((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        [key]: value,
      };
    });
  };

  return (
    <section className="w-full h-full flex flex-col space-y-3">
      <div className="w-full flex justify-between items-center">
        <h1 className="text-lg font-bold">Perbarui Tugas Baru</h1>
        <Icon
          icon="material-symbols:cancel-outline-rounded"
          width="24"
          height="24"
          onClick={() => setPopUp(null)}
          className="cursor-pointer"
        />
      </div>

      <div className="w-full space-y-2">
        <h1 className="text-sm font-bold">Judul Tugas</h1>
        <Input
          placeholder="Masukkan judul task"
          value={formUpdateTask.title}
          onChange={(e) => updateField("title", e.target.value)}
        />
      </div>

      <div className="w-full space-y-2">
        <h1 className="text-sm font-bold">Deskripsi</h1>
        <Textarea
          placeholder="Masukkan deskripsi task"
          value={formUpdateTask.description}
          onChange={(e) => updateField("description", e.target.value)}
        />
      </div>

      <div className="w-full space-y-2">
        <h1 className="text-sm font-bold">Jenis Makan</h1>
        <Input
          placeholder="Contoh: Sarapan"
          value={formUpdateTask.mealType}
          onChange={(e) => updateField("mealType", e.target.value)}
        />
      </div>

      <div className="w-full grid grid-cols-2 gap-2">
        <div className="space-y-2">
          <h1 className="text-sm font-bold">Target Energi (kkal)</h1>
          <Input
            type="number"
            value={formUpdateTask.targetEnergyKcal ?? ""}
            onChange={(e) =>
              updateField(
                "targetEnergyKcal",
                e.target.value === "" ? 0 : Number(e.target.value),
              )
            }
          />
        </div>

        <div className="space-y-2">
          <h1 className="text-sm font-bold">Target Protein (g)</h1>
          <Input
            type="number"
            value={formUpdateTask.targetProteinGram ?? ""}
            onChange={(e) =>
              updateField(
                "targetProteinGram",
                e.target.value === "" ? 0 : Number(e.target.value),
              )
            }
          />
        </div>

        <div className="space-y-2">
          <h1 className="text-sm font-bold">Target Lemak (g)</h1>
          <Input
            type="number"
            value={formUpdateTask.targetFatGram ?? ""}
            onChange={(e) =>
              updateField(
                "targetFatGram",
                e.target.value === "" ? 0 : Number(e.target.value),
              )
            }
          />
        </div>

        <div className="space-y-2">
          <h1 className="text-sm font-bold">Target Karbo (g)</h1>
          <Input
            type="number"
            value={formUpdateTask.targetCarbGram ?? ""}
            onChange={(e) =>
              updateField(
                "targetCarbGram",
                e.target.value === "" ? 0 : Number(e.target.value),
              )
            }
          />
        </div>

        <div className="space-y-2">
          <h1 className="text-sm font-bold">Target Serat (g)</h1>
          <Input
            type="number"
            value={formUpdateTask.targetFiberGram ?? ""}
            onChange={(e) =>
              updateField(
                "targetFiberGram",
                e.target.value === "" ? 0 : Number(e.target.value),
              )
            }
          />
        </div>
      </div>

      <ButtonWrapper
        className="w-full"
        disabled={
          isPending || !formUpdateTask.title || !formUpdateTask.description
        }
        onClick={onUpdateTask}
      >
        {isPending ? <Spinner /> : "perbarui Tugas"}
      </ButtonWrapper>
    </section>
  );
};

export default UpdateTaskForm;
