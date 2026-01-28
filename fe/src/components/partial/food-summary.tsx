import { FoodIntakeResponse } from "@/types/res";
import { kebabCaseToWords } from "@/utils/string.format";
import { Icon } from "@iconify/react/dist/iconify.js";

interface FoodScanSummaryProps {
  title?: string;
  accuracy: number;
  totals: FoodIntakeResponse["totals"];
  totalWeightGram: number;
}

const NutritionRow = ({
  label,
  value,
  bold,
}: {
  label: string;
  value: string;
  bold?: boolean;
}) => (
  <div className="flex justify-between text-sm">
    <span className="text-muted-foreground">{label}</span>
    <span className={bold ? "font-semibold" : ""}>{value}</span>
  </div>
);

const FoodScanSummary: React.FC<FoodScanSummaryProps> = ({
  title,
  accuracy,
  totals,
  totalWeightGram,
}) => {
  return (
    <div className="w-full  rounded-lg border">
      <div className="w-full p-4 bg-primary rounded-t-lg">
        <div className="w-full flex items-center">
          <Icon
            icon="tdesign:rice"
            width="24"
            height="24"
            className="text-background"
          />
          <h1 className="font-semibold text-background text-2xl">
            Kandungan Gizi
          </h1>
        </div>
      </div>
      <div className="w-full p-4">
        <div className="w-full flex justify-center">
          <h1 className="text-lg font-bold">{kebabCaseToWords(title!)}</h1>
        </div>
        <NutritionRow label="Akurasi" value={`${accuracy}%`} />
        <NutritionRow label="Kalori" value={`${totals.energyKcal} kcal`} />
        <NutritionRow label="Protein" value={`${totals.proteinGram} g`} />
        <NutritionRow label="Karbohidrat" value={`${totals.carbGram} g`} />
        <NutritionRow label="Lemak" value={`${totals.fatGram} g`} />
        <NutritionRow label="Berat Total" value={`${totalWeightGram} g`} bold />
      </div>
    </div>
  );
};

export default FoodScanSummary;
