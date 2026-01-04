import { CartesianGrid, Line, LineChart, XAxis } from "recharts";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Icon } from "@iconify/react/dist/iconify.js";

interface ChartVsWHOProps {
  labels: any;
  chartConfig: any;
  chartData: any;
  title: string;
}
const ChartVsWHO: React.FC<ChartVsWHOProps> = ({
  chartConfig,
  chartData,
  labels,
  title,
}) => {
  return (
    <div className="w-full p-4 bg-primary  rounded-lg flex  items-center justify-start flex-col space-y-1">
      <div className="w-full flex justify-start items-center space-x-1 ">
        <Icon
          icon="famicons:scale"
          width="24"
          height="24"
          className="text-background"
        />
        <h1 className="text-lg text-background font-bold">{title}</h1>
      </div>

      <Card className="w-full">
        <CardContent className="space-y-4">
          <div className="w-full flex items-center gap-2 justify-end">
            {labels.map((labels: any) => (
              <div className=" flex items-center gap-1   ">
                <div className={`${labels.color} w-4 h-4 rounded-full`} />
                <h1>{labels.label}</h1>
              </div>
            ))}
          </div>

          <ChartContainer config={chartConfig}>
            <LineChart
              accessibilityLayer
              data={chartData}
              margin={{
                left: 12,
                right: 12,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              <Line
                dataKey="desktop"
                type="monotone"
                stroke="var(--color-desktop)"
                strokeWidth={2}
                dot={false}
              />
              <Line
                dataKey="mobile"
                type="monotone"
                stroke="var(--color-mobile)"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ChartContainer>
          <CardTitle className="text-center">Usia (Bulan)</CardTitle>
        </CardContent>
        <CardFooter>
          <div className="flex w-full items-start gap-2 text-sm">
            <div className="text-muted-foreground flex items-center gap-2 leading-none">
              <h1 className="">Berat Terakhir: kg</h1>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ChartVsWHO;
