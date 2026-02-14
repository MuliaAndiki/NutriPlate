import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { FoodIntakeResponse } from "@/types/res";
import { formatDateTime } from "@/utils/time.format";

interface HistoryFoodProps {
  res: FoodIntakeResponse;
}

const HistoryFood: React.FC<HistoryFoodProps> = ({ res }) => {
  return (
    <Card className="w-full p-4">
      <Link href={`/parent/asupan-gizi/detail/${res.id}`}>
        <div className="w-full flex justify-start items-start space-x-2">
          <Image
            alt="food dumy"
            src={res.photoUrl ? res.photoUrl : "/images/food.png"}
            width={100}
            height={100}
            className="aspect-square rounded-lg"
          />
          <div className="w-full flex justify-start flex-col space-y-2">
            <div className="w-full ">
              <span className="font-extralight">
                {formatDateTime(res.createdAt, { style: "day-date-slash" })}
              </span>
              <h1 className="text-lg font-bold">{res.title}</h1>
            </div>
            <div className="w-full ">
              <span className="">Berat : {res.totalWeightGram} gram</span>
              {/* <h1 className=" ">Kadar Energy : {res.}</h1> */}
            </div>
          </div>
        </div>
      </Link>
    </Card>
  );
};

export default HistoryFood;
