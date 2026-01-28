import { Button } from "@/components/ui/button";
import PopUp from "@/components/ui/pop-up";
import { FoodIntakeResponse } from "@/types/res";

interface FoodItemPopupProps {
  isOpen: boolean;
  item: FoodIntakeResponse["items"][number] | null;
  onClose: () => void;
}

const NutritionRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between text-sm">
    <span className="text-muted-foreground">{label}</span>
    <span>{value}</span>
  </div>
);

const FoodItemPopup: React.FC<FoodItemPopupProps> = ({
  isOpen,
  item,
  onClose,
}) => {
  if (!item) return null;

  return (
    <PopUp isOpen={isOpen} onClose={onClose}>
      <div className="space-y-3">
        <h2 className="text-lg font-semibold capitalize">
          {item.foodClassName}
        </h2>

        <NutritionRow label="Berat" value={`${item.weightGram} g`} />
        <NutritionRow label="Kalori" value={`${item.energyKcal ?? 0} kcal`} />
        <NutritionRow label="Protein" value={`${item.proteinGram ?? 0} g`} />
        <NutritionRow label="Karbohidrat" value={`${item.carbGram ?? 0} g`} />
        <NutritionRow label="Lemak" value={`${item.fatGram ?? 0} g`} />
        <NutritionRow
          label="Confidence"
          value={`${(item.mlConfidence * 100).toFixed(1)}%`}
        />

        <Button className="w-full mt-4" onClick={onClose}>
          Tutup
        </Button>
      </div>
    </PopUp>
  );
};

export default FoodItemPopup;
