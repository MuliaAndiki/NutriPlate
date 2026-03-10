import { Button } from "@/components/ui/button";
import { ProgramRespone } from "@/types/res/program-with-progres";
import { formatDateTime } from "@/utils/time.format";
interface ProgramCardProps {
  res: ProgramRespone;
  onClick: () => void;
  role: string;
}
const ProgramCard: React.FC<ProgramCardProps> = ({ res, onClick, role }) => {
  return (
    <div className="w-full border rounded-2xl border-primary">
      <div className="w-full bg-primary/70 p-2 rounded-t-2xl ">
        <h1 className="text-lg font-bold">{res.name}</h1>
      </div>
      <div className="w-full bg-primary/20 p-2">
        <h1>{res.description}</h1>
      </div>
      <div className="w-full flex  bg-primary/20 flex-col items-start p-2">
        <h1 className="flex-1">
          Batas Daftar:{" "}
          {res.durationRegister
            ? formatDateTime(res.durationRegister, { style: "day-date-slash" })
            : "-"}
        </h1>
        <div className="w-full flex items-center justify-between">
          {role === "PARENT" ? (
            <h1 className="text-info">
              Diikuti Oleh:{" "}
              {res.progress.length > 0
                ? res.progress.map((p) => p.child?.fullName).join(", ")
                : "-"}
            </h1>
          ) : (
            <h1 className="text-info">
              Diikuti Oleh:{res.progress.length} Balita
            </h1>
          )}

          <Button onClick={() => onClick()}>Lihat Selengkapnya</Button>
        </div>
      </div>
    </div>
  );
};

export default ProgramCard;
