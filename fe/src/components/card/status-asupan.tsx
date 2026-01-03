import { Icon } from "@iconify/react/dist/iconify.js";
import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { type ChartConfig,ChartContainer } from "@/components/ui/chart";

import { Button } from "../ui/button";
const StatusAsupan = () => {
  const chartData = [
    { browser: "safari", visitors: 77, fill: "var(--color-primary)" },
  ];

  const chartConfig = {
    visitors: {
      label: "Visitors",
    },
    safari: {
      label: "Safari",
      color: "var(--chart-2)",
    },
  } satisfies ChartConfig;
  return (
    <Card className="flex  ">
      <div className="w-full flex">
        <CardContent className="flex flex-col  pb-0">
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square w-[100px] h-[100px]"
          >
            <RadialBarChart
              data={chartData}
              startAngle={0}
              endAngle={230}
              innerRadius={40}
              outerRadius={70}
            >
              <PolarGrid
                gridType="circle"
                radialLines={false}
                stroke="none"
                className="first:fill-muted last:fill-background"
                polarRadius={[46, 34]}
              />
              <RadialBar dataKey="visitors" background cornerRadius={10} />
              <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          <tspan
                            x={viewBox.cx}
                            y={viewBox.cy}
                            className=" text-lg font-bold text-primary"
                          >
                            {chartData[0].visitors.toLocaleString()}%
                          </tspan>
                        </text>
                      );
                    }
                  }}
                />
              </PolarRadiusAxis>
            </RadialBarChart>
          </ChartContainer>
          <div className="w-full flex justify-center items-center">
            <h1 className="text-lg font-bold text-primary">Baik</h1>
          </div>
        </CardContent>
        <div className="w-full">
          <CardHeader className="items-center w-full pb-0">
            <CardTitle className="text-lg">Status Asupan Hari Ini</CardTitle>
          </CardHeader>
          <CardFooter className="flex-col gap-2 text-sm">
            <div className="flex items-start w-full flex-col  gap-2 leading-none font-medium">
              <h1 className="font-light">Total energi: 990 kkal</h1>
              <div className="w-full flex items-center justify-start ">
                <Icon
                  icon="carbon:warning"
                  width="15"
                  height="15"
                  className="text-red-600"
                />
                <p className="text-xs text-red-600 font-extralight ">
                  Protein dan kalori belum tercukupi
                </p>
              </div>
              <div className="w-full  text-end">
                <Button className="font-light" variant={"btn"}>
                  Lihat Detail
                </Button>
              </div>
            </div>
          </CardFooter>
        </div>
      </div>
    </Card>
  );
};

export default StatusAsupan;
