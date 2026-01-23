import { DefaultNotifIcon, NotifiIcon } from "@/types/icons";
import { INotification } from "@/types/schema/notafication.schema";
import { formatDateTime } from "@/utils/time.format";
import { Icon } from "@iconify/react";
import Link from "next/link";

interface NotifikasiCardProps {
  res: INotification;
}

const NotifikasiCard: React.FC<NotifikasiCardProps> = ({ res }) => {
  const { icon, className } = NotifiIcon[res.type] ?? DefaultNotifIcon;

  return (
    <Link href={`/parent/notifikasi/detail/${res.id}`}>
      <div
        className={`w-full flex items-center justify-between p-2 ${!res.isRead ? "bg-background/70 " : null}`}
      >
        <div className="flex space-x-3">
          <div
            className={`w-10 h-10 rounded-full border flex items-center justify-center ${className}`}
          >
            <Icon
              icon={icon}
              className={`${className}`}
              width={34}
              height={34}
            />
          </div>

          <div className="flex flex-col">
            <h1 className="font-bold text-lg">{res.title}</h1>
            <p className="text-sm text-muted-foreground">{res.message}</p>
            <p className="text-xs text-foreground/80 ">
              {formatDateTime(res.createdAt, { style: "time" })}
              {/* berapa jam yg lalu */}
            </p>
          </div>
        </div>
        {!res.isRead ? (
          <div className="w-3 h-3 bg-primary rounded-full" />
        ) : null}
      </div>
    </Link>
  );
};

export default NotifikasiCard;
