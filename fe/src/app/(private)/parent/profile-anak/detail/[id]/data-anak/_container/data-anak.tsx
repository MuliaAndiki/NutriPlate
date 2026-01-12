"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import DataAnakHeroSection from "@/components/section/private/parent/profile-anak/detail-profile-anak/data-anak/data-anak-section";
import { SidebarLayout } from "@/core/layouts/sidebar.layout";
import useService from "@/hooks/mutation/prop.service";
import { useAppNameSpace } from "@/hooks/useAppNameSpace";
import { useAvatarReducer } from "@/hooks/useAvatarReducer";
import { FormUpdateChild } from "@/types/form/child.form";
import { fileToBase64 } from "@/utils/base64";
import { parsePayload } from "@/utils/parse.format";

const DataAnakContainer = () => {
  const nameSpace = useAppNameSpace();
  const { id } = useParams<{ id: string }>();
  const service = useService();
  const childQueryByID = service.user.query.childById(id);
  const chilDataByID = childQueryByID.data?.data ?? null;
  const updateChild = service.child.mutation.update();
  const deleteChild = service.child.mutation.delete();
  const [formUpdateChild, setFormUpdateChild] =
    useState<FormUpdateChild | null>(null);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const { avatar, selectAvatar, removePreview } = useAvatarReducer(
    chilDataByID?.avaChild ?? null
  );

  useEffect(() => {
    if (!chilDataByID) return;
    setFormUpdateChild((prev) => {
      if (prev?.id === chilDataByID.id) return prev;
      return {
        dateOfBirth: chilDataByID.dateOfBirth,
        fullName: chilDataByID.fullName,
        placeOfBirth: chilDataByID.placeOfBirth,
        gender: chilDataByID.gender,
        avaChild: chilDataByID.avaChild,
        id: chilDataByID.id,
      };
    });
  }, [chilDataByID]);

  const handleChangeAvaChild = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const base64 = await fileToBase64(file);
      const previewUrl = URL.createObjectURL(file);
      selectAvatar(previewUrl, base64);

      setFormUpdateChild((prev) =>
        prev ? { ...prev, avaChild: base64 } : prev
      );
    }
  };

  const handleRemovePreview = () => {
    removePreview();
    setFormUpdateChild((prev) =>
      prev ? { ...prev, avaChild: avatar.original ?? "" } : prev
    );
  };

  const handleUpdateChild = () => {
    if (!isEdit || !chilDataByID || !formUpdateChild) return null;

    const payload = parsePayload(chilDataByID, formUpdateChild);

    if (Object.keys(payload).length === 0) {
      console.log("tidak ada perubahan");
      return;
    }

    updateChild.mutate(
      {
        id: id,
        payload: payload,
      },
      {
        onSuccess: () => {
          nameSpace.router.back();
        },
      }
    );
  };

  const handleDeleteChild = (id: string) => {
    if (!id) return null;

    deleteChild.mutate(
      { id: id },
      {
        onSuccess: () => {
          nameSpace.router.push("/parent/profile-anak");
        },
      }
    );
  };

  return (
    <SidebarLayout>
      <main className="w-full min-h-screen overflow-x-hidden">
        <DataAnakHeroSection
          namespace={{
            router: nameSpace.router,
            alert: nameSpace.alert,
          }}
          service={{
            mutation: {
              onChangeAva: handleChangeAvaChild,
              onDelete: handleDeleteChild,
              onRemovePreview: handleRemovePreview,
              onUpdate: () => handleUpdateChild(),
            },
          }}
          state={{
            formUpdateChild: formUpdateChild,
            setFormUpdateChild: setFormUpdateChild,
            isEdit: isEdit,
            preview: avatar.preview,
            setIsEdit: setIsEdit,
          }}
        />
      </main>
    </SidebarLayout>
  );
};

export default DataAnakContainer;
