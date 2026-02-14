import Image from "next/image";
import { FoodIntakeResponse } from "@/types/res";

interface FoodScanImageOverlayProps {
  photoUrl?: string;
  items: FoodIntakeResponse["items"];
  onSelectItem: (item: FoodIntakeResponse["items"][number]) => void;
}

const FoodScanImageOverlay: React.FC<FoodScanImageOverlayProps> = ({
  photoUrl,
  items,
  onSelectItem,
}) => {
  const imageSize = items[0]?.bboxData?.imageSize;

  return (
    <div className="">
      <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden">
        <Image
          src={photoUrl || ""}
          alt="Food"
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />

        {imageSize &&
          items.map((item) => {
            const box = item.bboxData?.pixel;
            if (!box) return null;

            return (
              <div
                key={item.id}
                onClick={() => onSelectItem(item)}
                className="absolute border-2 border-primary rounded-md cursor-pointer hover:border-emerald-600 transition"
                style={{
                  left: `${(box.x1 / imageSize.width) * 100}%`,
                  top: `${(box.y1 / imageSize.height) * 100}%`,
                  width: `${(box.width / imageSize.width) * 100}%`,
                  height: `${(box.height / imageSize.height) * 100}%`,
                }}
              >
                <div className="absolute -top-5 left-0 bg-primary text-white text-[10px] px-1 rounded">
                  {item.foodClassName}
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default FoodScanImageOverlay;
