import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { ButtonWrapper } from "@/components/wrapper/ButtonWrapper";
import { FormCreateTask } from "@/types/form";
import { PopUpNavigate } from "@/types/ui";
import { Icon } from "@iconify/react/dist/iconify.js";

interface CreateTaskFormProps {
  formCreateTask: FormCreateTask;
  setFormCreateTask: React.Dispatch<React.SetStateAction<FormCreateTask>>;
  onCreateTask: () => void;
  isPending: boolean;
  setPopUp: React.Dispatch<React.SetStateAction<PopUpNavigate>>;
}

const CreateTaskForm: React.FC<CreateTaskFormProps> = ({
  formCreateTask,
  setFormCreateTask,
  onCreateTask,
  isPending,
  setPopUp,
}) => {
  return (
    <section className="w-full h-full flex flex-col space-y-3">
      <div className="w-full flex justify-between items-center">
        <h1 className="text-lg font-bold">Buat Task Baru</h1>
        <Icon
          icon="material-symbols:cancel-outline-rounded"
          width="24"
          height="24"
          onClick={() => setPopUp(null)}
        />
      </div>
      <div className="w-full space-y-2">
        <h1 className="text-sm font-bold">Judul Task</h1>
        <Input
          placeholder="Masukkan judul task"
          value={formCreateTask.title}
          onChange={(e) =>
            setFormCreateTask((prev) => ({
              ...prev,
              title: e.target.value,
            }))
          }
        />
      </div>

      <div className="w-full space-y-2">
        <h1 className="text-sm font-bold">Deskripsi</h1>
        <Textarea
          placeholder="Masukkan deskripsi task"
          value={formCreateTask.description}
          onChange={(e) =>
            setFormCreateTask((prev) => ({
              ...prev,
              description: e.target.value,
            }))
          }
        />
      </div>

      <div className="w-full space-y-2">
        <h1 className="text-sm font-bold">Jenis Makan</h1>
        <Input
          placeholder="Contoh: Sarapan"
          value={formCreateTask.mealType}
          onChange={(e) =>
            setFormCreateTask((prev) => ({
              ...prev,
              mealType: e.target.value,
            }))
          }
        />
      </div>

      <div className="w-full grid grid-cols-2 gap-2">
        <div className="w-full space-y-2">
          <h1 className="text-sm font-bold">Target Energi (kkal)</h1>
          <Input
            type="number"
            placeholder="Contoh: 350"
            value={formCreateTask.targetEnergyKcal ?? ""}
            onChange={(e) =>
              setFormCreateTask((prev) => ({
                ...prev,
                targetEnergyKcal:
                  e.target.value === "" ? 0 : Number(e.target.value),
              }))
            }
          />
        </div>
        <div className="w-full space-y-2">
          <h1 className="text-sm font-bold">Target Protein (g)</h1>
          <Input
            type="number"
            placeholder="Contoh: 20"
            value={formCreateTask.targetProteinGram ?? ""}
            onChange={(e) =>
              setFormCreateTask((prev) => ({
                ...prev,
                targetProteinGram:
                  e.target.value === "" ? 0 : Number(e.target.value),
              }))
            }
          />
        </div>
        <div className="w-full space-y-2">
          <h1 className="text-sm font-bold">Target Lemak (g)</h1>
          <Input
            type="number"
            placeholder="Contoh: 10"
            value={formCreateTask.targetFatGram ?? ""}
            onChange={(e) =>
              setFormCreateTask((prev) => ({
                ...prev,
                targetFatGram:
                  e.target.value === "" ? 0 : Number(e.target.value),
              }))
            }
          />
        </div>
        <div className="w-full space-y-2">
          <h1 className="text-sm font-bold">Target Karbo (g)</h1>
          <Input
            type="number"
            placeholder="Contoh: 50"
            value={formCreateTask.targetCarbGram ?? ""}
            onChange={(e) =>
              setFormCreateTask((prev) => ({
                ...prev,
                targetCarbGram:
                  e.target.value === "" ? 0 : Number(e.target.value),
              }))
            }
          />
        </div>
        <div className="w-full space-y-2">
          <h1 className="text-sm font-bold">Target Serat (g)</h1>
          <Input
            type="number"
            placeholder="Contoh: 8"
            value={formCreateTask.targetFiberGram ?? ""}
            onChange={(e) =>
              setFormCreateTask((prev) => ({
                ...prev,
                targetFiberGram:
                  e.target.value === "" ? 0 : Number(e.target.value),
              }))
            }
          />
        </div>
      </div>

      <ButtonWrapper
        className="w-full"
        disabled={
          isPending || !formCreateTask.title || !formCreateTask.description
        }
        onClick={() => onCreateTask()}
      >
        {isPending ? <Spinner /> : "Tambah Task"}
      </ButtonWrapper>
    </section>
  );
};

export default CreateTaskForm;
