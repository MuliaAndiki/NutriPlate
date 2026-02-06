"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import ProfileKesehatanAnakHeroSection from "@/components/section/private/parent/profile-anak/detail-profile-anak/profile-kesehatan-anak/profile-kesehatan-anak-section";
import { SidebarLayout } from "@/core/layouts/sidebar.layout";
import useService from "@/hooks/mutation/prop.service";
import { useAppNameSpace } from "@/hooks/useAppNameSpace";
import { FormUpdateProfileChild } from "@/types/form/child.form";
import { parsePayload } from "@/utils/parse.format";

const ProfileKesehatanAnakContainer = () => {
  const nameSpace = useAppNameSpace();
  const { childrenID } = useParams<{ childrenID: string }>();
  const service = useService();
  //children
  const childQueryByID = service.user.query.childById(childrenID);
  const childDataByID = childQueryByID.data?.data ?? null;

  //mutation
  const updateProfile = service.child.mutation.update();

  //state
  const [formUpdateProfileChild, setFormUpdateProfileChild] =
    useState<FormUpdateProfileChild | null>(null);
  const [isEdit, setIsEdit] = useState<boolean>(false);

  //handler
  const handleUpdateProfileChild = () => {
    if (!isEdit || !childDataByID) return;

    const payload = parsePayload(childDataByID, formUpdateProfileChild);
    if (Object.keys(payload).length === 0) {
      console.log("tidak ada perubahan");
    }
    updateProfile.mutate(
      {
        id: childrenID,
        payload: payload,
      },
      {
        onSuccess: () => {
          nameSpace.router.back();
        },
      },
    );
  };
  //sycnh
  useEffect(() => {
    if (!childDataByID?.profileChild) return;

    setFormUpdateProfileChild((prev) => {
      if (
        prev?.profileChild &&
        JSON.stringify(prev.profileChild) ===
          JSON.stringify(childDataByID.profileChild)
      ) {
        return prev;
      }

      return {
        profileChild: {
          birthWeightKg: childDataByID.profileChild.birthWeightKg,
          birthHeightCm: childDataByID.profileChild.birthHeightCm,
          pregnancyAgeWeeks: childDataByID.profileChild.pregnancyAgeWeeks,
          allergicFoods: childDataByID.profileChild.allergicFoods ?? [],
          chronicConditions: childDataByID.profileChild.chronicConditions ?? [],
          feedingType: childDataByID.profileChild.feedingType ?? "",
          activityLevel: childDataByID.profileChild.activityLevel ?? "",
          baselineWeightKg: childDataByID.profileChild.baselineWeightKg,
          baselineHeightCm: childDataByID.profileChild.baselineHeightCm,
          baselineBmi: childDataByID.profileChild.baselineBmi,
          baselineZscore: childDataByID.profileChild.baselineZscore,
        },
      };
    });
  }, [childDataByID.id]);

  return (
    <SidebarLayout>
      <main className="w-full min-h-screen overflow-x-hidden">
        <ProfileKesehatanAnakHeroSection
          namespace={{
            router: nameSpace.router,
          }}
          state={{
            formUpdateProfileChild: formUpdateProfileChild,
            setFormUpdateProfileChild: setFormUpdateProfileChild,
            isEdit: isEdit,
            setIsEdit: setIsEdit,
          }}
          service={{
            mutation: {
              onUpdate: () => handleUpdateProfileChild(),
            },
          }}
        />
      </main>
    </SidebarLayout>
  );
};

export default ProfileKesehatanAnakContainer;
