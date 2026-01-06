import { Icon } from "@iconify/react/dist/iconify.js";
import { Card } from "../ui/card";
import { formatDate } from "@/utils/string.format";
import { GrowthStatusType } from "@/types/card";

interface MeasurementTableProps {
  historyMeasument: GrowthStatusType[];
}

const MeasurementTable: React.FC<MeasurementTableProps> = ({
  historyMeasument,
}) => {
  return (
    <div className="w-full rounded-lg border flex flex-col">
      <div className="w-full flex items-center space-x-1 bg-primary rounded-t-lg p-4">
        <Icon
          icon="ic:round-history"
          width="24"
          height="24"
          className="text-background"
        />
        <h1 className="text-lg font-bold text-background">
          Riwayat Penimbangan
        </h1>
      </div>

      <div className="flex flex-col gap-2 p-2">
        {historyMeasument.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground">
            Belum ada data penimbangan
          </p>
        ) : (
          historyMeasument.map((data) => (
            <div key={data.id} className="p-3">
              <div className="w-full grid grid-cols-3">
                <div className="flex justify-center items-center flex-col">
                  <h1 className="text-sm font-bold">Tanggal</h1>
                  <p className="text-sm">{formatDate(data.createdAt)}</p>
                </div>

                <div className="flex justify-center items-center flex-col">
                  <h1 className="text-sm font-bold">Berat (kg)</h1>
                  <p className="text-sm">{data.weightKg}</p>
                </div>

                <div className="flex justify-center items-center flex-col">
                  <h1 className="text-sm font-bold">Tinggi (cm)</h1>
                  <p className="text-sm">{data.heightCm}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MeasurementTable;
