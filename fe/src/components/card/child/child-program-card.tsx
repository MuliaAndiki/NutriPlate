import { ChildCardType } from "@/types/card";
import { Card } from "@/components/ui/card";
import Image from "next/image";

interface ChildProgramCard {
  childType: ChildCardType;
}
const ChildProgramCard: React.FC<ChildProgramCard> = ({ childType }) => {
  return (
    <Card className="w-full p-3">
      <div className="flex justify-start items-center space-x-1">
        <Image
          alt="image"
          src={
            childType.avaChild ? childType.avaChild : "/images/childDummy.png"
          }
          width={50}
          height={50}
          className="rounded-full aspect-square"
        />
        <div className="flex flex-col justify-start items-start">
          <h1 className="text-lg font-bold">{childType.fullName}</h1>
          <p className="text-sm font-light text-foreground/80 ">
            {/* Dummy Initial */}0 Program berjalan - 0 Program selesai
          </p>
        </div>
      </div>
    </Card>
  );
};

export default ChildProgramCard;
