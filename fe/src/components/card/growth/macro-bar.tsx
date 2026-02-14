import { DailySummaryResponse } from "@/types/res";
import MacroRadial from "../linebar/macrobar";

interface MakroBarDailyProps {
  data: DailySummaryResponse;
}

const MakroBarDaily: React.FC<MakroBarDailyProps> = ({ data }) => {
  const { totals, target } = data;
  const macro = target.macro;

  return (
    <div className="w-full rounded-xl border p-4 bg-background space-y-3">
      <div className="flex items-center gap-2">
        <div className="h-3 w-3 rounded-full bg-primary" />
        <h3 className="font-semibold text-sm">Indikator Kebutuhan Gizi</h3>
      </div>

      <p className="text-xs text-muted-foreground">
        Dihitung berdasarkan kebutuhan gizi harian anak
      </p>

      <div className="grid grid-cols-3 gap-y-4 justify-items-center">
        <MacroRadial
          label="Kalori"
          value={totals.energyKcal}
          target={target.energyKcal}
          color="var(--color-primary)"
        />
        <MacroRadial
          label="Protein"
          value={totals.proteinGram}
          target={macro.proteinGram}
          color="#ef4444"
        />
        <MacroRadial
          label="Karbohidrat"
          value={totals.carbGram}
          target={macro.carbGram}
          color="#10b981"
        />
        <MacroRadial
          label="Lemak"
          value={totals.fatGram}
          target={macro.fatGram}
          color="#06b6d4"
        />
        <MacroRadial
          label="Serat"
          value={totals.fiberGram}
          target={macro.fiberGram}
          color="#22c55e"
        />
      </div>
    </div>
  );
};

export default MakroBarDaily;
