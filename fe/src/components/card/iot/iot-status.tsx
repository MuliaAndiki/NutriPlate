import { Icon } from "@iconify/react/dist/iconify.js";
import { Card } from "@/components/ui/card";

const IotStatus = () => {
  return (
    <Card className=" w-full  p-4">
      <div className="w-full flex justify-start items-center gap-2">
        <Icon
          icon="ri:scales-2-line"
          width={50}
          height={50}
          className="text-primary"
        />
        <div className="flex flex-col justify-start">
          <h1 className="text-lg">Nama Perangkat :</h1>
          <h1 className="text-lg">Status Perangkat :</h1>
          <h1 className="text-lg">Status Baterai :</h1>
        </div>
      </div>
    </Card>
  );
};

export default IotStatus;
