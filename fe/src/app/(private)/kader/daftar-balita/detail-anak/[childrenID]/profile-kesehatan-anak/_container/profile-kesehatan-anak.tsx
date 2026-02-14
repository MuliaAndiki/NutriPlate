"use client";

import ProfileKesehatanAnakKaderSection from "@/components/section/private/kader/daftar-balita/detail-anak/profile-kesehatan-anak/profile-kesehatan-anak-section";
import useService from "@/hooks/mutation/prop.service";
import { useAppNameSpace } from "@/hooks/useAppNameSpace";
import { useParams } from "next/navigation";

const ProfileKesehatanAnakKaderContainer = () => {
  const namespace = useAppNameSpace();
  const service = useService();
  const { childrenID } = useParams<{ childrenID: string }>();

  //children
  const childQueryByID = service.user.query.childById(childrenID);
  const childDataByID = childQueryByID.data?.data ?? null;

  return (
    <main className="w-full min-h-screen">
      <ProfileKesehatanAnakKaderSection
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

export default ProfileKesehatanAnakKaderContainer;
