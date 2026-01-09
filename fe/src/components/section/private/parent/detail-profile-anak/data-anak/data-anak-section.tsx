import { Icon } from "@iconify/react/dist/iconify.js";
import { ChevronLeft } from "lucide-react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormUpdateChild } from "@/types/form/child.form";
import { AlertContexType } from "@/types/ui";
import UploadsTrigger from "@/utils/uploadTrigger";
interface DataAnakHeroSectionProps {
  namespace: {
    router: AppRouterInstance;
    alert: AlertContexType;
  };
  state: {
    formUpdateChild: FormUpdateChild | null;
    setFormUpdateChild: React.Dispatch<
      React.SetStateAction<FormUpdateChild | null>
    >;
    isEdit: boolean;
    setIsEdit: React.Dispatch<React.SetStateAction<boolean>>;
    preview: string | null;
  };

  service: {
    mutation: {
      onUpdate: () => void;
      onChangeAva: (e: any) => void;
      onRemovePreview: () => void;
      onDelete: (id: string) => void;
    };
  };
}

const DataAnakHeroSection: React.FC<DataAnakHeroSectionProps> = ({
  namespace,
  service,
  state,
}) => {
  return (
    <div className="w-full min-h-screen flex justify-start items-center flex-col p-2 space-y-2">
      <div className="w-full flex justify-start items-center">
        <ChevronLeft
          onClick={() => namespace.router.back()}
          className="scale-120"
        />
        <h1 className="text-2xl font-bold">Data Anak</h1>
      </div>
      <div className="w-full flex flex-col border rounded-lg">
        <div className="w-full flex  items-center justify-start bg-primary rounded-lg border p-2">
          <Icon
            icon="ph:baby"
            width="24"
            height="24"
            className="text-background"
          />
          <h1 className="font-bold text-lg text-background">Data Diri</h1>
        </div>
        <div className="flex justify-center items-center p-4 flex-col ">
          {!state.preview ? (
            <UploadsTrigger
              accept="image/*"
              multiple={false}
              onChange={(e) => service.mutation.onChangeAva(e)}
              disable={!state.isEdit}
            >
              <Image
                alt="child"
                src={
                  state.formUpdateChild?.avaChild
                    ? state.formUpdateChild.avaChild
                    : "/images/childDummy.png"
                }
                width={250}
                height={250}
                className="rounded-full aspect-square object-cover"
              />
            </UploadsTrigger>
          ) : (
            <div className="w-full flex-col flex justify-center items-center gap-2">
              <UploadsTrigger
                accept="image/*"
                multiple={false}
                onChange={(e) => service.mutation.onChangeAva(e)}
                disable={!state.isEdit}
              >
                <Image
                  alt="child"
                  src={state.preview}
                  width={250}
                  height={250}
                  className="rounded-full aspect-square object-cover"
                />
              </UploadsTrigger>
              <Button
                className="border-4 border-dashed"
                variant={"ghost"}
                onClick={() => service.mutation.onRemovePreview()}
              >
                Hapus
              </Button>
            </div>
          )}

          <div className="w-full space-y-3">
            <label className="text-lg font-bold">Nama Lengkap</label>
            <Input
              value={state.formUpdateChild?.fullName ?? ""}
              disabled={!state.isEdit}
              type="text"
              onChange={(e) =>
                state.setFormUpdateChild((prev) =>
                  prev ? { ...prev, fullName: e.target.value } : prev
                )
              }
            />
            <label className="text-lg font-bold">Tempat/Tanggal Lahir</label>
            <div className="w-full grid grid-cols-2 grid-rows-1 items-center gap-4">
              <Input
                value={state.formUpdateChild?.placeOfBirth ?? ""}
                disabled={!state.isEdit}
                type="text"
                onChange={(e) =>
                  state.setFormUpdateChild((prev) =>
                    prev ? { ...prev, placeOfBirth: e.target.value } : prev
                  )
                }
              />
              <Input
                value={state.formUpdateChild?.dateOfBirth ?? ""}
                disabled={!state.isEdit}
                type="date"
                onChange={(e) =>
                  state.setFormUpdateChild((prev) =>
                    prev ? { ...prev, dateOfBirth: e.target.value } : prev
                  )
                }
              />
            </div>
            <div className="w-full">
              <h1 className="text-lg font-bold">Jenis Kelamin</h1>
              <Select
                value={state.formUpdateChild?.gender ?? ""}
                key={state.formUpdateChild?.gender ?? ""}
                disabled={!state.isEdit}
                onValueChange={(value) => {
                  state.setFormUpdateChild!((prev) =>
                    prev ? { ...prev, gender: value } : prev
                  );
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Jenis Kelamin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Peran</SelectLabel>
                    <SelectItem value="MALE">Laki - Laki</SelectItem>
                    <SelectItem value="FEMALE">Perempuan</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {!state.isEdit ? (
        <div className="w-full grid grid-cols-2 grid-rows-1  items-center gap-4 mt-4 ">
          <Button
            variant={"destructive"}
            className="w-full"
            onClick={() => {
              namespace.alert.modal({
                title: "Perhatian",
                deskripsi: "Kamu Ingin Menghapus Profile Anak ini ?",
                icon: "warning",
                onConfirm: () => {
                  service.mutation.onDelete(state.formUpdateChild!.id);
                },
                onClose: () => {},
              });
            }}
          >
            Hapus Data
          </Button>
          <Button
            variant={"btn"}
            className="w-full"
            onClick={() => state.setIsEdit(true)}
          >
            Edit Data
          </Button>
        </div>
      ) : (
        <div className="w-full grid grid-cols-2 grid-rows-1  items-center gap-4 mt-4 ">
          <Button
            variant={"destructive"}
            onClick={() => {
              state.setIsEdit(false);
            }}
          >
            Batalkan
          </Button>
          <Button
            className="w-full"
            onClick={() => service.mutation.onUpdate()}
          >
            Simpan
          </Button>
        </div>
      )}
    </div>
  );
};

export default DataAnakHeroSection;
