import { useState } from "react";
import { DailySummaryResponse, FoodIntakeResponse } from "@/types/res";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import FoodScanImageOverlay from "@/components/partial/food-image";
import FoodScanSummary from "@/components/partial/food-summary";
import FoodItemPopup from "@/components/partial/food-partial";
import MakroBarDaily from "../growth/macro-bar";

const FoodScanResult = ({
  data,
  onBack,
  dailySummary,
  isLoading,
  onSuccess,
}: {
  data: FoodIntakeResponse;
  dailySummary: DailySummaryResponse;
  onBack: () => void;
  isLoading: boolean;
  onSuccess: () => void;
}) => {
  if (isLoading) {
    return <div>loading...</div>;
  }
  const accuracy = Math.round(
    (data.items.reduce((s, i) => s + i.mlConfidence, 0) / data.items.length) *
      100,
  );

  const [selectedItem, setSelectedItem] = useState<
    FoodIntakeResponse["items"][number] | null
  >(null);

  return (
    <div className="w-full flex min-h-screen flex-col justify-start items-center p-2 space-y-1">
      <div className="w-full flex  items-center justify-start">
        <ChevronLeft className="cursor-pointer" onClick={onBack} size={28} />
        <h1 className="font-semibold text-lg">Hasil Scan</h1>
      </div>
      <div className="w-full">
        <FoodScanImageOverlay
          photoUrl={data.photoUrl ?? ""}
          items={data.items}
          onSelectItem={setSelectedItem}
        />
      </div>

      <div className="w-full space-y-2 ">
        <FoodScanSummary
          title={data.title}
          accuracy={accuracy}
          totals={data.totals}
          totalWeightGram={data.totalWeightGram}
        />

        <MakroBarDaily data={dailySummary} key={dailySummary.childId} />
      </div>

      <div className="  w-full">
        <Button className="w-full" onClick={onSuccess}>
          Selesai
        </Button>
      </div>

      <FoodItemPopup
        isOpen={!!selectedItem}
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
      />
    </div>
  );
};

export default FoodScanResult;
