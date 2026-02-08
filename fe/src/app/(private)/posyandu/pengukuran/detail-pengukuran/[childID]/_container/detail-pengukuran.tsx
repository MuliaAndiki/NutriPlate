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

  //measuremnt
  const measurementQuery = service.measuremnt.query.measurement(childID);
  const measurementData = measurementQuery.data?.data ?? [];

  //mutation
  const measurementMutation = service.measuremnt.mutation.createMeasuremnt();

  //state
  const [formCreateMeasuremnt, setFormCreateMeasuremnt] =
    useState<FormCreateMeasurement>({
      headCircumferenceCm: 0,
      heightCm: 0,
      note: "",
      measurementDate: "",
      weightKg: 0,
    });

  //handler not fix
  const handleCreateMeasuremtn = () => {
    if (!childID || !formCreateMeasuremnt) return null;

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
            onCreate: handleCreateMeasuremtn,
          },
        }}
        state={{
          formCreateMeasuremnt: formCreateMeasuremnt,
          setFormCreateMeasuremnt: setFormCreateMeasuremnt,
        }}
      />
    </main>
  );
};

export default DetailPengukuranContainer;
