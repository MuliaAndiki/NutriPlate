import { PosyanduRespone } from "@/types/res/posyandu.respone";
import Image from "next/image";

interface PosyanduSelectCardProps {
  res: PosyanduRespone;
}
const PosyanduSelectionCard: React.FC<PosyanduSelectCardProps> = ({ res }) => {
  return (
    <div className="w-full flex items-center space-x-2 ">
      <Image
        alt="avaPosyandu"
        src={res.avaUrl ? res.avaUrl : "/images/posyanduDummy.png"}
        width={40}
        height={40}
        className="object-cover aspect-square rounded-full"
      />
      <div className="w-full flex items-start flex-col">
        <h1 className="text-lg font-bold">{res.name}</h1>
        <p className="font-light">
          {res.district}.{res.village}.{res.subDistrict}
        </p>
      </div>
    </div>
  );
};

export default PosyanduSelectionCard;
