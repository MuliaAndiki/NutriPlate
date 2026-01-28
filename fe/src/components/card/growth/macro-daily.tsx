import { DailySummaryResponse } from "@/types/res/foodSummary.respone";
import { ProgressBar } from "../linebar/linebar";
interface CapaianKebutuhanProps {
  data: DailySummaryResponse;
}

const CapaianKebutuhan: React.FC<CapaianKebutuhanProps> = ({ data }) => {
  const { totals, target } = data;
  const macro = target.macro;

  return (
    <div className="w-full rounded-xl border p-4 space-y-4 bg-background">
      <p className="text-xs text-muted-foreground">
        Dihitung berdasarkan kebutuhan gizi harian anak
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
