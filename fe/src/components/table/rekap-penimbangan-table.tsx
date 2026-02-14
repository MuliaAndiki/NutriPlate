import { MeasurementRespone } from "@/types/res";
import { formatDateTime } from "@/utils/time.format";

interface RekapPenimbanganTableProps {
  data: MeasurementRespone[];
  maxRows?: number;
}

const toNumber = (value: unknown) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const getAgeYears = (dateOfBirth?: string | Date) => {
  if (!dateOfBirth) return "-";
  const dob = new Date(dateOfBirth);
  if (Number.isNaN(dob.getTime())) return "-";
  const now = new Date();
  const diff = now.getTime() - dob.getTime();
  const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
  return years;
};
const RekapPenimbanganTable: React.FC<RekapPenimbanganTableProps> = ({
  data,
  maxRows = 7,
}) => {
  const rows = data.slice(0, maxRows);

  return (
    <div className="w-full border rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <div className="min-w-[860px]">
          <div className="sticky top-0 z-10 grid grid-cols-[48px_1.2fr_0.8fr_0.8fr_0.8fr_1fr_1fr] bg-primary/60 text-xs font-semibold p-2">
            <div className="text-center">No.</div>
            <div className="text-center">Nama</div>
            <div className="text-center">Usia (thn)</div>
            <div className="text-center">Berat (kg)</div>
            <div className="text-center">Tinggi (cm)</div>
            <div className="text-center">Status Gizi</div>
            <div className="text-center">Tanggal</div>
          </div>

          <div className="max-h-[280px] overflow-y-auto divide-y">
            {rows.map((item, idx) => (
              <div
                key={item.id}
                className="grid grid-cols-[48px_1.2fr_0.8fr_0.8fr_0.8fr_1fr_1fr] text-xs p-2"
              >
                <div className="text-center ">{idx + 1}</div>
                <div className="truncate">{item.child?.fullName ?? "-"}</div>
                <div className="text-center">
                  {getAgeYears(item.child?.dateOfBirth)}
                </div>
                <div className="text-center">{toNumber(item.weightKg)}</div>
                <div className="text-center">{toNumber(item.heightCm)}</div>
                <div className="text-center">{item.nutritionStatus}</div>
                <div className="text-center whitespace-nowrap">
                  {formatDateTime(item.createdAt, {
                    style: "day-date-slash",
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RekapPenimbanganTable;
