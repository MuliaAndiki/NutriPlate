import { PosyanduRespone } from "@/types/res";
import Image from "next/image";
import { Calendar, MapPin } from "lucide-react";
import Link from "next/link";

interface PosyanduCardProps {
  data: PosyanduRespone;
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

const PosyanduCard: React.FC<PosyanduCardProps> = ({ data }) => {
  return (
    <Link
      href={`/kader/daftar-posyandu/detail/${data.id}`}
      className="w-full border rounded-xl p-4 space-y-2 hover:bg-muted transition"
    >
      <div className="flex items-center space-x-3">
        <Image
          src={data.avaUrl || "/images/posyanduDummy.png"}
          alt={data.name}
          width={48}
          height={48}
          className="rounded-full object-cover"
        />
        <div>
          <h2 className="font-bold">{data.name}</h2>
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="w-3 h-3 mr-1" />
            {data.district}, {data.village}
          </div>
        </div>
      </div>

      <div className="flex items-center text-sm">
        <Calendar className="w-4 h-4 mr-2 text-muted-foreground" />
        {dayLabel(data.scheduleDay)}
      </div>
    </Link>
  );
};

export default PosyanduCard;
