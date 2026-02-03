import { ParentListResponse } from "@/types/res";
import Image from "next/image";
import { Button } from "@/components/ui/button";

interface ParentCardListProps {
  index: number;
  data: ParentListResponse;
  onClick?: () => void;
}

const ParentCardList: React.FC<ParentCardListProps> = ({
  index,
  data,
  onClick,
}) => {
  return (
    <div className="w-full flex items-center justify-between bg-background border rounded-xl p-3">
      <div className="flex items-center space-x-3">
        <div className="w-6 h-6 rounded-md bg-primary/50 text-background text-xs flex items-center justify-center font-bold">
          {index + 1}
        </div>

        <Image
          src={data.avaUrl || "/avatars/1.png"}
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

      <Button
        size="sm"
        className="rounded-full text-xs px-3"
        onClick={() => onClick!()}
      >
        Lihat Detail
      </Button>
    </div>
  );
};

export default ParentCardList;
