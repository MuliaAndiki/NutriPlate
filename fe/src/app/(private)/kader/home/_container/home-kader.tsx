"use client";
import HomeKaderHeroSection from "@/components/section/private/kader/home/home-kader-section";
import { SidebarLayout } from "@/core/layouts/sidebar.layout";
import useService from "@/hooks/mutation/prop.service";
import { useAppNameSpace } from "@/hooks/useAppNameSpace";
import { PopUpNavigate } from "@/types/ui";
import { useDebugLog } from "@/utils/useDebug";
import { useState } from "react";

const HomeKaderContainer = () => {
  const service = useService();
  const namespace = useAppNameSpace();

  // profile
  const profileQuery = service.user.query.profile();
  const profileData = profileQuery.data?.data ?? null;
  const posyanduId = profileData?.posyanduId;
  const kaderId = profileData?.id ?? "";
  const role = profileData?.role ?? "";

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

  // posyandu
  const posyanduQuery = service.posyandu.query.getPosyandu();
  const posyanduData = posyanduQuery.data?.data ?? [];

  //posyanduById
  const posyanduByIdQuery = service.posyandu.query.getPosyanduById(posyanduId);
  const posyanduByIdData = posyanduByIdQuery.data?.data ?? null;

  const [posyanduSelectId, setPosyanduSelectId] = useState<string>("");
  const registerKaderMutation = service.registerKader.mutation.registerKader();

  const handleRegisterKader = () => {
    if (!kaderId || !posyanduSelectId) return;

    registerKaderMutation.mutate(
      {
        kaderId,
        posyanduId: posyanduSelectId,
      },
      {
        onSuccess: () => {
          // key here
          setPopup(null);
        },
      },
    );
  };
  const [popup, setPopup] = useState<PopUpNavigate>(null);

  return (
    <SidebarLayout>
      <main className="w-full min-h-screen ">
        <HomeKaderHeroSection
          service={{
            query: {
              isLoading:
                profileQuery.isLoading ||
                childInPosyanduQuery.isLoading ||
                posyanduQuery.isLoading ||
                MeasurementAllQuery.isLoading ||
                posyanduByIdQuery.isLoading,
              profile: profileData ?? null,
              measurement: MeasurementAllData ?? [],
              childInPosyandu: childInPosyanduData ?? [],
              posyandu: posyanduData ?? [],
              posyanduById: posyanduByIdData ?? null,
            },
            mutation: {
              onRegisterKader: handleRegisterKader,
              isPending: registerKaderMutation.isPending,
            },
          }}
          state={{
            popup: popup,
            setPopup: setPopup,
            posyanduId: posyanduSelectId,
            setPosyabduId: setPosyanduSelectId,
          }}
        />
      </main>
    </SidebarLayout>
  );
};

export default HomeKaderContainer;
