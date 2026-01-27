"use client";

import { useState } from "react";
import { FoodIntakeResponse } from "@/types/res";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import PopUp from "@/components/ui/pop-up";

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

const FoodScanResult = ({
  data,
  onBack,
}: {
  data: FoodIntakeResponse;
  onBack: () => void;
}) => {
  const accuracy = Math.round(
    (data.items.reduce((s, i) => s + i.mlConfidence, 0) / data.items.length) *
      100,
  );

  const imageSize = data.items[0]?.bboxData?.imageSize;

  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const openPopup = (item: any) => {
    setSelectedItem(item);
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
    setSelectedItem(null);
  };

  return (
    <div className="w-screen h-screen fixed inset-0 bg-background flex flex-col">
      <div className="flex items-center gap-3 p-4 border-b">
        <ChevronLeft className="cursor-pointer" onClick={onBack} size={28} />
        <h1 className="font-semibold text-lg">Hasil Scan</h1>
      </div>

      <div className="p-4">
        <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden">
          <Image
            src={data.photoUrl || ""}
            alt="Food"
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />

          {imageSize &&
            data.items.map((item) => {
              const box = item.bboxData?.pixel;
              if (!box) return null;

              return (
                <div
                  key={item.id}
                  onClick={() => openPopup(item)}
                  className="absolute border-2 border-emerald-400 rounded-md cursor-pointer hover:border-emerald-600 transition"
                  style={{
                    left: `${(box.x1 / imageSize.width) * 100}%`,
                    top: `${(box.y1 / imageSize.height) * 100}%`,
                    width: `${(box.width / imageSize.width) * 100}%`,
                    height: `${(box.height / imageSize.height) * 100}%`,
                  }}
                >
                  <div className="absolute -top-5 left-0 bg-emerald-500 text-white text-[10px] px-1 rounded">
                    {item.foodClassName}
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      <div className="flex-1 px-4 space-y-4 overflow-auto">
        <div className="bg-primary text-primary-foreground rounded-xl p-4">
          <h2 className="font-semibold mb-1">
            {data.title || "Hasil Deteksi Makanan"}
          </h2>
          <p className="text-sm opacity-90">Akurasi {accuracy}%</p>
        </div>

        <div className="bg-card border rounded-xl p-4 space-y-2">
          <h3 className="font-semibold">Kandungan Gizi</h3>

          <NutritionRow
            label="Kalori"
            value={`${data.totals.energyKcal} kcal`}
          />
          <NutritionRow
            label="Protein"
            value={`${data.totals.proteinGram} g`}
          />
          <NutritionRow
            label="Karbohidrat"
            value={`${data.totals.carbGram} g`}
          />
          <NutritionRow label="Lemak" value={`${data.totals.fatGram} g`} />
          <NutritionRow
            label="Berat Total"
            value={`${data.totalWeightGram} g`}
            bold
          />
        </div>

        <div className="space-y-2">
          <h3 className="font-semibold">Item Terdeteksi</h3>

          {data.items.map((item) => (
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
              <p className="text-sm font-semibold">
                {item.energyKcal ?? 0} kcal
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="p-4 border-t">
        <Button className="w-full" onClick={onBack}>
          Selesai
        </Button>
      </div>

      <PopUp isOpen={isPopupOpen} onClose={closePopup}>
        {selectedItem && (
          <div className="space-y-3">
            <h2 className="text-lg font-semibold capitalize">
              {selectedItem.foodClassName}
            </h2>

            <NutritionRow
              label="Berat"
              value={`${selectedItem.weightGram} g`}
            />
            <NutritionRow
              label="Kalori"
              value={`${selectedItem.energyKcal ?? 0} kcal`}
            />
            <NutritionRow
              label="Protein"
              value={`${selectedItem.proteinGram ?? 0} g`}
            />
            <NutritionRow
              label="Karbohidrat"
              value={`${selectedItem.carbGram ?? 0} g`}
            />
            <NutritionRow
              label="Lemak"
              value={`${selectedItem.fatGram ?? 0} g`}
            />
            <NutritionRow
              label="Confidence"
              value={`${(selectedItem.mlConfidence * 100).toFixed(1)}%`}
            />

            <Button className="w-full mt-4" onClick={closePopup}>
              Tutup
            </Button>
          </div>
        )}
      </PopUp>
    </div>
  );
};

export default FoodScanResult;
