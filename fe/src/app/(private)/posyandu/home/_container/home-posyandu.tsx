"use client";
import HomePosyanduHeroSection from "@/components/section/private/posyandu/home/home-posyandu-section";
import { SidebarLayout } from "@/core/layouts/sidebar.layout";
import useService from "@/hooks/mutation/prop.service";
import { useEffect } from "react";
import { useAppNameSpace } from "@/hooks/useAppNameSpace";
import { setPosyanduId } from "@/stores/posyanduSlice/posyanduSlice";

const HomePosyanduContainer = () => {
  const service = useService();
  const namespace = useAppNameSpace();

  const profileQuery = service.user.query.profile();
  const profileData = profileQuery.data?.data ?? null;
  const posyanduId = profileData?.posyandu?.id ?? "";
  const role = profileData?.role ?? "";

  useEffect(() => {
    if (!profileData) return;
    namespace.dispatch(setPosyanduId(posyanduId));
  }, [profileData, namespace.dispatch]);
  // measurement
  const MeasurementAllQuery =
    service.measuremnt.query.allMeasurement(posyanduId);
  const MeasurementAllData = MeasurementAllQuery.data?.data ?? [];

  // children
  const childInPosyanduQuery = service.user.query.childAll({
    posyanduId: posyanduId,
    role: role,
  });
  const childInPosyanduData = childInPosyanduQuery.data?.data ?? [];

  // kader
  const kaderQuery = service.posyandu.query.getKaderList();
  const KaderData = kaderQuery.data?.data ?? [];

  console.log("feta", profileData);
  return (
    <SidebarLayout>
      <main className="w-full min-h-screen overflow-x-hidden">
        <HomePosyanduHeroSection
          service={{
            query: {
              isLoading:
                profileQuery.isLoading ||
                childInPosyanduQuery.isLoading ||
                kaderQuery.isLoading ||
                MeasurementAllQuery.isLoading,
              profile: profileData ?? null,
              measurement: MeasurementAllData ?? [],
              childInPosyandu: childInPosyanduData ?? [],
              kader: KaderData ?? [],
            },
          }}
        />
      </main>
    </SidebarLayout>
  );
};

export default HomePosyanduContainer;
