import { Button } from "../ui/button";
import { ProgramRespon } from "@/types/res";
import Link from "next/link";

interface ProgramCardProps {
  res: ProgramRespon;
}
const ProgramCard: React.FC<ProgramCardProps> = ({ res }) => {
  return (
    <div className="w-full border rounded-2xl border-primary">
      <div className="w-full bg-primary/70 p-2 rounded-t-2xl ">
        <h1 className="text-lg font-bold">{res.name}</h1>
      </div>
      <div className="w-full bg-primary/20 p-2">
        <h1>{res.description}</h1>
      </div>
      <div className="w-full flex justify-between bg-primary/20 items-center p-2">
        <h1 className="flex-1">Batas Daftar: {res.durationDays}</h1>
        <Link href={`/parent/program/detail/${res.id}`}>
          <Button>Lihat Selengkapnya</Button>
        </Link>
      </div>
    </div>
  );
};

export default ProgramCard;
