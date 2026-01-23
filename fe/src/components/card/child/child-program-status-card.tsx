import { ProgramRegistrationDetailResponse } from "@/types/res";
import { StatusConfig } from "@/configs/component.config";
import { format } from "date-fns";

interface ProgramStatusCardProps {
  res: ProgramRegistrationDetailResponse;
}

const ProgramStatusCard: React.FC<ProgramStatusCardProps> = ({ res }) => {
  const status = StatusConfig[res.status];

  return (
    <div className="w-full border-2 rounded-xl p-3 space-y-2 bg-background">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold">{res.program!.name}</h3>
        <span className={`text-xs px-2 py-1 rounded-md border ${status.color}`}>
          {status.label}
        </span>
      </div>

      <p className="text-sm text-muted-foreground">
        Anak: <span className="font-medium">{res.child!.fullName}</span>
      </p>

      <p className="text-sm">
        Posyandu: <span className="font-medium">{res.posyandu!.name}</span>
      </p>

      <p className="text-xs text-muted-foreground">
        Periode: {format(new Date(res.program!.startPrograms!), "dd MMM yyyy")}{" "}
        – {format(new Date(res.program!.endPrograms!), "dd MMM yyyy")}
      </p>
    </div>
  );
};

export default ProgramStatusCard;
