import { ChevronLeft } from "lucide-react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import HistoryFood from "@/components/card/food/history-food";
import { FoodIntakeResponse } from "@/types/res";
import RiwayatAsupanGiziSectionSkeleton from "@/components/skeleton/private/parent/asupan-gizi/riwayat-asupan-gizi/riwayat-asupan-gizi-section-skeleton";
import EmptyCard from "@/components/fallback/empty-card";

interface RiwayatGiziSectionProps {
  namespace: {
    router: AppRouterInstance;
  };
  service: {
    query: {
      history: FoodIntakeResponse[];
      isLoading: boolean;
    };
  };
}
const RiwayatAsupanGiziHeroSection: React.FC<RiwayatGiziSectionProps> = ({
  namespace,
  service,
}) => {
  if (service.query.isLoading) {
    return <RiwayatAsupanGiziSectionSkeleton />;
  }
  return (
    <div className="w-full min-h-screen flex justify-start items-center flex-col space-y-2">
      <div className="w-full flex justify-start items-center  ">
        <ChevronLeft size={35} onClick={() => namespace.router.back()} />
        <h1 className="text-3xl text-start font-extrabold">
          Riwayat Asupan Gizi
        </h1>
      </div>
      <div className="w-full space-y-3 ">
        {service.query.history.length === 0 ? (
          <EmptyCard message="Belum ada riwayat asupan gizi" />
        ) : (
          service.query.history.map((items, key) => (
            <HistoryFood res={items} key={key} />
          ))
        )}
      </div>
    </div>
  );
};

export default RiwayatAsupanGiziHeroSection;
