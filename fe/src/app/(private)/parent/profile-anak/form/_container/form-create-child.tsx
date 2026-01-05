"use client";
import { useState } from "react";

import FormCreateChildSection from "@/components/section/private/parent/_form/create-child-form";
import { SidebarLayout } from "@/core/layouts/sidebar.layout";
import useService from "@/hooks/mutation/prop.service";
import { useAppNameSpace } from "@/hooks/useAppNameSpace";
import { useAvatarReducer } from "@/hooks/useAvatarReducer";
import { FormCreateChild } from "@/types/form/child.form";
import { fileToBase64 } from "@/utils/base64";

const FormCreateChildContainer = () => {
  const nameSpace = useAppNameSpace();
  const service = useService();
  const createChild = service.child.mutation.create();
  const { avatar, removePreview, selectAvatar } = useAvatarReducer();
  const [formCreateChiild, setFormCreateChild] = useState<FormCreateChild>({
    dateOfBirth: "",
    fullName: "",
    placeOfBirth: "",
    gender: "",
    avaChild: "",
    profileChild: {
      birthWeightKg: undefined,
      birthHeightCm: undefined,
      pregnancyAgeWeeks: undefined,
      allergicFoods: [],
      chronicConditions: [],
      feedingType: "",
      activityLevel: "",
    },
  });

  const handleCreateChild = () => {
    if (
      !formCreateChiild.fullName ||
      !formCreateChiild.dateOfBirth ||
      !formCreateChiild.gender
    ) {
      return nameSpace.alert.toast({
        title: "Perhatian",
        message: "Mengisi Field",
        icon: "warning",
      });
    } else {
      createChild.mutate(formCreateChiild, {
        onSuccess: () => {
          nameSpace.router.push("/parent/profile-anak");
        },
      });
    }
  };

  const handleChangeAvaChild = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (file) {
      const base64 = await fileToBase64(file);
      const Previewurl = URL.createObjectURL(file);
      selectAvatar(Previewurl, base64);
      setFormCreateChild((prev) => ({
        ...prev,
        avaChild: base64,
      }));
    }
  };

  const handleRemovePreview = () => {
    removePreview();
    setFormCreateChild((prev) => ({
      ...prev,
      avaChild: "",
    }));
  };

  return (
    <SidebarLayout>
      <div className="w-full min-h-screen overflow-x-hidden">
        <FormCreateChildSection
          router={nameSpace.router}
          formCreateChild={formCreateChiild}
          setFormCreateChild={setFormCreateChild}
          preview={avatar.preview}
          onChangeAva={handleChangeAvaChild}
          onRemovePreview={handleRemovePreview}
          isPending={createChild.isPending}
          onCreate={() => handleCreateChild()}
        />
      </div>
    </SidebarLayout>
  );
};

export default FormCreateChildContainer;
