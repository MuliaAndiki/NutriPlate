import { DailySummaryResponse, FoodIntakeResponse } from "@/types/res";
import { ChevronLeft } from "lucide-react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useState } from "react";
import FoodScanImageOverlay from "@/components/partial/food-image";
import FoodScanSummary from "@/components/partial/food-summary";
import FoodDetectedList from "@/components/partial/food-detect";
import FoodItemPopup from "@/components/partial/food-partial";
import MakroBarDaily from "@/components/card/growth/macro-bar";

interface DetailGiziHeroProps {
  namespace: {
    router: AppRouterInstance;
  };
  service: {
    query: {
      food: FoodIntakeResponse;
      isLoading: boolean;
    };
  };
}
const DetailGiziHeroSection: React.FC<DetailGiziHeroProps> = ({
  namespace,
  service,
}) => {
  if (service.query.isLoading) {
    return <div>loading..</div>;
  }
  const accuracy = Math.round(
    (service.query.food.items.reduce((s, i) => s + i.mlConfidence, 0) /
      service.query.food.items.length) *
      100,
  );

  const [selectedItem, setSelectedItem] = useState<
    FoodIntakeResponse["items"][number] | null
  >(null);

  return (
    <div className="w-full flex min-h-screen flex-col justify-start items-center p-2 space-y-2 ">
      <div className="w-full flex  items-center justify-start">
        <ChevronLeft size={35} onClick={() => namespace.router.back()} />
        <h1 className="text-2xl font-extrabold">
          Detail Gizi + {service.query.food.title}
        </h1>
      </div>
      <div className="w-full">
        <FoodScanImageOverlay
          photoUrl={service.query.food.photoUrl ?? ""}
          items={service.query.food.items}
          onSelectItem={setSelectedItem}
        />
      </div>

      <div className="w-full space-y-2">
        <FoodScanSummary
          title={service.query.food.title}
          accuracy={accuracy}
          totals={service.query.food.totals}
          totalWeightGram={service.query.food.totalWeightGram}
        />
      </div>

      <FoodItemPopup
        isOpen={!!selectedItem}
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
      />
    </div>
  );
};

export default DetailGiziHeroSection;
