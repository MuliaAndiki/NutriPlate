"use client";
import HistoryLoginSection from "@/components/section/general/history-login/history-login";
import useService from "@/hooks/mutation/prop.service";
import { useAppNameSpace } from "@/hooks/useAppNameSpace";
import { useDebugLog } from "@/utils/useDebug";

const HistoryLoginContainer = () => {
  const namespace = useAppNameSpace();
  const service = useService();

  //current sesstion
  const currentSesstionQuery = service.session.query.getCurrent();
  const currentSesstionData = currentSesstionQuery.data?.data ?? null;

  //all curent
  const currentAllQuery = service.session.query.getAll();
  const currentAllData = currentAllQuery.data?.data ?? [];

  return (
    <main className="w-full min-h-screen">
      <HistoryLoginSection
        namespace={{
          router: namespace.router,
        }}
        service={{
          query: {
            isLoading:
              currentSesstionQuery.isLoading || currentAllQuery.isLoading,
            sessionCurent: currentSesstionData ?? null,
            sessionAll: currentAllData ?? [],
          },
        }}
      />
    </main>
  );
};
export default HistoryLoginContainer;
