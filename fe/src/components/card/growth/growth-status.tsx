import { Icon } from "@iconify/react/dist/iconify.js";
import { Card } from "../../ui/card";
import { GrowthStatusType } from "@/types/card";

export interface GrowthStatusProps {
  data: GrowthStatusType;
}
const GrowthStatusCard: React.FC<GrowthStatusProps> = ({ data }) => {
  const status = data?.nutritionStatus;

  switch (status) {
    case "severely_underweight":
      return (
        <Card className="w-full p-4 border border-destructive ">
          <div className="w-full flex items-center gap-3">
            <Icon
              icon="lucide:frown"
              width={80}
              height={80}
              className="text-destructive"
            />
            <div>
              <h1 className="text-xl font-bold">Status Pertumbuhan</h1>
              <p className="text-destructive font-semibold">
                Sangat Kurang Gizi
              </p>
            </div>
          </div>
        </Card>
      );

    case "underweight":
      return (
        <Card className="w-full p-4 border border-warning ">
          <div className="w-full flex items-center gap-3">
            <Icon
              icon="lucide:meh"
              width={80}
              height={80}
              className="text-warning"
            />
            <div>
              <h1 className="text-xl font-bold">Status Pertumbuhan</h1>
              <p className="text-warning font-semibold">Kurang Gizi</p>
            </div>
          </div>
        </Card>
      );

    case "normal":
      return (
        <Card className="w-full p-4 border border-primary ">
          <div className="w-full flex items-center gap-3">
            <Icon
              icon="lucide:smile"
              width={80}
              height={80}
              className="text-primary"
            />
            <div>
              <h1 className="text-xl font-bold">Status Pertumbuhan</h1>
              <p className="text-primary font-semibold">Normal</p>
            </div>
          </div>
        </Card>
      );

    case "overweight":
      return (
        <Card className="w-full p-4 border border-orange-500 ">
          <div className="w-full flex items-center gap-3">
            <Icon
              icon="lucide:smile-plus"
              width={80}
              height={80}
              className="text-orange-600"
            />
            <div>
              <h1 className="text-xl font-bold">Status Pertumbuhan</h1>
              <p className="text-orange-600 font-semibold">
                Berat Badan Berlebih
              </p>
            </div>
          </div>
        </Card>
      );

    default:
      return null;
  }
};

export default GrowthStatusCard;
