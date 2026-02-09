import KaderRegisterPendingCard from "@/components/card/kader/registerions-pending-card";
import { ButtonWrapper } from "@/components/wrapper/ButtonWrapper";
import {
  statusKaderRegisterMap,
  statusKaderRegisterStyle,
  StatusRegisterionsKader,
} from "@/types/partial";
import StatusSectionSkeleton from "@/components/skeleton/private/posyandu/daftar-kader/status/status-section-skeleton";
import DataNotFound from "@/components/empty/data-not-found";
import { KaderRegistrationDetailResponse } from "@/types/res";
import { ChevronLeft } from "lucide-react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

interface StatusKaderSectionProps {
  namespace: {
    router: AppRouterInstance;
  };
  service: {
    query: {
      data: KaderRegistrationDetailResponse[];
      isLoading: boolean;
    };
    mutation: {
      onReject: () => void;
      onAccepted: () => void;
      isPending: boolean;
    };
  };
  state: {
    value: StatusRegisterionsKader;
    onChange: (value: StatusRegisterionsKader) => void;
    idRegister: string;
    setIdRegister: React.Dispatch<React.SetStateAction<string>>;
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
  return (
    <section className="w-full min-h-screen flex flex-col p-3 space-y-3">
      <div className="w-full flex items-center">
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

      {service.query.data.length === 0 ? (
        <DataNotFound />
      ) : (
        <div className="flex flex-col space-y-3">
          {service.query.data.map((item) => (
            <KaderRegisterPendingCard
              key={item.id}
              res={item}
              statusLabelMap={statusKaderRegisterMap}
              statusStyle={statusKaderRegisterStyle}
              idRegister={state.idRegister}
              setIdRegister={state.setIdRegister}
              isPending={service.mutation.isPending}
              onAccecp={service.mutation.onAccepted}
              onReject={service.mutation.onReject}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default StatusKaderSection;
