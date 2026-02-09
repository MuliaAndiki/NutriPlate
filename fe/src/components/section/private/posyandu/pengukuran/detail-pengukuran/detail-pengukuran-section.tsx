import ChildParent from "@/components/card/child/child-parent";
import MeasurementTable from "@/components/table/measurement-tabel";
import { Textarea } from "@/components/ui/textarea";
import { ButtonWrapper } from "@/components/wrapper/ButtonWrapper";
import { InputWrapper } from "@/components/wrapper/InputWrapper";
import { GrowthStatusType } from "@/types/card";
import { FormCreateMeasurement } from "@/types/form";
import { ChildPartial } from "@/types/res";
import { AlertContexType } from "@/types/ui";
import { Icon } from "@iconify/react/dist/iconify.js";
import { ChevronLeft } from "lucide-react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import DetailPengukuranSectionSkeleton from "@/components/skeleton/private/posyandu/pengukuran/detail-pengukuran/detail-pengukuran-section-skeleton";
import DataNotFound from "@/components/empty/data-not-found";

interface DetailPengukuranSectionProps {
  namespace: {
    router: AppRouterInstance;
    alert: AlertContexType;
  };
  service: {
    query: {
      isLoading: boolean;
      children: ChildPartial;
      historyMeasument: GrowthStatusType[];
    };
    mutation: {
      isPending: boolean;
      onMutate: () => void;
    };
  };
  state: {
    formCreateMeasuremnt: FormCreateMeasurement;
    setFormCreateMeasuremnt: React.Dispatch<
      React.SetStateAction<FormCreateMeasurement>
    >;
    isEdit: any;
  };
}
const DetailPengukuranSection: React.FC<DetailPengukuranSectionProps> = ({
  namespace,
  service,
  state,
}) => {
  const resChildren = service.query.children;
  const resMeansuremnt = service.query.historyMeasument;

  if (service.query.isLoading) {
    return <DetailPengukuranSectionSkeleton />;
  }
  if (!resChildren || !resMeansuremnt) {
    return <DataNotFound />;
  }

  return (
    <section className="flex w-full min-h-screen flex-col items-center justify-start overflow-x-hidden space-y-2 p-2">
      <div className="w-full flex items-center">
        <ChevronLeft
          onClick={() => namespace.router.back()}
          width={36}
          height={36}
        />
        <h1 className="font-bold text-xl">
          Input Pengukuran {resChildren.fullName}
        </h1>
      </div>
      <div className="w-full">
        <ChildParent res={resChildren} key={resChildren.id} />
      </div>
      <div className="w-full flex flex-col justify-start space-y-2 ">
        <div className="w-full">
          <h1 className="text-lg font-bold">Berat Badan (kg)</h1>
          <InputWrapper
            placeholder="contoh: 25"
            type="number"
            value={state.formCreateMeasuremnt.weightKg}
            onChange={(e) =>
              state.setFormCreateMeasuremnt((prev) => ({
                ...prev,
                weightKg: Number(e.target.value),
              }))
            }
          />
        </div>
        <div className="w-full">
          <h1 className="text-lg font-bold">Tinggi Badan (cm)</h1>
          <InputWrapper
            placeholder="contoh: 25"
            type="number"
            value={state.formCreateMeasuremnt.heightCm}
            onChange={(e) =>
              state.setFormCreateMeasuremnt((prev) => ({
                ...prev,
                heightCm: Number(e.target.value),
              }))
            }
          />
        </div>
        <div className="w-full">
          <h1 className="text-lg font-bold">Lingkar Kepala (cm)</h1>
          <InputWrapper
            placeholder="contoh: 25"
            type="number"
            value={state.formCreateMeasuremnt.headCircumferenceCm}
            onChange={(e) =>
              state.setFormCreateMeasuremnt((prev) => ({
                ...prev,
                headCircumferenceCm: Number(e.target.value),
              }))
            }
          />
        </div>
        <div className="w-full">
          <h1 className="text-lg font-bold">Catatan</h1>
          <Textarea
            placeholder="contoh: 25"
            value={state.formCreateMeasuremnt.note}
            onChange={(e) =>
              state.setFormCreateMeasuremnt((prev) => ({
                ...prev,
                note: e.target.value,
              }))
            }
          />
        </div>
      </div>
      <div className="w-full grid grid-cols-[1fr_2fr] grid-rows-1 gap-2">
        <ButtonWrapper
          variant={"destructive"}
          onClick={() => namespace.router.back()}
          leftIcon={
            <Icon
              icon="ic:round-check"
              width="24"
              height="24"
              className="text-background"
            />
          }
          className="text-background"
        >
          Batalkan
        </ButtonWrapper>
        <ButtonWrapper
          variant={"btn"}
          onClick={() =>
            namespace.alert.confirm({
              title: "Perhatian",
              deskripsi: "Apakah Sudah Yakin",
              icon: "question",
              onConfirm: () => {
                service.mutation.onMutate();
              },
            })
          }
          leftIcon={
            <Icon
              icon="ic:round-check"
              width="24"
              height="24"
              className="text-background"
            />
          }
        >
          {state.isEdit ? "Update Pengukuran" : "Tambah Pengukuran"}
        </ButtonWrapper>
      </div>
      <div className="w-full flex items-center space-x-1">
        <Icon
          icon="material-symbols:history-rounded"
          width="34"
          height="34"
          className="text-primary"
        />
        <h1 className="text-lg font-bold">Riwayat Pengukuran</h1>
      </div>
      <div className="w-full">
        <MeasurementTable historyMeasument={resMeansuremnt ?? []} />
      </div>
    </section>
  );
};

export default DetailPengukuranSection;
