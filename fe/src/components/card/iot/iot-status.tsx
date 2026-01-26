import { Icon } from "@iconify/react/dist/iconify.js";
import { Card } from "@/components/ui/card";
import { GetStatusIotRespone } from "@/types/res";
import { kebabCaseToWords } from "@/utils/string.format";

interface IotStatusProps {
  res: GetStatusIotRespone;
}

const IotStatus: React.FC<IotStatusProps> = ({ res }) => {
  return (
    <Card className=" w-full  p-4">
      <div className="w-full flex justify-start items-center gap-2">
        <Icon
          icon="ri:scales-2-line"
          width={70}
          height={70}
          className="text-primary"
        />
        <div className="flex flex-col justify-start">
          <h1 className="text-lg">ID Perangkat :{res.id}</h1>
          <h1 className="text-lg">Nama Perangkat :{res.name}</h1>
          <h1 className="text-lg">
            Status Perangkat :{kebabCaseToWords(res.status)}
          </h1>
          <h1 className="text-lg">Status Baterai :-</h1>
        </div>
      </div>
    </Card>
  );
};

export default IotStatus;
