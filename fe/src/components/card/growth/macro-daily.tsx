import { DailySummaryResponse } from "@/types/res/foodSummary.respone";

interface CapaianKebutuhanProps {
  data: DailySummaryResponse;
}

const ProgressBar = ({
  label,
  value,
  target,
  unit,
  color,
}: {
  label: string;
  value: number;
  target: number;
  unit: string;
  color: string;
}) => {
  const percent =
    target === 0 ? 0 : Math.min(Math.round((value / target) * 100), 100);

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span className="font-medium">{label}</span>
        <span className="text-muted-foreground">
          {value}/{target} {unit}
        </span>
      </div>

      <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
        <div
          className={`h-full rounded-full ${color}`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
};

const CapaianKebutuhan: React.FC<CapaianKebutuhanProps> = ({ data }) => {
  const { totals, target } = data;
  const macro = target.macro;

  return (
    <div className="w-full rounded-xl border p-4 space-y-4 bg-background">
      <p className="text-xs text-muted-foreground">
        Perbandingan asupan hari ini dengan kebutuhan gizi anak
      </p>

      <ProgressBar
        label="Kalori"
        value={totals.energyKcal}
        target={target.energyKcal}
        unit="kkal"
        color="bg-emerald-500"
      />

      <ProgressBar
        label="Protein"
        value={totals.proteinGram}
        target={macro.proteinGram}
        unit="g"
        color="bg-yellow-400"
      />

      <ProgressBar
        label="Karbohidrat"
        value={totals.carbGram}
        target={macro.carbGram}
        unit="g"
        color="bg-red-500"
      />

      <ProgressBar
        label="Lemak"
        value={totals.fatGram}
        target={macro.fatGram}
        unit="g"
        color="bg-teal-400"
      />

      <ProgressBar
        label="Serat"
        value={totals.fiberGram}
        target={macro.fiberGram}
        unit="g"
        color="bg-emerald-300"
      />
    </div>
  );
};

export default CapaianKebutuhan;
