import { Pie, PieChart } from "recharts";

import { Card, CardContent } from "@/components/ui/card";
import { ChartContainer, type ChartConfig } from "@/components/ui/chart";
import { NutritionStatus, nutritionConfig } from "@/types/partial";

interface NutritionStatusPieProps {
  data: Array<{ status: NutritionStatus; count: number }>;
}

const colorMap: Record<NutritionStatus, string> = {
  normal: "var(--chart-3)",
  underweight: "var(--chart-4)",
  severely_underweight: "var(--chart-5)",
  overweight: "var(--chart-2)",
};

const chartConfig = {
  normal: {
    label: nutritionConfig.normal.label,
    color: colorMap.normal,
  },
  underweight: {
    label: nutritionConfig.underweight.label,
    color: colorMap.underweight,
  },
  severely_underweight: {
    label: nutritionConfig.severely_underweight.label,
    color: colorMap.severely_underweight,
  },
  overweight: {
    label: nutritionConfig.overweight.label,
    color: colorMap.overweight,
  },
} satisfies ChartConfig;

const NutritionStatusPie: React.FC<NutritionStatusPieProps> = ({ data }) => {
  const chartData = data.map((item) => ({
    status: item.status,
    value: item.count,
    fill: colorMap[item.status],
  }));

  return (
    <div className="flex flex-col">
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[240px]"
        >
          <PieChart>
            <Pie data={chartData} dataKey="value" nameKey="status" />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </div>
  );
};

export default NutritionStatusPie;
