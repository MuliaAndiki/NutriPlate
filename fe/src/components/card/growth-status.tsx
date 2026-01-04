import { Icon } from "@iconify/react/dist/iconify.js";
import { Card } from "../ui/card";

const GrowthStatusCard = () => {
  return (
    <Card className="w-full p-2">
      <div className="w-full flex justify-start items-center gap-2">
        <Icon
          icon="lucide:smile"
          width="100"
          height="100"
          className="text-primary"
        />
        <div className="w-full">
          <h1 className="text-2xl font-bold">Status Pertumbuhan</h1>
          <p className="text-primary font-bold text-lg">Normal</p>
        </div>
      </div>
    </Card>
  );
};

export default GrowthStatusCard;
