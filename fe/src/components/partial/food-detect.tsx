import { FoodIntakeResponse } from "@/types/res";

interface FoodDetectedListProps {
  items: FoodIntakeResponse["items"];
}

const FoodDetectedList: React.FC<FoodDetectedListProps> = ({ items }) => {
  return (
    <div className="space-y-2">
      {items.map((item) => (
        <div
          key={item.id}
          className="border rounded-xl p-3 flex justify-between items-center"
        >
          <div>
            <p className="font-medium capitalize">{item.foodClassName}</p>
            <p className="text-xs text-muted-foreground">
              {item.weightGram} g • {(item.mlConfidence * 100).toFixed(1)}%
            </p>
          </div>
          <p className="text-sm font-semibold">{item.energyKcal ?? 0} kcal</p>
        </div>
      ))}
    </div>
  );
};

export default FoodDetectedList;
