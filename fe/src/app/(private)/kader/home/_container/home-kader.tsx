"use client";
import HomeKaderHeroSection from "@/components/section/private/kader/home/home-kader-section";
import { SidebarLayout } from "@/core/layouts/sidebar.layout";
import useService from "@/hooks/mutation/prop.service";
import { PopUpNavigate } from "@/types/ui";
import { useState } from "react";

const HomeKaderContainer = () => {
  const service = useService();
  // profile
  const profileQuery = service.user.query.profile();
  const profileData = profileQuery.data?.data ?? null;
  const posyanduId = profileData?.posyanduId;
  const kaderId = profileData?.id;
  // children in posyandu
  const childInPosyanduQuery = service.posyandu.query.getChildren(posyanduId);
  const childInPosyanduData = childInPosyanduQuery.data?.data ?? [];

  // posyandu
  const posyanduQuery = service.posyandu.query.getPosyandu();
  const posyanduData = posyanduQuery.data?.data ?? [];

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
                posyanduQuery.isLoading,
              profile: profileData ?? null,
              childInPosyandu: childInPosyanduData ?? [],
              posyandu: posyanduData ?? [],
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
