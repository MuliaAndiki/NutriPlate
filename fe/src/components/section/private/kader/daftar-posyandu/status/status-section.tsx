import KaderRegisterCard from "@/components/card/kader/registerions-card";
import { ButtonWrapper } from "@/components/wrapper/ButtonWrapper";
import {
  statusKaderRegisterMap,
  statusKaderRegisterStyle,
  StatusRegisterionsKader,
} from "@/types/partial";
import { KaderRegistrationDetailResponse } from "@/types/res";
import { ChevronLeft } from "lucide-react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import StatusSectionSkeleton from "@/components/skeleton/private/kader/daftar-posyandu/status/status-section-skeleton";
import DataNotFound from "@/components/empty/data-not-found";
import EmptyCard from "@/components/fallback/empty-card";

interface StatusKaderSectionProps {
  namespace: {
    router: AppRouterInstance;
  };
  service: {
    query: {
      myRegister: KaderRegistrationDetailResponse[];
      isLoading: boolean;
    };
  };
  state: {
    value: StatusRegisterionsKader;
    onChange: (value: StatusRegisterionsKader) => void;
  };
}

const StatusKaderSection: React.FC<StatusKaderSectionProps> = ({
  namespace,
  service,
  state,
}) => {
  if (service.query.isLoading) {
    return <StatusSectionSkeleton />;
  }
  if (!service.query.myRegister) {
    return <DataNotFound />;
  }

  return (
    <section className="w-full min-h-screen flex flex-col p-3 space-y-3">
      <div className="flex items-center space-x-2">
        <ChevronLeft
          className="cursor-pointer"
          onClick={() => namespace.router.back()}
        />
        <h1 className="text-xl font-bold">Status Pendaftaran Kader</h1>
      </div>

      <div className="flex space-x-2 w-full justify-center pb-1">
        {(Object.keys(statusKaderRegisterMap) as StatusRegisterionsKader[]).map(
          (key) => (
            <ButtonWrapper
              key={key}
              onClick={() => state.onChange(key)}
              className={`px-3 py-1 rounded-full text-sm whitespace-nowrap border transition
              ${
                state.value === key
                  ? "bg-primary text-primary-foreground"
                  : "bg-background text-muted-foreground"
              }`}
            >
              {statusKaderRegisterMap[key]}
            </ButtonWrapper>
          ),
        )}
      </div>

      {service.query.myRegister.length === 0 ? (
        <EmptyCard message="Tidak ada data" />
      ) : (
        <div className="flex flex-col space-y-3">
          {service.query.myRegister.map((item) => (
            <KaderRegisterCard
              res={item}
              key={item.id}
              statusLabelMap={statusKaderRegisterMap}
              statusStyle={statusKaderRegisterStyle}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default StatusKaderSection;
