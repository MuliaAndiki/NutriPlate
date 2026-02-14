import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import { Icon } from "@iconify/react/dist/iconify.js";

interface Props {
  chartData: Array<{ age: number; child: number }>;
  summary: {
    lastWeightKg?: number;
  };
}

export default function ChartGrowthWeight({ chartData, summary }: Props) {
  return (
    <div className="w-full rounded-lg  border flex flex-col">
      <div className="w-full flex items-center space-x-1 bg-primary rounded-t-lg p-4 ">
        <Icon
          icon="famicons:scale-outline"
          width="24"
          height="24"
          className="text-background"
        />
        <h1 className="text-lg font-bold text-background">
          Grafik Tinggi Badan vs Usia
        </h1>
      </div>
      <div className="  flex  items-start">
        <Card className="w-full">
          <CardContent className="space-y-4">
            <div className="flex  ">
              <div className="w-full flex items-baseline  justify-end space-x-1">
                <div className="bg-primary w-3 h-3 rounded-full" />
                <h1 className="font-light">Data Anak</h1>
              </div>
              <div className="w-full flex items-baseline justify-end  space-x-1">
                <div className="bg-[#2979FF] w-3 h-3 rounded-full" />
                <h1 className="font-light">Standar WHO</h1>
              </div>
            </div>
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
      </div>
    </div>
  );
}
