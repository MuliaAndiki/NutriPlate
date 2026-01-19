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
  const chilDataByID = childQueryByID.data?.data ?? [];
  //measurement
  const measurementQuery = service.measuremnt.query.measurement(id);
  const measurementData = measurementQuery.data?.data ?? null;
  // food Summary Daily
  const foodSummaryDailyQuery = service.foodSummary.query.foodSummaryDaily(id);
  const foodSummaryDailyData = foodSummaryDailyQuery.data?.data ?? null;

  //posyandu
  const posyanduQuery = service.posyandu.query.getPosyandu();
  const posyanduData = posyanduQuery.data?.data ?? [];

  const registerdChildMutation = service.child.mutation.registerd();
  //state
  const [formRegisteredChild, setFormRegisterdChild] =
    useState<FormRegisteredChild>({
      posyanduID: "",
    });

  // handler
  const handleRegiterdChild = () => {
    if (!formRegisteredChild.posyanduID || !id) return null;
    registerdChildMutation.mutate(
      {
        payload: formRegisteredChild,
        id: id,
      },
      {
        onSuccess: () => {
          setFormRegisterdChild((prev) => ({
            ...prev,
            posyanduID: "",
          }));
        },
      },
    );
  };

  useEffect(() => {
    const childPosyanduId =
      chilDataByID?.posyandu?.id ?? chilDataByID?.posyanduId;

    if (childPosyanduId) {
      setFormRegisterdChild((prev) => {
        if (prev.posyanduID === childPosyanduId) return prev;

        return {
          ...prev,
          posyanduID: childPosyanduId,
        };
      });
    }
  }, [chilDataByID]);

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
                posyanduQuery.isLoading,
              Measuremnt: measurementData ?? null,
              foodSummaryDaily: foodSummaryDailyData ?? null,
              Posyandu: posyanduData ?? [],
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
