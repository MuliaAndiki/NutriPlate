import DataNotFound from "@/components/empty/data-not-found";
import EmptyCard from "@/components/fallback/empty-card";
import StatusSectionSkeleton from "@/components/skeleton/private/parent/program/status/status-section-skeleton";
import ProgramStatusCard from "@/components/card/child/child-program-status-card";
import { Button } from "@/components/ui/button";
import { ButtonWrapper } from "@/components/wrapper/ButtonWrapper";
import { RegistrationStatus } from "@/types/partial";
import { ProgramRegistrationDetailResponse } from "@/types/res";
import { ChevronLeft } from "lucide-react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

interface StatusChildInProgramSectionProps {
  namespace: {
    router: AppRouterInstance;
  };
  service: {
    query: {
      registerChild: ProgramRegistrationDetailResponse[];
      isLoading: boolean;
    };
    mutation: {
      onAccept: (id: string) => void;
      onReject: (id: string) => void;
      isPending: boolean;
    };
  };
  state: {
    value: "all" | RegistrationStatus;
    onChange: (value: "all" | RegistrationStatus) => void;
    selectedId: string | null;
    onSelect: (id: string | null) => void;
  };
}
const StatusChildInProgramSection: React.FC<
  StatusChildInProgramSectionProps
> = ({ service, namespace, state }) => {
  const resRegisterChild = service.query.registerChild;

  if (service.query.isLoading) {
    return <StatusSectionSkeleton />;
  }
  if (!resRegisterChild) {
    return <DataNotFound />;
  }
  return (
    <section className="w-full min-h-screen flex flex-col p-2 space-y-3">
      <div className="w-full flex items-center space-x-2">
        <ChevronLeft
          className="cursor-pointer"
          onClick={() => namespace.router.back()}
          width={28}
          height={28}
        />
        <h1 className="text-2xl font-bold">Status Program</h1>
      </div>

      <div className="w-full grid grid-cols-4 grid-rows-1 border-y gap-1 py-3">
        <Button
          className="w-full"
          variant={state.value === "all" ? "notLinter" : "linter"}
          onClick={() => state.onChange("all")}
        >
          Semua
        </Button>
        <Button
          className="w-full"
          variant={state.value === "pending" ? "notLinter" : "linter"}
          onClick={() => state.onChange("pending")}
        >
          Pending
        </Button>
        <Button
          className="w-full"
          variant={state.value === "accepted" ? "notLinter" : "linter"}
          onClick={() => state.onChange("accepted")}
        >
          Diterima
        </Button>
        <Button
          className="w-full"
          variant={state.value === "rejected" ? "notLinter" : "linter"}
          onClick={() => state.onChange("rejected")}
        >
          Ditolak
        </Button>
      </div>

      {resRegisterChild.length === 0 ? (
        <EmptyCard message="Tidak ada data" />
      ) : (
        <div className="w-full space-y-2">
          {resRegisterChild.map((item) => {
            const isSelected = state.selectedId === item.id;
            return (
              <div
                key={item.id}
                className="w-full space-y-2"
                onClick={() =>
                  state.onSelect(isSelected ? null : item.id)
                }
              >
                <ProgramStatusCard res={item} />
                {isSelected && item.status === "pending" && (
                  <div className="w-full grid grid-cols-2 gap-2">
                    <ButtonWrapper
                      className="w-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        service.mutation.onAccept(item.id);
                      }}
                      disabled={service.mutation.isPending}
                    >
                      Terima
                    </ButtonWrapper>
                    <ButtonWrapper
                      className="w-full"
                      variant={"destructive"}
                      onClick={(e) => {
                        e.stopPropagation();
                        service.mutation.onReject(item.id);
                      }}
                      disabled={service.mutation.isPending}
                    >
                      Tolak
                    </ButtonWrapper>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default StatusChildInProgramSection;
