import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ButtonWrapper } from "@/components/wrapper/ButtonWrapper";
import SectionSkeleton from "@/components/skeleton/section-skeleton";
import UploadsTrigger from "@/utils/uploadTrigger";
import { FormUpdatePosyandu } from "@/types/form";
import { PosyanduRespone } from "@/types/res";
import { Icon } from "@iconify/react/dist/iconify.js";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import Image from "next/image";
import DataNotFound from "@/components/empty/data-not-found";

interface EditProfilePosyanduSectionProps {
  namespace: {
    router: AppRouterInstance;
  };
  service: {
    query: {
      posyandu: PosyanduRespone | null;
      isLoading: boolean;
    };
    mutation: {
      isPending: boolean;
      editPosyandu: () => void;
      onChangeAva: (e: React.ChangeEvent<HTMLInputElement>) => void;
      onRemovePreview: () => void;
    };
  };
  state: {
    formUpdatePosyandu: FormUpdatePosyandu | null;
    setFormUpdatePosyandu: React.Dispatch<
      React.SetStateAction<FormUpdatePosyandu | null>
    >;
    isEdit: boolean;
    setIsEdit: React.Dispatch<React.SetStateAction<boolean>>;
    preview: string | null;
  };
}

const EditProfilePosyanduSection: React.FC<EditProfilePosyanduSectionProps> = ({
  service,
  namespace,
  state,
}) => {
  if (service.query.isLoading) {
    return <SectionSkeleton />;
  }
  if (!service.query.posyandu || !state.formUpdatePosyandu) {
    return <DataNotFound />;
  }

  return (
    <section className="w-full min-h-screen flex justify-start items-start flex-col p-2 space-y-4">
      <div className="w-full flex justify-between items-center">
        <div className="w-full flex items-center justify-start">
          <Icon
            icon="ic:baseline-arrow-back"
            width={28}
            height={28}
            onClick={() => namespace.router.back()}
          />
          <h1 className="text-2xl font-extrabold">Edit Profile Posyandu</h1>
        </div>

        {state.isEdit ? (
          <div className="w-full flex items-center gap-4">
            <Button
              variant={"destructive"}
              className="flex items-center"
              onClick={() => state.setIsEdit(false)}
            >
              <Icon icon="bxs:edit" width="24" height="24" />
              <h1>Batalkan</h1>
            </Button>
            <Button
              variant={"btn"}
              className="flex items-center"
              onClick={() => service.mutation.editPosyandu()}
              disabled={service.mutation.isPending}
            >
              <Icon icon="bxs:edit" width="24" height="24" />
              <h1>Simpan</h1>
            </Button>
          </div>
        ) : (
          <ButtonWrapper
            startIcon={<Icon icon="bxs:edit" width="24" height="24" />}
            onClick={() => state.setIsEdit(true)}
          >
            Edit
          </ButtonWrapper>
        )}
      </div>

      <div className="w-full flex items-center justify-center mt-2">
        {!state.preview ? (
          <UploadsTrigger
            accept="image/*"
            multiple={false}
            className="relative"
            onChange={(e) => service.mutation.onChangeAva(e)}
            disable={!state.isEdit}
          >
            <Image
              alt="profile"
              src={service.query.posyandu.avaUrl ?? "/avatars/1.png"}
              width={150}
              height={150}
              className="object-cover rounded-full aspect-square"
            />
            <div className="absolute right-4 -translate-y-6">
              <Icon icon="bi:camera-fill" width="26" height="26" />
            </div>
          </UploadsTrigger>
        ) : (
          <div>
            <UploadsTrigger
              accept="image/*"
              multiple={false}
              className="relative"
              onChange={(e) => service.mutation.onChangeAva(e)}
            >
              <Image
                alt="profile"
                src={state.preview ?? "/avatars/1.png"}
                width={150}
                height={150}
                className="object-cover rounded-full aspect-square"
              />
              <div className="absolute right-4 -translate-y-6">
                <Icon icon="bi:camera-fill" width="26" height="26" />
              </div>
            </UploadsTrigger>
            <div className="w-full flex justify-center items-center mt-1">
              <Button
                variant={"liner"}
                onClick={() => service.mutation.onRemovePreview()}
              >
                Hapus
              </Button>
            </div>
          </div>
        )}
      </div>

      <div className="w-full space-y-2">
        <label className="text-lg font-bold">Nama Posyandu</label>
        <Input
          value={state.formUpdatePosyandu.name}
          disabled={!state.isEdit}
          onChange={(e) =>
            state.setFormUpdatePosyandu((prev) =>
              prev ? { ...prev, name: e.target.value } : prev,
            )
          }
        />
      </div>

      <div className="w-full space-y-2">
        <label className="text-lg font-bold">Email</label>
        <Input
          value={state.formUpdatePosyandu.email}
          disabled={!state.isEdit}
          onChange={(e) =>
            state.setFormUpdatePosyandu((prev) =>
              prev ? { ...prev, email: e.target.value } : prev,
            )
          }
        />
      </div>

      <div className="w-full space-y-2">
        <label className="text-lg font-bold">Nomor HP</label>
        <Input
          value={state.formUpdatePosyandu.phone}
          disabled={!state.isEdit}
          onChange={(e) =>
            state.setFormUpdatePosyandu((prev) =>
              prev ? { ...prev, phone: e.target.value } : prev,
            )
          }
        />
      </div>

      <div className="w-full space-y-2">
        <label className="text-lg font-bold">Jadwal (Hari ke-)</label>
        <Input
          type="number"
          value={state.formUpdatePosyandu.scheduleDay ?? 0}
          disabled={!state.isEdit}
          onChange={(e) =>
            state.setFormUpdatePosyandu((prev) =>
              prev
                ? {
                    ...prev,
                    scheduleDay:
                      e.target.value === "" ? 0 : Number(e.target.value),
                  }
                : prev,
            )
          }
        />
      </div>
    </section>
  );
};

export default EditProfilePosyanduSection;
