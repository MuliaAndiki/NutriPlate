"use client";
import { useParams } from "next/navigation";

import DetailProfileAnakHeroSection from "@/components/section/private/parent/profile-anak/detail-profile-anak/detail-profile-anak-section";

import useService from "@/hooks/mutation/prop.service";
import { useAppNameSpace } from "@/hooks/useAppNameSpace";
import { useState } from "react";
import { FormRegisteredChild } from "@/types/form/child.form";
import { useAppSelector } from "@/hooks/dispatch/dispatch";
const DetailProfileAnakContainer = () => {
  const namespace = useAppNameSpace();
  const service = useService();
  const { childrenID } = useParams<{ childrenID: string }>();
  const selector = useAppSelector((state) => state.posyandu);

  const segments = namespace.pathname.split("/");
  const section = segments[2];

  //child
  const childQueryByID = service.user.query.childById(childrenID);
  const chilDataByID = childQueryByID.data?.data ?? null;
  const chilDataPosyanduId = chilDataByID?.posyanduId ?? "";
  //measurement
  const measurementQuery = service.measuremnt.query.measurement(childrenID);
  const measurementData = measurementQuery.data?.data ?? [];
  // food Summary Daily
  const foodSummaryDailyQuery =
    service.foodSummary.query.foodSummaryDaily(childrenID);
  const foodSummaryDailyData = foodSummaryDailyQuery.data?.data ?? null;

  //posyandu
  const posyanduQuery = service.posyandu.query.getPosyandu();
  const posyanduData = posyanduQuery.data?.data ?? [];

  const posyanduByIdQuery =
    service.posyandu.query.getPosyanduById(chilDataPosyanduId);
  const posyanduByIdData = posyanduByIdQuery.data?.data ?? null;
  const registerdChildMutation = service.child.mutation.registerd();
  //state
  const [formRegisteredChild, setFormRegisterdChild] =
    useState<FormRegisteredChild>({
      posyanduID: undefined,
    });

  // handler
  const handleRegiterdChild = () => {
    if (!formRegisteredChild?.posyanduID || !childrenID) return null;
    registerdChildMutation.mutate(
      {
        payload: formRegisteredChild,
        id: childrenID,
      },
      {
        onSuccess: () => {
          setFormRegisterdChild({
            posyanduID: undefined,
          });
        },
      },
    );
  };

  return (
    <main className="w-full min-h-screen overflow-x-hidden">
      <DetailProfileAnakHeroSection
        namespace={{
          router: namespace.router,
        }}
        service={{
          mutation: {
            isPending: registerdChildMutation.isPending,
            onRegisterd: handleRegiterdChild,
          },
          query: {
            ChildCard: chilDataByID ?? [],
            isLoading:
              childQueryByID.isLoading ||
              measurementQuery.isLoading ||
              foodSummaryDailyQuery.isLoading ||
              posyanduQuery.isLoading ||
              posyanduByIdQuery.isLoading,
            Measuremnt: measurementData ?? [],
            foodSummaryDaily: foodSummaryDailyData ?? null,
            Posyandu: posyanduData ?? [],
            posyanduById: posyanduByIdData ?? null,
          },
        }}
        state={{
          formRegisterdChild: formRegisteredChild,
          setFormRegisterdChild: setFormRegisterdChild,
          role: selector.role!,
          section: section,
        }}
      />
    </main>
  );
};

export default DetailProfileAnakContainer;
