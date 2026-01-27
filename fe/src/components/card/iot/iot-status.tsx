import { Icon } from "@iconify/react/dist/iconify.js";
import { Card } from "@/components/ui/card";
import { GetStatusIotRespone } from "@/types/res";
import { kebabCaseToWords } from "@/utils/string.format";

interface IotStatusProps {
  res: GetStatusIotRespone | null;
}

const IotStatus: React.FC<IotStatusProps> = ({ res }) => {
  const deviceId = res?.id ?? "-";
  const deviceName = res?.name ?? "-";
  const deviceStatus = res?.status ? kebabCaseToWords(res.status) : "-";

  return (
    <Card className="w-full p-4">
      <div className="w-full flex justify-start items-center gap-3">
        <Icon
          icon="ri:scales-2-line"
          width={70}
          height={70}
          className="text-primary"
        />

        <div className="flex flex-col justify-start space-y-1">
          <h1 className="text-lg">
            ID Perangkat : <span className="font-medium">{deviceId}</span>
          </h1>

          <h1 className="text-lg">
            Nama Perangkat : <span className="font-medium">{deviceName}</span>
          </h1>

          <h1 className="text-lg">
            Status Perangkat :{" "}
            <span className="font-medium">{deviceStatus}</span>
          </h1>

          <h1 className="text-lg">
            Status Baterai : <span className="font-medium">-</span>
          </h1>
        </div>
      </div>
    </Card>
  );
};

export default IotStatus;
