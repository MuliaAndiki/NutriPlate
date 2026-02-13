"use client";

import EditProfilePosyanduSection from "@/components/section/private/posyandu/profile/edit-profile/edit-profile-section";
import { useAppSelector } from "@/hooks/dispatch/dispatch";
import useService from "@/hooks/mutation/prop.service";
import { useAppNameSpace } from "@/hooks/useAppNameSpace";
import { FormUpdatePosyandu } from "@/types/form";
import { useAvatarReducer } from "@/hooks/useAvatarReducer";
import { fileToBase64 } from "@/utils/base64";
import { parsePayload } from "@/utils/parse.format";
import { useEffect, useState } from "react";

const EditProfilePosyanduContainer = () => {
  // initial
  const namespace = useAppNameSpace();
  const service = useService();
  const selector = useAppSelector((state) => state.posyandu.posyanduId);

  //posyandu
  const posyanduByIDQuery = service.posyandu.query.getPosyanduById(selector!);
  const posyanduByIDData = posyanduByIDQuery.data?.data ?? null;

  //mutation
  const updatePosyandu = service.posyandu.mutation.update();

  // state
  const [formUpdatePosyandu, setFormUpdatePosyandu] =
    useState<FormUpdatePosyandu | null>(null);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const { avatar, selectAvatar, removePreview } = useAvatarReducer(
    posyanduByIDData?.avaUrl ?? null,
  );

  //handler
  const handleChangeAvatar = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const base64 = await fileToBase64(file);
      const Previewurl = URL.createObjectURL(file);
      selectAvatar(Previewurl, base64);
      setFormUpdatePosyandu((prev) =>
        prev ? { ...prev, avaUrl: base64 } : prev,
      );
    }
  };

  const handleRemovePreview = () => {
    removePreview();
    setFormUpdatePosyandu((prev) =>
      prev ? { ...prev, avaUrl: avatar.original ?? "" } : prev,
    );
  };

  const handlerUpdatePosyandu = async () => {
    try {
      if (!selector || !posyanduByIDData || !formUpdatePosyandu || !isEdit) {
        return null;
      }

      const payload = parsePayload(posyanduByIDData, formUpdatePosyandu);

      if (Object.keys(payload).length === 0) {
        namespace.alert.toast({
          title: "info",
          message: "tidak ada perubahan",
          icon: "info",
        });
        return;
      }

      const isEmailUpdated =
        typeof formUpdatePosyandu.email === "string" &&
        formUpdatePosyandu.email.length > 0 &&
        formUpdatePosyandu.email !== posyanduByIDData.email;

      await updatePosyandu.mutateAsync({
        id: selector,
        payload: payload,
      });

      if (isEmailUpdated) {
        namespace.router.push(
          `/verify?identifier=${formUpdatePosyandu.email}&target=/posyandu/profile`,
        );
      } else {
        namespace.router.push("/posyandu/profile");
      }
      setIsEdit(false);
    } catch (error) {
      namespace.alert.toast({
        title: "failed",
        message: "server crash",
        icon: "error",
      });
    }
  };

  useEffect(() => {
    if (!posyanduByIDData) return;
    setFormUpdatePosyandu((prev) => {
      if (prev?.name === posyanduByIDData.name) return prev;
      return {
        name: posyanduByIDData.name ?? "",
        scheduleDay: posyanduByIDData.scheduleDay ?? 0,
        avaUrl: posyanduByIDData.avaUrl ?? "",
        email: posyanduByIDData.email ?? "",
        phone: posyanduByIDData.phone ?? "",
      };
    });
  }, [posyanduByIDData?.id]);

  return (
    <main className="w-full min-h-screen">
      <EditProfilePosyanduSection
        namespace={{
          router: namespace.router,
        }}
        service={{
          mutation: {
            editPosyandu: handlerUpdatePosyandu,
            isPending: updatePosyandu.isPending,
            onChangeAva: handleChangeAvatar,
            onRemovePreview: handleRemovePreview,
          },
          query: {
            posyandu: posyanduByIDData,
            isLoading: posyanduByIDQuery.isLoading,
          },
        }}
        state={{
          formUpdatePosyandu: formUpdatePosyandu,
          setFormUpdatePosyandu: setFormUpdatePosyandu,
          isEdit: isEdit,
          setIsEdit: setIsEdit,
          preview: avatar.preview,
        }}
      />
    </main>
  );
};

export default EditProfilePosyanduContainer;
