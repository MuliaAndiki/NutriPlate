"use client";
import FormCreateChildSection from "@/components/section/private/parent/_form/create-child-form";
import { SidebarLayout } from "@/core/layouts/sidebar.layout";
import useService from "@/hooks/mutation/prop.service";
import { useAppNameSpace } from "@/hooks/useAppNameSpace";
import { FormCreateChild } from "@/types/form/child.form";
import { fileToBase64 } from "@/utils/base64";
import { useEffect, useState } from "react";

const FormCreateChildContainer = () => {
  const nameSpace = useAppNameSpace();
  const service = useService();
  const createChild = service.child.mutation.create();
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
      baselineHeightCm: undefined,
      baselineBmi: undefined,
      baselineWeightKg: undefined,
      baselineZscore: undefined,
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
  const [preview, setPreview] = useState<string | null>(null);

  const handleChangeAvaChild = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (file) {
      const base64 = await fileToBase64(file);
      setFormCreateChild((prev) => ({
        ...prev,
        avaChild: base64,
      }));
      const url = URL.createObjectURL(file);
      setPreview(url);
      return () => URL.revokeObjectURL(url);
    }
  };

  return (
    <SidebarLayout>
      <div className="w-full min-h-screen overflow-x-hidden">
        <FormCreateChildSection
          router={nameSpace.router}
          formCreateChild={formCreateChiild}
          setFormCreateChild={setFormCreateChild}
          preview={preview}
          onChangeAva={handleChangeAvaChild}
          setPreview={setPreview}
          isPending={createChild.isPending}
          onCreate={() => handleCreateChild()}
        />
      </div>
    </SidebarLayout>
  );
};

export default FormCreateChildContainer;
