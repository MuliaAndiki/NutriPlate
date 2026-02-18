import SessionCard from "@/components/card/session/session-card";
import DataNotFound from "@/components/empty/data-not-found";
import SectionSkeleton from "@/components/skeleton/section-skeleton";
import { IUserSession } from "@/types/schema/userSession.schema";
import { Icon } from "@iconify/react/dist/iconify.js";
import { ChevronLeft } from "lucide-react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

interface HistoryLoginSectionProps {
  namespace: {
    router: AppRouterInstance;
  };
  service: {
    query: {
      isLoading: boolean;
      sessionCurent: IUserSession;
      sessionAll: IUserSession[];
    };
  };
}
const HistoryLoginSection: React.FC<HistoryLoginSectionProps> = ({
  namespace,
  service,
}) => {
  const resCurent = service.query.sessionCurent;
  const resAll = service.query.sessionAll;

  if (!resCurent || !resAll) {
    return <DataNotFound />;
  }
  if (service.query.isLoading) {
    return <SectionSkeleton />;
  }
  const sliceAgent = resCurent.userAgent?.slice(0, 35);

  return (
    <section className="w-full flex items-center flex-col justify-start min-h-screen overflow-x-hidden p-2 space-y-3  ">
      <div className="w-full flex items-center">
        <ChevronLeft
          className="cursor-pointer"
          onClick={() => namespace.router.back()}
        />
        <h1 className="font-bold">Riwayat Login</h1>
      </div>
      <div className="w-full flex items-center">
        <Icon
          icon="fluent:phone-16-regular"
          width="26"
          height="26"
          className="text-primary"
        />
        <h1 className="font-bold">Perangkat Aktif</h1>
      </div>
      <SessionCard agent={sliceAgent} res={resCurent} key={resCurent.id} />

      <div className="w-full flex items-center">
        <Icon
          icon="material-symbols:history-rounded"
          width="24"
          height="24"
          className="text-primary"
        />
        <h1 className="font-bold">Riwayat Login</h1>
      </div>
      {resAll.map((items) => {
        const resAgent = items.userAgent.slice(0, 35);
        return <SessionCard res={items} key={items.id} agent={resAgent} />;
      })}
    </section>
  );
};

export default HistoryLoginSection;
