"use client";
import EditProfileSection from "@/components/section/private/parent/profile/edit-profile/edit-profile-section";
import { SidebarLayout } from "@/core/layouts/sidebar.layout";
import useService from "@/hooks/mutation/prop.service";
import { useAppNameSpace } from "@/hooks/useAppNameSpace";
import { FormUpdateProfile } from "@/types/form/auth.form";
import { useState } from "react";
import { useAvatarReducer } from "@/hooks/useAvatarReducer";
import { fileToBase64 } from "@/utils/base64";
import { parsePayload } from "@/utils/parse.format";

const EditProfileContainer = () => {
  const nameSpace = useAppNameSpace();
  const service = useService();
  const useGetProfileQuery = service.user.query.profile();
  const useGetProfileData = useGetProfileQuery.data?.data ?? null;
  const updateProfile = service.user.mutation.updateProfile();
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const { avatar, selectAvatar, removePreview } = useAvatarReducer();
  const [formUpdateProfile, setFormUpdateProfile] = useState<FormUpdateProfile>(
    {
      fullName: "",
      identifier: "",
      avaUrl: "",
    },
  );

  const handleChangeAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const base64 = await fileToBase64(file);
      const Previewurl = URL.createObjectURL(file);
      selectAvatar(Previewurl, base64);
      setFormUpdateProfile((prev) => ({
        ...prev,
        avaUrl: base64,
      }));
    }
  };

  const handleRemovePreview = () => {
    removePreview();
    setFormUpdateProfile((prev) => ({
      ...prev,
      identifier: "",
    }));
  };

  const handleUpdateProfile = async () => {
    try {
      if (!isEdit || !useGetProfileData || !formUpdateProfile) return null;
      const payload: any = {
        fullName: formUpdateProfile.fullName,
        avaUrl: formUpdateProfile.avaUrl,
      };
      const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        formUpdateProfile.identifier,
      );
      if (isEmail) {
        payload.email = formUpdateProfile.identifier;
      } else {
        payload.phone = formUpdateProfile.identifier;
      }

      const parse = parsePayload(useGetProfileData, payload);
      const res = await updateProfile.mutateAsync(parse);
      const email = res.data.email;

      if (res.data.isUpdateEmail) {
        nameSpace.router.push(
          `/verify?identifier=${email}&target=/parent/profile`,
        );
      } else {
        nameSpace.router.push("/parent/profile");
      }

      console.log("ini nama", res.data.fullName);

      setIsEdit(false);
    } catch (error) {
      nameSpace.alert.toast({
        title: "failed",
        message: "server crash",
        icon: "error",
      });
    }
  };

  return (
    <SidebarLayout>
      <main className="w-full min-h-screen overflow-x-hidden">
        <EditProfileSection
          namespace={{
            router: nameSpace.router,
          }}
          service={{
            mutation: {
              onChangeAvatars: handleChangeAvatar,
              onRemovePreview: handleRemovePreview,
              onUpdateProfile: () => handleUpdateProfile(),
            },
            query: {
              profileUser: useGetProfileData,
              isLoading: useGetProfileQuery.isLoading,
            },
          }}
          state={{
            isEdit: isEdit,
            preview: avatar.preview,
            setFormUpdateProfile: setFormUpdateProfile,
            setIsEdit: setIsEdit,
          }}
        />
      </main>
    </SidebarLayout>
  );
};

export default EditProfileContainer;
