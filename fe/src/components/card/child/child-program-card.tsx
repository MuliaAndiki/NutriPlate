import { Card } from "@/components/ui/card";
import Image from "next/image";
import { formatDateTime } from "@/utils/time.format";
import { ChildRespone } from "@/types/res/child.respone";
import Link from "next/link";
interface ChildProgramCard {
  childType: ChildRespone;
  pathname: string;
  setIdChild?: React.Dispatch<React.SetStateAction<string | null>>;
  idChild?: string | null;
}
const ChildProgramCard: React.FC<ChildProgramCard> = ({
  childType,
  pathname,
  idChild,
  setIdChild,
}) => {
  let mode: "DETAIL" | "LIST" | null = null;

  if (pathname.startsWith("/parent/program/detail/")) {
    mode = "DETAIL";
  } else if (pathname === "/parent/program") {
    mode = "LIST";
  }

  const isComplate = childType.programProgress.filter(
    (item) => item.isCompleted === true,
  ).length;

  const content = (
    <Card
      className={`w-full p-3 ${
        idChild && mode === "DETAIL" ? "border-primary" : "border-transparent "
      }`}
      onClick={() => {
        if (mode === "DETAIL") {
          setIdChild?.(childType.id);
        }
      }}
    >
      <div className="flex items-center gap-3">
        <Image
          alt="image"
          src={childType.avaChild || "/images/childDummy.png"}
          width={50}
          height={50}
          className="rounded-full aspect-square"
        />
        <div>
          <h1 className="text-lg font-bold">{childType.fullName}</h1>

          {mode === "DETAIL" && (
            <p className="text-sm text-foreground/80">
              {formatDateTime(childType.dateOfBirth, {
                style: "day-date-slash",
              })}
            </p>
          )}

          {mode === "LIST" && (
            <p className="text-sm text-foreground/80">
              {childType.programProgress.length} Program berjalan · {isComplate}{" "}
              Selesai
            </p>
          )}
        </div>
      </div>
    </Card>
  );

  return mode === "LIST" ? (
    <Link
      className="w-full block"
      href={`/parent/program/progres/${childType.id}`}
    >
      {content}
    </Link>
  ) : (
    <div className="w-full cursor-pointer">{content}</div>
  );
};

export default ChildProgramCard;
