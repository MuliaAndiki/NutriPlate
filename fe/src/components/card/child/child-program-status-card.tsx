import { ProgramRegistrationDetailResponse } from "@/types/res";
import { StatusConfig } from "@/configs/component.config";
import { format } from "date-fns";

interface ProgramStatusCardProps {
  res: ProgramRegistrationDetailResponse;
}

const ProgramStatusCard: React.FC<ProgramStatusCardProps> = ({ res }) => {
  const status = StatusConfig[res.status];
  const programName = res.program?.name ?? "-";
  const childName = res.child?.fullName ?? "-";
  const posyanduName = res.posyandu?.name ?? "-";
  const startProgram = res.program?.startPrograms
    ? format(new Date(res.program.startPrograms), "dd MMM yyyy")
    : "-";
  const endProgram = res.program?.endPrograms
    ? format(new Date(res.program.endPrograms), "dd MMM yyyy")
    : "-";

  return (
    <div className="w-full border-2 rounded-xl p-3 space-y-2 bg-background">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold">{programName}</h3>
        <span className={`text-xs px-2 py-1 rounded-md border ${status.color}`}>
          {status.label}
        </span>
      </div>

      <p className="text-sm text-muted-foreground">
        Anak: <span className="font-medium">{childName}</span>
      </p>

      <p className="text-sm">
        Posyandu: <span className="font-medium">{posyanduName}</span>
      </p>

      <p className="text-xs text-muted-foreground">
        Periode: {startProgram} – {endProgram}
      </p>
    </div>
  );
};

export default ProgramStatusCard;
