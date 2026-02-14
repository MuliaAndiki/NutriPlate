import { GetListKader } from "@/types/res";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { identifier } from "@/utils/string.format";
import { Icon } from "@iconify/react/dist/iconify.js";
import { AlertContexType } from "@/types/ui";

interface KaderCardProps {
  index: number;
  data: GetListKader;
  onDetail?: () => void;
  onDeleteKader?: () => void;
  alert?: AlertContexType;
  setRegisterKaderId?: React.Dispatch<React.SetStateAction<string>>;
}

const KaderCard: React.FC<KaderCardProps> = ({
  index,
  data,
  onDetail,
  onDeleteKader,
  alert,
  setRegisterKaderId,
}) => {
  return (
    <div className="w-full flex items-center justify-between bg-background border rounded-xl p-3">
      <div className="flex items-center space-x-3">
        <div className="w-6 h-6 rounded-md bg-primary/50 text-background text-xs flex items-center justify-center font-bold">
          {index + 1}
        </div>

        <Image
          src={data.kader.avaUrl || "/avatars/1.png"}
          alt={data.kader.fullName}
          width={40}
          height={40}
          className="rounded-full object-cover"
        />

        <div className="flex flex-col">
          <p className="font-semibold text-sm">{data.kader.fullName}</p>
          <p className="text-xs text-muted-foreground">
            {identifier(data.kader.email, data.kader.phone)}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          size="sm"
          className="rounded-full text-xs px-3"
          onClick={() => {
            setRegisterKaderId!(data.id);
            alert!.confirm({
              title: "Peringatan",
              deskripsi: "Apakah Anda Yakin Menghapus Ini",
              icon: "warning",
              onConfirm: () => {
                onDeleteKader!();
              },
            });
          }}
          variant={"destructive"}
        >
          <Icon
            icon="iconamoon:trash"
            width="24"
            height="24"
            className="text-background"
          />
        </Button>
        <Button
          size="sm"
          className="rounded-full text-xs px-3"
          onClick={onDetail}
        >
          Detail
        </Button>
      </div>
    </div>
  );
};

export default KaderCard;
