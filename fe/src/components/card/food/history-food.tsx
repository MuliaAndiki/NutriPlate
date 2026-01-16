import Image from "next/image";
import Link from "next/link";

import { HistoryFootProps } from "@/types/props.type";

import { Card } from "@/components/ui/card";

const HistoryFood: React.FC<HistoryFootProps> = ({ data }) => {
  return (
    <Card className="w-full p-4">
      <Link href={`/parent/asupan-gizi/detail/${data.id}`}>
        <div className="w-full flex justify-start items-start space-x-2">
          <Image
            alt="food dumy"
            src={data.image}
            width={100}
            height={100}
            className="aspect-square rounded-lg"
          />
          <div className="w-full flex justify-start flex-col space-y-2">
            <div className="w-full ">
              <span className="font-extralight">{data.date}</span>
              <h1 className="text-lg font-bold">{data.title}</h1>
            </div>
            <div className="w-full ">
              <span className="">Berat : {data.weight} gram</span>
              <h1 className=" ">Kadar Gizi : {data.gizi}</h1>
            </div>
          </div>
        </div>
      </Link>
    </Card>
  );
};

export default HistoryFood;
