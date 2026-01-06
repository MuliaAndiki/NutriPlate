import { Icon } from "@iconify/react/dist/iconify.js";
import { Card } from "../ui/card";

const GrowthStatusCardFallBack = () => {
  return (
    <Card className="w-full p-4">
      <div className="w-full flex items-center justify-start">
        <Icon icon="iconoir:db-error" width="100" height="100" className="" />
        <div className="w-full flex items-start flex-col">
          <h1 className="text-2xl">Status Pertumbuhan</h1>
          <p className="text-xl">--</p>
        </div>
      </div>
    </Card>
  );
};

export default GrowthStatusCardFallBack;
