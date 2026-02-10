import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ButtonWrapper } from "@/components/wrapper/ButtonWrapper";
import { FormCreateNotification } from "@/types/form/notafications.form";
import { Icon } from "@iconify/react/dist/iconify.js";
import { ChevronLeft } from "lucide-react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

interface NotifikasiFormSectionProps {
  namespace: {
    router: AppRouterInstance;
  };
  service: {
    mutation: {
      onSubmit: () => void;
      isPending: boolean;
    };
  };
  state: {
    form: FormCreateNotification;
    setForm: React.Dispatch<React.SetStateAction<FormCreateNotification>>;
  };
  title: string;
  submitLabel: string;
}

const NotifikasiFormSection: React.FC<NotifikasiFormSectionProps> = ({
  namespace,
  service,
  state,
  title,
  submitLabel,
}) => {
  return (
    <section className="w-full min-h-screen flex flex-col items-center justify-start space-y-4 p-2">
      <div className="w-full flex items-center">
        <ChevronLeft
          onClick={() => namespace.router.back()}
          width={30}
          height={30}
        />
        <h1 className="text-2xl font-extrabold">{title}</h1>
      </div>

      <div className="w-full space-y-2">
        <h1 className="text-sm font-bold">Judul Notifikasi</h1>
        <Input
          placeholder="Masukkan judul notifikasi"
          value={state.form.title}
          onChange={(e) =>
            state.setForm((prev) => ({ ...prev, title: e.target.value }))
          }
        />
      </div>

      <div className="w-full space-y-2">
        <h1 className="text-sm font-bold">Deskripsi Notifikasi</h1>
        <Textarea
          placeholder="Masukkan deskripsi notifikasi"
          value={state.form.message}
          onChange={(e) =>
            state.setForm((prev) => ({ ...prev, message: e.target.value }))
          }
        />
      </div>

      <div className="w-full space-y-2">
        <h1 className="text-sm font-bold">Tipe Notifikasi</h1>
        <Select
          value={state.form.type}
          onValueChange={(value) =>
            state.setForm((prev) => ({
              ...prev,
              type: value as FormCreateNotification["type"],
            }))
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Pilih tipe notifikasi" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Tipe</SelectLabel>
              <SelectItem value="reminder">Pengingat</SelectItem>
              <SelectItem value="result">Hasil</SelectItem>
              <SelectItem value="alert">Peringatan</SelectItem>
              <SelectItem value="edukasi">Edukasi</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <ButtonWrapper
        className="w-full"
        variant={"btn"}
        onClick={service.mutation.onSubmit}
        leftIcon={
          <Icon
            icon="solar:check-circle-bold"
            width="20"
            height="20"
            className="text-background"
          />
        }
      >
        {service.mutation.isPending ? <Spinner /> : submitLabel}
      </ButtonWrapper>
    </section>
  );
};

export default NotifikasiFormSection;
