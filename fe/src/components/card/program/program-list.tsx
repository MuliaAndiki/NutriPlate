import { ProgresRespone } from "@/types/res";
import { ProgressBar } from "../linebar/linebar";
import Link from "next/link";

interface ProgresListCard {
  res: ProgresRespone;
  pathname?: string;
}

const ProgresListCard: React.FC<ProgresListCard> = ({ res, pathname }) => {
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
          Anak: <span className="font-medium">{res.child?.fullName}</span>
        </p>

        <p className="text-sm">
          Status:{" "}
          <span className="font-semibold">{res.progressSummary.status}</span>
        </p>

        <p className="text-xs text-muted-foreground">
          Sisa Task: {res.progressSummary.remainingTask}
        </p>
      </div>

      <div className="w-full px-3 pb-3">
        <ProgressBar
          label=""
          value={res.progressSummary.percentage}
          target={100}
          unit="%"
          color={isDone ? "bg-info" : "bg-emerald-500"}
        />
      </div>
      {isHiddenLink && (
        <div className="w-full border-t flex justify-center items-center">
          <h1 className="font-light ">Selengkapnya</h1>
        </div>
      )}
    </div>
  );
  return isHiddenLink ? (
    <div className="w-full h-full cursor-default">{CardContent}</div>
  ) : (
    <Link
      href={`/parent/program/progres/${res.childId}/detail/${res.id}`}
      className="w-full h-full"
    >
      {CardContent}
    </Link>
  );
};

export default ProgresListCard;
