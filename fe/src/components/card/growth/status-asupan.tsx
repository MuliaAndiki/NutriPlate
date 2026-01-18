"use client";

import { Icon } from "@iconify/react";
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
import { ChartContainer, type ChartConfig } from "@/components/ui/chart";
import { Button } from "@/components/ui/button";
import { DailySummaryResponse } from "@/types/res/foodSummary.respone";
import { useRouter } from "next/navigation";
import { isPolarViewBox } from "@/utils/polar";
interface StatusAsupanProps {
  data: DailySummaryResponse;
  id: string;
}

const StatusAsupan: React.FC<StatusAsupanProps> = ({ data, id }) => {
  const router = useRouter();

  const percent = data.progress.energyPercent;
  const energy = data.totals.energyKcal;
  const target = data.target.energyKcal;

  const statusLabel =
    data.progress.status === "GOOD"
      ? "Baik"
      : data.progress.status === "ENOUGH"
        ? "Cukup"
        : "Kurang";

  const statusColor =
    data.progress.status === "GOOD"
      ? "text-primary"
      : data.progress.status === "ENOUGH"
        ? "text-yellow-500"
        : "text-red-600";

  const chartData = [
    {
      value: percent,
      fill: "var(--color-primary)",
    },
  ];

  const chartConfig = {
    value: { label: "Asupan (%)" },
  } satisfies ChartConfig;

  return (
    <Card className="flex">
      <div className="w-full flex">
        <CardContent className="flex flex-col pb-0">
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
              <RadialBar dataKey="value" background cornerRadius={10} />
              <PolarRadiusAxis tick={false} axisLine={false}>
                <Label
                  content={({ viewBox }) => {
                    if (!isPolarViewBox(viewBox)) return null;

                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan className="text-lg font-bold text-primary">
                          {percent}%
                        </tspan>
                      </text>
                    );
                  }}
                />
              </PolarRadiusAxis>
            </RadialBarChart>
          </ChartContainer>

          <div className="w-full flex justify-center">
            <h1 className={`text-lg font-bold ${statusColor}`}>
              {statusLabel}
            </h1>
          </div>
        </CardContent>

        <div className="w-full">
          <CardHeader className="pb-0">
            <CardTitle className="text-lg">Status Asupan Hari Ini</CardTitle>
          </CardHeader>

          <CardFooter className="flex-col gap-2 text-sm">
            <h1 className="font-light">
              Total energi: {energy} / {target} kkal
            </h1>

            {data.progress.status === "LOW" && (
              <div className="flex items-center gap-1">
                <Icon
                  icon="carbon:warning"
                  width={14}
                  className="text-red-600"
                />
                <p className="text-xs text-red-600 font-extralight">
                  Kalori dan protein belum tercukupi
                </p>
              </div>
            )}

            <div className="w-full text-end">
              <Button
                className="font-light"
                variant="btn"
                onClick={() =>
                  router.push(`/parent/profile-anak/detail/${id}/daily-summary`)
                }
              >
                Lihat Detail
              </Button>
            </div>
          </CardFooter>
        </div>
      </div>
    </Card>
  );
};

export default StatusAsupan;
