import AktifitasPropgramCard from "@/components/card/program/aktivitas-program";
import BenefitPropgramCard from "@/components/card/program/benefit-program";
import DeskripsiPropgramCard from "@/components/card/program/deskripsi-program";
import DataNotFound from "@/components/empty/data-not-found";
import DetailProgramSectionSkeleton from "@/components/skeleton/private/kader/daftar-program/detail-program/detail-program-section-skeleton";
import PopUp from "@/components/ui/pop-up";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import UpdateProgramForm from "@/components/section/private/posyandu/program/detail-program/_update-program/update-program";
import { FormCreateProgram } from "@/types/form/program.form";
import { ChildRespone } from "@/types/res";
import { IProgram } from "@/types/schema";
import { AlertContexType } from "@/types/ui";
import { camelCaseToWords } from "@/utils/string.format";
import { formatDateTime } from "@/utils/time.format";
import { Icon } from "@iconify/react/dist/iconify.js";
import { ChevronLeft } from "lucide-react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

interface DetailProgramPosyanduSectionProps {
  namespace: {
    router: AppRouterInstance;
    alert: AlertContexType;
  };
  service: {
    query: {
      program: IProgram;
      isLoading: boolean;
      children: ChildRespone[];
    };
    mutation: {
      deleteProgram: () => void;
      isPendingDelete: boolean;
      updateProgram: () => void;
      isPendingUpdate: boolean;
    };
  };
  handler: {
    onSelectChild: (childId: string) => void;
    onOpenChildSelect: () => void;
    onCloseChildSelect: () => void;
  };
  state: {
    showUpdate: boolean;
    setShowUpdate: React.Dispatch<React.SetStateAction<boolean>>;
    formUpdateProgram: FormCreateProgram | null;
    setFormUpdateProgram: React.Dispatch<
      React.SetStateAction<FormCreateProgram | null>
    >;
    showChildSelect: boolean;
    setShowChildSelect: React.Dispatch<React.SetStateAction<boolean>>;
  };
}
const DetailProgramPosyanduSection: React.FC<
  DetailProgramPosyanduSectionProps
> = ({ service, namespace, state, handler }) => {
  const resProgram = service.query.program;
  const childrenList = service.query.children ?? [];
  const childInProgram = childrenList.filter((item) =>
    item.programProgress?.some(
      (progresId) => progresId.programId === resProgram?.id,
    ),
  );

  if (!resProgram || !childrenList) {
    return <DataNotFound />;
  }
  if (service.query.isLoading) {
    return <DetailProgramSectionSkeleton />;
  }
  return (
    <section className="flex w-full min-h-screen flex-col items-center justify-start overflow-x-hidden space-y-2 p-2">
      <div className="w-full h-auto flex items-center">
        <ChevronLeft
          onClick={() => namespace.router.back()}
          width={36}
          height={36}
        />
        <h1 className="text-3xl font-extrabold">
          {camelCaseToWords(resProgram.name)}
        </h1>
      </div>
      <DeskripsiPropgramCard res={resProgram} />
      <div className="p-4 w-full rounded-lg border border-primary">
        <h1 className="">
          Batas Pendaftaran:
          {resProgram.durationRegister
            ? formatDateTime(resProgram.durationRegister, {
                style: "day-date-slash",
              })
            : "-"}
        </h1>
      </div>
      <AktifitasPropgramCard res={resProgram} />
      <BenefitPropgramCard res={resProgram} />
      <div className="w-full flex items-center justify-between p-4 rounded-lg border">
        <h1 className="text-lg font-bold">Aksi</h1>
        <div className="flex items-center space-x-5">
          <Icon
            icon="mdi:man-child"
            width="24"
            height="24"
            className="text-info"
            onClick={handler.onOpenChildSelect}
          />
          <Icon
            icon="uil:edit"
            width="26"
            height="26"
            className="text-primary"
            onClick={() => state.setShowUpdate(true)}
          />
          <Icon
            icon="pajamas:remove"
            width="26"
            height="26"
            className="text-destructive"
            onClick={() =>
              namespace.alert.confirm({
                icon: "question",
                title: "Perhatian",
                deskripsi: "Apakah Kamu Yakin Menghapus ini",
                onConfirm: () => {
                  service.mutation.deleteProgram();
                },
              })
            }
          />
        </div>
      </div>
      <PopUp
        isOpen={state.showUpdate}
        onClose={() => state.setShowUpdate(false)}
      >
        <UpdateProgramForm
          formUpdateProgram={state.formUpdateProgram}
          setFormUpdateProgram={state.setFormUpdateProgram}
          isPending={service.mutation.isPendingUpdate}
          onUpdateProgram={service.mutation.updateProgram}
          onClose={() => state.setShowUpdate(false)}
        />
      </PopUp>
      <PopUp
        isOpen={state.showChildSelect}
        onClose={handler.onCloseChildSelect}
      >
        <div className="w-full space-y-3">
          <h1 className="text-lg font-bold">Pilih Anak</h1>
          <Select
            onValueChange={(value) => {
              handler.onSelectChild(value);
              handler.onCloseChildSelect();
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Pilih Anak" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Daftar Anak</SelectLabel>
                {childInProgram.length === 0 ? (
                  <SelectItem value="empty" disabled>
                    Tidak ada anak
                  </SelectItem>
                ) : (
                  childInProgram.map((item) => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.fullName ?? "Tanpa Nama"}
                    </SelectItem>
                  ))
                )}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </PopUp>
    </section>
  );
};

export default DetailProgramPosyanduSection;
