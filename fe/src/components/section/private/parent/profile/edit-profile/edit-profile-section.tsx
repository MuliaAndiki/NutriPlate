import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormUpdateProfile } from "@/types/form/auth.form";
import { IAuth } from "@/types/schema/auth.schema";
import UploadsTrigger from "@/utils/uploadTrigger";
import { Icon } from "@iconify/react/dist/iconify.js";
import { ChevronLeft } from "lucide-react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import Image from "next/image";

interface EditProfileSectionProps {
  router: AppRouterInstance;
  profileUser: IAuth;
  isLoading: boolean;
  isEdit: boolean;
  setIsEdit: React.Dispatch<React.SetStateAction<boolean>>;
  onUpdateProfile: () => void;
  preview: string | null;
  formUpdate: FormUpdateProfile;
  setFormUpdateProfile: React.Dispatch<React.SetStateAction<FormUpdateProfile>>;
  onChangeAvatars: (e: any) => void;
  logic: {
    onRemovePreview: () => void;
  };
}
const EditProfileSection: React.FC<EditProfileSectionProps> = ({
  router,
  profileUser,
  isLoading,
  isEdit,
  onUpdateProfile,
  setIsEdit,
  preview,
  formUpdate,
  setFormUpdateProfile,
  onChangeAvatars,
  logic,
}) => {
  if (isLoading) {
    return <div>loading..</div>;
  }
  return (
    <div className="w-full min-h-screen flex justify-start flex-col items-center  ">
      <div className="w-full flex justify-between items-center">
        <div className="w-full flex items-center justify-start">
          <ChevronLeft onClick={() => router.back()} className="scale-120" />
          <h1 className="text-2xl font-extrabold">Edit Profile</h1>
        </div>
        {isEdit ? (
          <div className="w-full flex items-center gap-4">
            <Button
              variant={"destructive"}
              className="flex items-center"
              onClick={() => setIsEdit(false)}
            >
              <Icon icon="bxs:edit" width="24" height="24" />
              <h1>Batalkan</h1>
            </Button>
            <Button
              variant={"btn"}
              className="flex items-center"
              onClick={() => onUpdateProfile()}
            >
              <Icon icon="bxs:edit" width="24" height="24" />
              <h1>Simpan</h1>
            </Button>
          </div>
        ) : (
          <Button
            variant={"btn"}
            className="flex items-center"
            onClick={() => setIsEdit(true)}
          >
            <Icon icon="bxs:edit" width="24" height="24" />
            <h1>Edit</h1>
          </Button>
        )}
      </div>
      <div className="w-full flex items-center justify-center mt-4">
        {!preview ? (
          <UploadsTrigger
            accept="image/*"
            multiple={false}
            className="relative"
            onChange={(e) => onChangeAvatars(e)}
            disable={!isEdit}
          >
            <Image
              alt="profile"
              src={profileUser.avaUrl ?? "/avatars/1.png"}
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
              onChange={(e) => onChangeAvatars(e)}
            >
              <Image
                alt="profile"
                src={preview ?? "/avatars/1.png"}
                width={150}
                height={150}
                className="object-cover rounded-full aspect-square"
              />
              <div className="absolute right-4 -translate-y-6">
                <Icon icon="bi:camera-fill" width="26" height="26" />
              </div>
            </UploadsTrigger>
            <div className="w-full flex justify-center items-center mt-1">
              <Button variant={"liner"} onClick={() => logic.onRemovePreview()}>
                Hapus
              </Button>
            </div>
          </div>
        )}
      </div>
      <div className="w-full">
        <label className="text-lg font-bold">Nama Lengkap</label>
        <Input
          defaultValue={profileUser.fullName}
          disabled={!isEdit}
          onChange={(e) =>
            setFormUpdateProfile((prev) => ({
              ...prev,
              fullName: e.target.value,
            }))
          }
        />
      </div>
      <div className="w-full">
        <label className="text-lg font-bold">Nomor Hp/Email</label>
        <Input
          defaultValue={profileUser.phone ?? profileUser.email}
          disabled={!isEdit}
          onChange={(e) =>
            setFormUpdateProfile((prev) => ({
              ...prev,
              identifier: e.target.value,
            }))
          }
        />
      </div>
      <div className="w-full">
        <label className="text-lg font-bold">Peran</label>
        <Input
          defaultValue={profileUser.role}
          value={profileUser.role}
          disabled
        />
      </div>
    </div>
  );
};

export default EditProfileSection;
