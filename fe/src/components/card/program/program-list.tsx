import { ProgresRespone } from "@/types/res";
import { ProgressBar } from "../linebar/linebar";
import Link from "next/link";

import { formatDateTime } from "@/utils/time.format";
import { formatDayProgress } from "@/utils/formatDayProgress";

interface ProgresListCard {
  res: ProgresRespone;
  pathname?: string;
  childId: string;
}

const ProgresListCard: React.FC<ProgresListCard> = ({
  res,
  pathname,
  childId,
}) => {
  const isDone = res.isCompleted ?? (res as any).isComplated;
  const headerBg = isDone ? "bg-info" : "bg-primary";
  const hiddenRoutes = [
    `/parent/program/progres/${res.childId}/detail/${res.id}`,
  ];
  const isHiddenLink = hiddenRoutes.includes(pathname!);

  const CardContent = (
    <div className="w-full flex flex-col rounded-lg border overflow-hidden">
      <div className={`w-full p-3 ${headerBg}`}>
        <h1 className="text-background text-lg font-bold">
          {res.program?.name ?? "-"}
        </h1>
      </div>

      <div className="w-full flex flex-col gap-1 p-3">
        <p className="text-sm text-muted-foreground">
          Mulai Program:{" "}
          <span className="font-medium">
            {formatDateTime(res.program.startPrograms!, {
              style: "day-date-slash",
            })}
          </span>
        </p>
        <p className="text-xs text-muted-foreground">
          {formatDayProgress(
            res.program.startPrograms!,
            res.program.endPrograms!,
          )}
        </p>
      </div>

      <div className="w-full px-3 pb-3">
        <ProgressBar
          label={`Sisa Task ${res.progressSummary.remainingTask}`}
          value={res.progressSummary.percentage}
          target={100}
          unit="%"
          color={isDone ? "bg-info" : "bg-emerald-500"}
        />
      </div>
      {isHiddenLink && (
        <div className="w-full border-t px-3 py-2">
          <input
            type="checkbox"
            id={`toggle-${res.id}`}
            className="peer hidden"
          />

          <div className="max-h-0 overflow-hidden transition-all duration-300 peer-checked:max-h-40">
            <div className="pt-2 text-sm text-muted-foreground space-y-1">
              <p className="text-sm text-justify text-muted-foreground">
                {res.program.benefit}
              </p>
            </div>
          </div>

          <label
            htmlFor={`toggle-${res.id}`}
            className="mt-1 block text-center text-sm font-light underline cursor-pointer text-primary"
          >
            <span className="peer-checked:hidden">Selengkapnya</span>
            <span className="hidden peer-checked:inline">Tutup</span>
          </label>
        </div>
      )}
    </div>
  );
  return isHiddenLink ? (
    <div className="w-full h-full cursor-default">{CardContent}</div>
  ) : (
    <Link
      href={`/parent/program/progres/${childId}/detail/${res.id}`}
      className="w-full h-full"
    >
      {CardContent}
    </Link>
  );
};

export default ProgresListCard;
