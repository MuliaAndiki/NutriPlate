"use client";

import DetailAnakKaderSection from "@/components/section/private/kader/daftar-balita/detail-anak/detail-anak-section";
import { useAppSelector } from "@/hooks/dispatch/dispatch";
import useService from "@/hooks/mutation/prop.service";
import { useAppNameSpace } from "@/hooks/useAppNameSpace";
import { useParams } from "next/navigation";

const DetailAnakKaderContainer = () => {
  const namespace = useAppNameSpace();
  const service = useService();
  const { childrenID } = useParams<{ childrenID: string }>();
  const selector = useAppSelector((state) => state.posyandu);

  const childQueryByID = service.user.query.childById(childrenID);
  const chilDataByID = childQueryByID.data?.data ?? null;

  //measurement
  const measurementQuery = service.measuremnt.query.measurement(childrenID);
  const measurementData = measurementQuery.data?.data ?? [];

  // food Summary Daily
  const foodSummaryDailyQuery =
    service.foodSummary.query.foodSummaryDaily(childrenID);
  const foodSummaryDailyData = foodSummaryDailyQuery.data?.data ?? null;

  //posyandu
  const posyanduByIdQuery = service.posyandu.query.getPosyanduById(
    selector.posyanduId!,
  );
  const posyanduByIdData = posyanduByIdQuery.data?.data ?? null;

  //segment
  const segments = namespace.pathname.split("/");
  const section = segments[2];
  return (
    <main className="w-full min-h-screen">
      <DetailAnakKaderSection
        namespace={{
          router: namespace.router,
        }}
        service={{
          query: {
            isLoading:
              childQueryByID.isLoading ||
              measurementQuery.isLoading ||
              foodSummaryDailyQuery.isLoading,
            ChildCard: chilDataByID,
            foodSummaryDaily: foodSummaryDailyData,
            Measuremnt: measurementData,
            posyanduById: posyanduByIdData,
          },
        }}
        state={{
          role: selector.role!,
          section: section,
        }}
      />
    </main>
  );
};

export default DetailAnakKaderContainer;
