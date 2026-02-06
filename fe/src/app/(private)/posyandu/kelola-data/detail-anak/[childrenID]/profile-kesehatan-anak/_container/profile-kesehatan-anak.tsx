"use client";

import ProfileKesehatanAnakPosyanduSection from "@/components/section/private/posyandu/kelola-data/detail-anak/profile-kesehatan-anak/profile-kesehatan-anak-section";
import useService from "@/hooks/mutation/prop.service";
import { useAppNameSpace } from "@/hooks/useAppNameSpace";
import { useParams } from "next/navigation";

const ProfileKesehatanAnakPosyanduContainer = () => {
  const namespace = useAppNameSpace();
  const service = useService();
  const { childrenID } = useParams<{ childrenID: string }>();

  //children
  const childQueryByID = service.user.query.childById(childrenID);
  const childDataByID = childQueryByID.data?.data ?? null;

  return (
    <main className="w-full min-h-screen">
      <ProfileKesehatanAnakPosyanduSection
        namespace={{
          router: namespace.router,
        }}
        service={{
          query: {
            isLoading: childQueryByID.isLoading,
            children: childDataByID ?? null,
          },
        }}
      />
    </main>
  );
};

export default ProfileKesehatanAnakPosyanduContainer;
