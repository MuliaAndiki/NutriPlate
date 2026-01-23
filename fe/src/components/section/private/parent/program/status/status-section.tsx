import { ProgramRegistrationDetailResponse } from "@/types/res";
import { ChevronLeft } from "lucide-react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useState } from "react";
import ProgramStatusCard from "@/components/card/child/child-program-status-card";
import { Button } from "@/components/ui/button";
import { RegistrationStatus } from "@/types/partial";

interface StatusProgramSectionProps {
  namespace: {
    router: AppRouterInstance;
  };
  service: {
    query: {
      statusChild: ProgramRegistrationDetailResponse[];
      isLoading: boolean;
    };
  };
}

const StatusProgramSection: React.FC<StatusProgramSectionProps> = ({
  namespace,
  service,
}) => {
  const [filter, setFilter] = useState<"all" | RegistrationStatus>("all");

  const filteredData =
    filter === "all"
      ? service.query.statusChild
      : service.query.statusChild.filter((item) => item.status === filter);

  if (service.query.isLoading) {
    return <div>loading...</div>;
  }

  return (
    <section className="w-full min-h-screen flex flex-col p-2 space-y-3">
      <div className="w-full flex items-center space-x-2">
        <ChevronLeft
          onClick={() => namespace.router.back()}
          className="cursor-pointer"
          width={28}
          height={28}
        />
        <h1 className="text-2xl font-bold">Status Program</h1>
      </div>

      <div className="w-full grid grid-cols-4 grid-rows-1 border-y gap-1 py-3">
        <Button
          className="w-full"
          variant={filter === "all" ? "notLinter" : "linter"}
          onClick={() => setFilter("all")}
        >
          Semua
        </Button>
        <Button
          className="w-full"
          variant={filter === "pending" ? "notLinter" : "linter"}
          onClick={() => setFilter("pending")}
        >
          Pending
        </Button>
        <Button
          className="w-full"
          variant={filter === "accepted" ? "notLinter" : "linter"}
          onClick={() => setFilter("accepted")}
        >
          Diterima
        </Button>
        <Button
          className="w-full"
          variant={filter === "rejected" ? "notLinter" : "linter"}
          onClick={() => setFilter("rejected")}
        >
          Ditolak
        </Button>
      </div>

      <div className="w-full space-y-2">
        {filteredData.length === 0 ? (
          <p className="text-center text-muted-foreground text-sm">
            Tidak ada data
          </p>
        ) : (
          filteredData.map((item) => (
            <ProgramStatusCard key={item.id} res={item} />
          ))
        )}
      </div>
    </section>
  );
};

export default StatusProgramSection;
