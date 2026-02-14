import { DefaultNotifIcon, NotifiIcon } from "@/types/icons";
import { INotification } from "@/types/schema/notafication.schema";
import { formatDateTime } from "@/utils/time.format";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Button } from "@/components/ui/button";

interface NotifikasiManageCardProps {
  res: INotification;
  isRead?: boolean;
  onDetail: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onBroadcast: (id: string) => void;
}

const NotifikasiManageCard: React.FC<NotifikasiManageCardProps> = ({
  res,
  isRead = false,
  onDetail,
  onEdit,
  onDelete,
  onBroadcast,
}) => {
  const { icon, className } = NotifiIcon[res.type] ?? DefaultNotifIcon;
  const isBroadcast = res.isBroadcast ?? false;

  return (
    <div
      className={`w-full flex items-center justify-between p-2 rounded-lg border ${!isRead ? "bg-background/70" : ""}`}
    >
      <button
        type="button"
        onClick={() => onDetail(res.id)}
        className="flex space-x-3 text-left"
      >
        <div
          className={`w-10 h-10 rounded-full border flex items-center justify-center ${className}`}
        >
          <Icon icon={icon} className={className} width={34} height={34} />
        </div>

        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <h1 className="font-bold text-lg">{res.title}</h1>
            <span
              className={`text-[10px] px-2 py-1 rounded-full border ${isBroadcast ? "border-primary text-primary" : "border-muted-foreground text-muted-foreground"}`}
            >
              {isBroadcast ? "Broadcast" : "Draft"}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">{res.message}</p>
          <p className="text-xs text-foreground/80">
            {formatDateTime(res.createdAt, { style: "time" })}
          </p>
        </div>
      </button>

      <div className="flex items-center gap-2">
        {!isBroadcast && (
          <Button
            variant="outline"
            size="icon-sm"
            onClick={() => onBroadcast(res.id)}
            title="Broadcast"
          >
            <Icon icon="mdi:broadcast" width={16} height={16} />
          </Button>
        )}
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => onEdit(res.id)}
          title="Edit"
        >
          <Icon icon="uil:edit" width={16} height={16} />
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => onDelete(res.id)}
          title="Hapus"
        >
          <Icon icon="pajamas:remove" width={16} height={16} />
        </Button>
      </div>
    </div>
  );
};

export default NotifikasiManageCard;
