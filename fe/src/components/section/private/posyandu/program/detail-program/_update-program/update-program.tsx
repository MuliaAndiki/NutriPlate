import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { ButtonWrapper } from "@/components/wrapper/ButtonWrapper";
import { FormCreateProgram } from "@/types/form/program.form";
import { Icon } from "@iconify/react/dist/iconify.js";

interface UpdateProgramFormProps {
  formUpdateProgram: FormCreateProgram | null;
  setFormUpdateProgram: React.Dispatch<
    React.SetStateAction<FormCreateProgram | null>
  >;
  onUpdateProgram: () => void;
  isPending: boolean;
  onClose: () => void;
}

const UpdateProgramForm: React.FC<UpdateProgramFormProps> = ({
  formUpdateProgram,
  setFormUpdateProgram,
  onUpdateProgram,
  isPending,
  onClose,
}) => {
  if (!formUpdateProgram) return null;

  const updateField = <K extends keyof FormCreateProgram>(
    key: K,
    value: FormCreateProgram[K],
  ) => {
    setFormUpdateProgram((prev) => {
      if (!prev) return prev;
      return { ...prev, [key]: value };
    });
  };

  const formatList = (items: string[]) => items.join("\n");

  const parseList = (value: string) =>
    value
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean);

  return (
    <section className="w-full h-full flex flex-col space-y-3">
      <div className="w-full flex justify-between items-center">
        <h1 className="text-lg font-bold">Update Program</h1>
        <Icon
          icon="material-symbols:cancel-outline-rounded"
          width="24"
          height="24"
          onClick={onClose}
          className="cursor-pointer"
        />
      </div>

      <div className="w-full space-y-2">
        <h1 className="text-sm font-bold">Nama Program</h1>
        <Input
          placeholder="Masukkan nama program"
          value={formUpdateProgram.name}
          onChange={(e) => updateField("name", e.target.value)}
        />
      </div>

      <div className="w-full space-y-2">
        <h1 className="text-sm font-bold">Deskripsi</h1>
        <Textarea
          placeholder="Masukkan deskripsi program"
          value={formUpdateProgram.description}
          onChange={(e) => updateField("description", e.target.value)}
        />
      </div>

      <div className="w-full grid grid-cols-2 gap-2">
        <div className="space-y-2">
          <h1 className="text-sm font-bold">Batas Pendaftaran</h1>
          <Input
            type="date"
            value={formUpdateProgram.durationRegister ?? ""}
            onChange={(e) => updateField("durationRegister", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <h1 className="text-sm font-bold">Selesai Program</h1>
          <Input
            type="date"
            value={formUpdateProgram.endPrograms ?? ""}
            onChange={(e) => updateField("endPrograms", e.target.value)}
          />
        </div>
      </div>

      <div className="w-full space-y-2">
        <h1 className="text-sm font-bold">Aktivitas</h1>
        <Textarea
          placeholder="Tulis satu aktivitas per baris"
          value={formatList(formUpdateProgram.activity ?? [])}
          onChange={(e) => updateField("activity", parseList(e.target.value))}
        />
      </div>

      <div className="w-full space-y-2">
        <h1 className="text-sm font-bold">Manfaat</h1>
        <Textarea
          placeholder="Tulis satu manfaat per baris"
          value={formatList(formUpdateProgram.benefit ?? [])}
          onChange={(e) => updateField("benefit", parseList(e.target.value))}
        />
      </div>

      <ButtonWrapper
        className="w-full"
        disabled={
          isPending || !formUpdateProgram.name || !formUpdateProgram.description
        }
        onClick={onUpdateProgram}
      >
        {isPending ? <Spinner /> : "Update Program"}
      </ButtonWrapper>
    </section>
  );
};

export default UpdateProgramForm;
