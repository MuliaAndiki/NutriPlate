import { ParentListResponse } from "@/types/res";
import Image from "next/image";
import { Button } from "@/components/ui/button";

interface ParentCardProps {
  index: number;
  data: ParentListResponse;
}

const ParentCard: React.FC<ParentCardProps> = ({ index, data }) => {
  return (
    <div className="w-full flex items-center justify-between bg-background border rounded-xl p-3">
      <div className="flex items-center space-x-3">
        <div className="w-6 h-6 rounded-md bg-primary/50 text-background text-xs flex items-center justify-center font-bold">
          {index + 1}
        </div>

        <Image
          src={data.avaUrl || "/images/avatarDummy.png"}
          alt={data.fullName}
          width={40}
          height={40}
          className="rounded-full object-cover"
        />

        <div className="flex flex-col">
          <p className="font-semibold text-sm">{data.fullName}</p>
          <p className="text-xs text-muted-foreground">{data.email}</p>
        </div>
      </div>

      <Button size="sm" className="rounded-full text-xs px-3">
        Lihat Detail
      </Button>
    </div>
  );
};

export default ParentCard;
