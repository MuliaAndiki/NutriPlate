import { nutritionConfig } from "@/types/partial";
import { MeasurementRespone } from "@/types/res";
import { calculateAge } from "@/utils/age";
import Image from "next/image";

interface ChildMeasurementProps {
  res: MeasurementRespone;
  index?: number;
  onDetail?: () => void;
}

const ChildMeasurement: React.FC<ChildMeasurementProps> = ({
  res,
  index = 1,
  onDetail,
}) => {
  if (!res) return null;

  const statusKey = res.nutritionStatus.toLowerCase();
  const status =
    nutritionConfig[statusKey as keyof typeof nutritionConfig] ??
    nutritionConfig.normal;

  return (
    <div
      className={`w-full flex items-center border rounded-xl overflow-hidden ${status.border}`}
      onClick={() => onDetail!()}
    >
      <div
        className={`w-12 h-full flex items-center justify-center text-lg font-bold ${status.index}`}
      >
        {index}
      </div>

      <div className="flex-1 flex items-center justify-between px-3 py-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-background/20 flex items-center justify-center">
            {res.child.avaChild ? (
              <Image
                src={res.child.avaChild}
                alt={res.child.fullName}
                width={40}
                height={40}
                className="object-cover"
              />
            ) : (
              <span className="text-sm font-bold ">
                {res.child.fullName.charAt(0)}
              </span>
            )}
          </div>

          <div>
            <p className="text-sm font-semibold">{res.child.fullName}</p>
            <p className="text-xs text-muted-foreground">
              {res.child.gender === "MALE" ? "Laki-laki" : "Perempuan"} •{" "}
              {calculateAge(res.child.dateOfBirth)}
            </p>
          </div>
        </div>

        <span
          className={`px-3 py-1 text-xs rounded-full font-semibold ${status.badge}`}
        >
          {status.label}
        </span>
      </div>
    </div>
  );
};

export default ChildMeasurement;
