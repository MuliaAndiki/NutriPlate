import Image from "next/image";
import Link from "next/link";

interface FoodDetectionProps {
  length: number;
}
const FoodDetection: React.FC<FoodDetectionProps> = ({ length }) => {
  return (
    <Link
      className="w-full p-2 rounded-lg border border-destructive bg-destructive/40 flex items-center space-x-1"
      href={{
        pathname: "/detection-food",
      }}
    >
      <Image
        alt="baby"
        src={"/images/food.png"}
        width={60}
        height={60}
        className="object-cover"
      />
      <div className="w-full flex items-start flex-col">
        <h1 className="text-sm font-bold">Terdeteksi</h1>
        <p className="text-xl font-bold">
          {length}
          <span className="font-light text-sm">Makanan</span>
        </p>
      </div>
    </Link>
  );
};

export default FoodDetection;
