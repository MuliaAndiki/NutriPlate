"use client";
import { useParams } from "next/navigation";

import DetailProfileAnakHeroSection from "@/components/section/private/parent/profile-anak/detail-profile-anak/detail-profile-anak-section";
import { SidebarLayout } from "@/core/layouts/sidebar.layout";
import useService from "@/hooks/mutation/prop.service";
import { useAppNameSpace } from "@/hooks/useAppNameSpace";
import { useEffect, useState } from "react";
import { FormRegisteredChild } from "@/types/form/child.form";
const DetailProfileAnakContainer = () => {
  const nameSpace = useAppNameSpace();
  const service = useService();
  const { id } = useParams<{ id: string }>();
  //child
  const childQueryByID = service.user.query.childById(id);
  const chilDataByID = childQueryByID.data?.data ?? null;
  const chilDataPosyanduId = chilDataByID?.posyanduId ?? "";
  //measurement
  const measurementQuery = service.measuremnt.query.measurement(id);
  const measurementData = measurementQuery.data?.data ?? [];
  // food Summary Daily
  const foodSummaryDailyQuery = service.foodSummary.query.foodSummaryDaily(id);
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
    if (!formRegisteredChild?.posyanduID || !id) return null;
    registerdChildMutation.mutate(
      {
        payload: formRegisteredChild,
        id: id,
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
    <SidebarLayout>
      <main className="w-full min-h-screen overflow-x-hidden">
        <DetailProfileAnakHeroSection
          namespace={{
            router: nameSpace.router,
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
          }}
        />
      </main>
    </SidebarLayout>
  );
};

export default DetailProfileAnakContainer;
