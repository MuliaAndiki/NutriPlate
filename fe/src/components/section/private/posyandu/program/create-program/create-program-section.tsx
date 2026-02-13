import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { ButtonWrapper } from "@/components/wrapper/ButtonWrapper";
import { FormCreateProgram } from "@/types/form/program.form";
import { Icon } from "@iconify/react/dist/iconify.js";
import { ChevronLeft } from "lucide-react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

interface CreateProgramSectionProps {
  namespace: {
    router: AppRouterInstance;
  };
  service: {
    mutation: {
      onCreate: () => void;
      isPending: boolean;
    };
  };
  state: {
    formCreateProgram: FormCreateProgram;
    setFormCreateProgram: React.Dispatch<
      React.SetStateAction<FormCreateProgram>
    >;
  };
}

const CreateProgramSection: React.FC<CreateProgramSectionProps> = ({
  namespace,
  service,
  state,
}) => {
  const updateField = <K extends keyof FormCreateProgram>(
    key: K,
    value: FormCreateProgram[K],
  ) => {
    state.setFormCreateProgram((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const formatList = (items: string[]) => items.join("\n");

  const parseList = (value: string) =>
    value
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean);

  return (
    <section className="w-full min-h-screen flex flex-col items-center justify-start space-y-4 p-2">
      <div className="w-full flex items-center">
        <ChevronLeft
          onClick={() => namespace.router.back()}
          width={30}
          height={30}
        />
        <h1 className="text-2xl font-extrabold">Tambah Program</h1>
      </div>

      <div className="w-full space-y-2">
        <h1 className="text-sm font-bold">Judul Program</h1>
        <Input
          placeholder="Masukkan judul program"
          value={state.formCreateProgram.name}
          onChange={(e) => updateField("name", e.target.value)}
        />
      </div>

      <div className="w-full space-y-2">
        <h1 className="text-sm font-bold">Deskripsi Program</h1>
        <Textarea
          placeholder="Masukkan deskripsi program"
          value={state.formCreateProgram.description}
          onChange={(e) => updateField("description", e.target.value)}
        />
      </div>

      <div className="w-full space-y-2">
        <h1 className="text-sm font-bold">Aktivitas Program</h1>
        <Textarea
          placeholder="Tulis satu aktivitas per baris"
          value={formatList(state.formCreateProgram.activity ?? [])}
          onChange={(e) => updateField("activity", parseList(e.target.value))}
        />
      </div>

      <div className="w-full space-y-2">
        <h1 className="text-sm font-bold">Manfaat Program</h1>
        <Textarea
          placeholder="Tulis satu manfaat per baris"
          value={formatList(state.formCreateProgram.benefit ?? [])}
          onChange={(e) => updateField("benefit", parseList(e.target.value))}
        />
      </div>

      <div className="w-full space-y-2">
        <h1 className="text-sm font-bold">Batas Pendaftaran Program</h1>
        <Input
          type="date"
          placeholder="Masukkan tanggal"
          value={state.formCreateProgram.durationRegister ?? ""}
          onChange={(e) => updateField("durationRegister", e.target.value)}
        />
      </div>

      <div className="w-full grid grid-cols-2 gap-2">
        <div className="space-y-2">
          <h1 className="text-sm font-bold">Selesai Program</h1>
          <Input
            type="date"
            value={state.formCreateProgram.endPrograms ?? ""}
            onChange={(e) => updateField("endPrograms", e.target.value)}
          />
        </div>
      </div>

      <ButtonWrapper
        className="w-full"
        variant={"btn"}
        onClick={service.mutation.onCreate}
        leftIcon={
          <Icon
            icon="solar:check-circle-bold"
            width="20"
            height="20"
            className="text-background"
          />
        }
      >
        {service.mutation.isPending ? <Spinner /> : "Simpan"}
      </ButtonWrapper>
    </section>
  );
};

export default CreateProgramSection;
