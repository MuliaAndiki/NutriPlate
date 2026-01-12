import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ButtonWrapper } from "@/components/wrapper/ButtonWrapper";
import { FormUpdateProfile } from "@/types/form/auth.form";
import { IAuth } from "@/types/schema/auth.schema";
import UploadsTrigger from "@/utils/uploadTrigger";
import { Icon } from "@iconify/react/dist/iconify.js";
import { ChevronLeft } from "lucide-react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import Image from "next/image";

interface EditProfileSectionProps {
  namespace: {
    router: AppRouterInstance;
  };
  state: {
    isEdit: boolean;
    setIsEdit: React.Dispatch<React.SetStateAction<boolean>>;

    preview: string | null;
    setFormUpdateProfile: React.Dispatch<
      React.SetStateAction<FormUpdateProfile>
    >;
  };
  service: {
    mutation: {
      onUpdateProfile: () => void;
      onRemovePreview: () => void;
      onChangeAvatars: (e: any) => void;
    };
    query: {
      profileUser: IAuth;
      isLoading: boolean;
    };
  };
}
const EditProfileSection: React.FC<EditProfileSectionProps> = ({
  namespace,
  service,
  state,
}) => {
  if (service.query.isLoading) {
    return <div>loading..</div>;
  }
  return (
    <div className="w-full min-h-screen flex justify-start flex-col items-center  ">
      <div className="w-full flex justify-between items-center">
        <div className="w-full flex items-center justify-start">
          <ChevronLeft
            onClick={() => namespace.router.back()}
            className="scale-120"
          />
          <h1 className="text-2xl font-extrabold">Edit Profile</h1>
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
              onClick={() => service.mutation.onUpdateProfile()}
            >
              <Icon icon="bxs:edit" width="24" height="24" />
              <h1>Simpan</h1>
            </Button>
          </div>
        ) : (
          <ButtonWrapper
            startIcon={<Icon icon="bxs:edit" width="24" height="24" />}
            onClick={() => state.setIsEdit(false)}
          >
            Edit
          </ButtonWrapper>
        )}
      </div>
      <div className="w-full flex items-center justify-center mt-4">
        {!state.preview ? (
          <UploadsTrigger
            accept="image/*"
            multiple={false}
            className="relative"
            onChange={(e) => service.mutation.onChangeAvatars(e)}
            disable={!state.isEdit}
          >
            <Image
              alt="profile"
              src={service.query.profileUser.avaUrl ?? "/avatars/1.png"}
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
              onChange={(e) => service.mutation.onChangeAvatars(e)}
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
      <div className="w-full">
        <label className="text-lg font-bold">Nama Lengkap</label>
        <Input
          defaultValue={service.query.profileUser.fullName}
          disabled={!state.isEdit}
          onChange={(e) =>
            state.setFormUpdateProfile((prev) => ({
              ...prev,
              fullName: e.target.value,
            }))
          }
        />
      </div>
      <div className="w-full">
        <label className="text-lg font-bold">Nomor Hp/Email</label>
        <Input
          defaultValue={
            service.query.profileUser.phone ?? service.query.profileUser.email
          }
          disabled={!state.isEdit}
          onChange={(e) =>
            state.setFormUpdateProfile((prev) => ({
              ...prev,
              identifier: e.target.value,
            }))
          }
        />
      </div>
      <div className="w-full">
        <label className="text-lg font-bold">Peran</label>
        <Input
          defaultValue={service.query.profileUser.role}
          value={service.query.profileUser.role}
          disabled
        />
      </div>
    </div>
  );
};

export default EditProfileSection;
