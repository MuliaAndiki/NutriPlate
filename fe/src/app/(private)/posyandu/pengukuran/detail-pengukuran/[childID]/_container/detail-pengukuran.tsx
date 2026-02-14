"use client";
import DetailPengukuranSection from "@/components/section/private/posyandu/pengukuran/detail-pengukuran/detail-pengukuran-section";
import useService from "@/hooks/mutation/prop.service";
import { useAppNameSpace } from "@/hooks/useAppNameSpace";
import { FormCreateMeasurement } from "@/types/form";
import { useParams } from "next/navigation";
import { useState } from "react";

const DetailPengukuranContainer = () => {
  const namespace = useAppNameSpace();
  const { childID } = useParams<{ childID: string }>();
  const service = useService();

  //chldrem
  const childrenByIdQuery = service.user.query.childById(childID);
  const childrenByIdData = childrenByIdQuery.data?.data ?? null;

  const now: Date = new Date();

  //measuremnt
  const measurementQuery = service.measuremnt.query.measurement(childID);
  const measurementData = measurementQuery.data?.data ?? [];

  const isHaveMeasurement = measurementData.length > 0;
  const lastMeasurement = isHaveMeasurement
    ? measurementData[measurementData.length - 1]
    : null;

  //mutation
  const measurementMutation = service.measuremnt.mutation.createMeasuremnt();
  const updateMeasuremntMutation =
    service.measuremnt.mutation.updateMeasuremnet();

  //state
  const [formCreateMeasuremnt, setFormCreateMeasuremnt] =
    useState<FormCreateMeasurement>({
      headCircumferenceCm: 0,
      heightCm: 0,
      note: "",
      measurementDate: now,
      weightKg: 0,
    });

  //handler

  const handleMeasurement = () => {
    if (!childID) return;

    if (measurementData.length === 0) {
      measurementMutation.mutate(
        {
          id: childID,
          payload: formCreateMeasuremnt,
        },
        {
          onSuccess: () => {
            namespace.router.back();
          },
        },
      );
    } else {
      updateMeasuremntMutation.mutate(
        {
          id: lastMeasurement.id,
          payload: formCreateMeasuremnt,
        },
        {
          onSuccess: () => {
            namespace.router.back();
          },
        },
      );
    }
  };

  return (
    <main className="w-full min-h-screen">
      <DetailPengukuranSection
        namespace={{
          router: namespace.router,
          alert: namespace.alert,
        }}
        service={{
          query: {
            isLoading:
              childrenByIdQuery.isLoading || measurementQuery.isLoading,
            children: childrenByIdData ?? null,
            historyMeasument: measurementData ?? [],
          },
          mutation: {
            isPending: measurementMutation.isPending,
            onMutate: handleMeasurement,
          },
        }}
        state={{
          formCreateMeasuremnt: formCreateMeasuremnt,
          setFormCreateMeasuremnt: setFormCreateMeasuremnt,
          isEdit: measurementData.length > 0,
        }}
      />
    </main>
  );
};

export default DetailPengukuranContainer;
