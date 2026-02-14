import { PosyanduRespone } from "@/types/res";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

interface PosyanduHomeCardProps {
  res: PosyanduRespone;
  onClick?: () => void;
}

const dayLabel = (day: number) => {
  const map: Record<number, string> = {
    1: "Senin",
    2: "Selasa",
    3: "Rabu",
    4: "Kamis",
    5: "Jumat",
    6: "Sabtu",
    7: "Minggu",
  };
  return map[day] ?? "-";
};

const PosyanduHomeCard: React.FC<PosyanduHomeCardProps> = ({
  res,
  onClick,
}) => {
  return (
    <div
      className="w-full flex items-center justify-between
                 bg-background border rounded-xl p-3
                 shadow-sm hover:bg-muted transition cursor-pointer"
    >
      <div className="flex items-center space-x-3">
        <Image
          src={res.avaUrl || "/images/posyanduDummy.png"}
          alt={res.name}
          width={48}
          height={48}
          className="rounded-full object-cover"
        />

        <div className="flex flex-col">
          <h2 className="font-bold text-sm">{res.name}</h2>
          <p className="text-xs text-muted-foreground">
            {res.village}, {res.subDistrict}, {res.district}
          </p>
          <p className="text-sm font-medium">
            Jadwal: Setiap hari {dayLabel(res.scheduleDay)}
          </p>
        </div>
      </div>

      <div
        className="w-8 h-8 rounded-full bg-primary
                      flex items-center justify-center text-background"
        onClick={onClick}
      >
        <ArrowRight size={16} />
      </div>
    </div>
  );
};

export default PosyanduHomeCard;
