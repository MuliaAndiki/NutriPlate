import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";

interface Props {
  chartData: Array<{ age: number; child: number; whoMedian?: number }>;
  summary: {
    lastHeightCm?: number;
  };
}

export default function ChartGrowthHeight({ chartData, summary }: Props) {
  return (
    <Card className="w-full">
      <CardContent className="space-y-4">
        <ChartContainer
          config={{
            child: { label: "Tinggi Anak", color: "#22C55E" },
            who: { label: "WHO Median", color: "#2563EB" },
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
            <YAxis unit=" cm" />
            <Line
              dataKey="child"
              type="monotone"
              stroke="#22C55E"
              strokeWidth={2}
              dot={{ r: 6, fill: "#22C55E" }}
              activeDot={{ r: 8 }}
            />
            <Line
              dataKey="whoMedian"
              type="monotone"
              stroke="#2563EB"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={{ r: 5, fill: "#2563EB" }}
              activeDot={{ r: 7 }}
            />
          </LineChart>
        </ChartContainer>
        <CardTitle className="text-center">
          Pertumbuhan Tinggi Badan vs Usia
        </CardTitle>
      </CardContent>
      <CardFooter className="text-sm text-muted-foreground">
        Tinggi terakhir: {summary?.lastHeightCm ?? "-"} cm
      </CardFooter>
    </Card>
  );
}
