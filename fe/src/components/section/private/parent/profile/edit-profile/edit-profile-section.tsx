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
import EditProfileSectionSkeleton from "@/components/skeleton/private/parent/profile/edit-profile/edit-profile-section-skeleton";
import DataNotFound from "@/components/empty/data-not-found";
import { Spinner } from "@/components/ui/spinner";

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
      isPending: boolean;
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
  const resProfile = service.query.profileUser;

  if (!resProfile) {
    return <DataNotFound />;
  }
  if (service.query.isLoading) {
    return <EditProfileSectionSkeleton />;
  }
  return (
    <div className="w-full min-h-screen flex justify-start flex-col items-center p-2  ">
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
              disabled={service.mutation.isPending}
              className="flex items-center"
              onClick={() => state.setIsEdit(false)}
            >
              <Icon
                icon="bxs:edit"
                width="24"
                height="24"
                className="text-background"
              />
              <h1 className="text-background">Batalkan</h1>
            </Button>
            <Button
              variant={"btn"}
              className="flex items-center"
              disabled={service.mutation.isPending}
              onClick={() => service.mutation.onUpdateProfile()}
            >
              <Icon icon="bxs:edit" width="24" height="24" />
              <h1>{service.mutation.isPending ? <Spinner /> : "Simpan"}</h1>
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
              src={resProfile.avaUrl ?? "/avatars/1.png"}
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
          defaultValue={resProfile.fullName}
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
          defaultValue={resProfile.phone ?? resProfile.email}
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
          defaultValue={resProfile.role}
          value={resProfile.role}
          disabled
        />
      </div>
    </div>
  );
};

export default EditProfileSection;
