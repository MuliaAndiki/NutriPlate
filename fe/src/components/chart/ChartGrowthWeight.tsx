import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";

interface Props {
  chartData: Array<{ age: number; child: number }>;
  summary: {
    lastWeightKg?: number;
  };
}

export default function ChartGrowthWeight({ chartData, summary }: Props) {
  return (
    <Card className="w-full">
      <CardContent className="space-y-4">
        <ChartContainer
          config={{
            child: { label: "Berat Anak", color: "#22C55E" },
          }}
        >
          <LineChart data={chartData} margin={{ left: 12, right: 12 }}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="age"
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `${v}y`}
            />
            <YAxis unit=" kg" />
            <Line
              dataKey="child"
              type="monotone"
              stroke="#22C55E"
              strokeWidth={2}
              dot={{ r: 6, fill: "#22C55E" }}
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ChartContainer>
        <CardTitle className="text-center">
          Pertumbuhan Berat Badan vs Usia
        </CardTitle>
      </CardContent>
      <CardFooter className="text-sm text-muted-foreground">
        Berat terakhir: {summary?.lastWeightKg ?? "-"} kg
      </CardFooter>
    </Card>
  );
}
