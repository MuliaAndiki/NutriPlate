import { ChevronLeft } from "lucide-react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import HistoryFood from "@/components/card/food/history-food";
import { HistoryFoodType } from "@/types/card";

interface RiwayatGiziSectionProps {
  router: AppRouterInstance;
  historyFoodData: HistoryFoodType[];
}
const RiwayatAsupanGiziHeroSection: React.FC<RiwayatGiziSectionProps> = ({
  router,
  historyFoodData,
}) => {
  return (
    <div className="w-full min-h-screen flex justify-start items-center flex-col space-y-2">
      <div className="w-full flex justify-start items-center  ">
        <ChevronLeft size={35} onClick={() => router.back()} />
        <h1 className="text-3xl text-start font-extrabold">
          Riwayat Asupan Gizi
        </h1>
      </div>
      <div className="w-full space-y-3 ">
        {historyFoodData.map((items, key) => (
          <HistoryFood data={items} key={key} />
        ))}
      </div>
    </div>
  );
};

export default RiwayatAsupanGiziHeroSection;
