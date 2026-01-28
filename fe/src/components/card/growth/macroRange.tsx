"use client";

import { useMemo, useState } from "react";
import { RadialBarChart, RadialBar, Label, PolarRadiusAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type TotalKey =
  | "energyKcal"
  | "proteinGram"
  | "fatGram"
  | "carbGram"
  | "fiberGram";

const TOTAL_OPTIONS: {
  key: TotalKey;
  label: string;
  unit: string;
  color: string;
}[] = [
  {
    key: "energyKcal",
    label: "Kalori",
    unit: "kkal",
    color: "var(--color-primary)",
  },
  { key: "proteinGram", label: "Protein", unit: "g", color: "#ef4444" },
  { key: "carbGram", label: "Karbohidrat", unit: "g", color: "#10b981" },
  { key: "fatGram", label: "Lemak", unit: "g", color: "#06b6d4" },
  { key: "fiberGram", label: "Serat", unit: "g", color: "#22c55e" },
];

interface MacroRangeRadialProps {
  summaries: any[];
}

const MacroRangeRadial: React.FC<MacroRangeRadialProps> = ({ summaries }) => {
  const [selected, setSelected] = useState<TotalKey>("energyKcal");

  const option = TOTAL_OPTIONS.find((o) => o.key === selected)!;

  const totalValue = useMemo(
    () =>
      summaries.reduce((sum, d) => sum + Number(d.totals?.[selected] ?? 0), 0),
    [summaries, selected],
  );

  const totalTarget = useMemo(
    () =>
      summaries.reduce(
        (sum, d) =>
          sum +
          (selected === "energyKcal"
            ? d.target.energyKcal
            : d.target.macro[selected]),
        0,
      ),
    [summaries, selected],
  );

  const percent = Math.min(Math.round((totalValue / totalTarget) * 100), 100);

  const chartData = [
    { name: "filled", value: percent, fill: option.color },
    { name: "rest", value: 100 - percent, fill: "#FFC400" },
  ];

  return (
    <Card>
      <CardHeader className="flex-row items-center w-full ">
        <CardTitle className="text-sm">Total {option.label} (Range)</CardTitle>
        <div className="w-full ">
          <Select
            value={selected}
            onValueChange={(v) => setSelected(v as TotalKey)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Pilih nutrisi" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Nutrisi</SelectLabel>
                {TOTAL_OPTIONS.map((o) => (
                  <SelectItem key={o.key} value={o.key}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent className="flex justify-center">
        <RadialBarChart
          width={220}
          height={220}
          innerRadius={60}
          outerRadius={100}
          startAngle={90}
          endAngle={-270}
          data={chartData}
        >
          <RadialBar dataKey="value" cornerRadius={10} background={false} />

          <PolarRadiusAxis tick={false} axisLine={false}>
            <Label
              content={({ viewBox }) => {
                if (!viewBox || !("cx" in viewBox)) return null;
                const { cx, cy } = viewBox as { cx: number; cy: number };

                return (
                  <text x={cx} y={cy} textAnchor="middle">
                    <tspan
                      x={cx}
                      dy="-6"
                      className="text-2xl font-bold fill-primary"
                    >
                      {percent}%
                    </tspan>

                    <tspan x={cx} dy="18" className="text-xs fill-foreground">
                      {Math.round(totalValue)} {option.unit}
                    </tspan>

                    <tspan
                      x={cx}
                      dy="14"
                      className="text-[10px] fill-muted-foreground"
                    >
                      dari {Math.round(totalTarget)} {option.unit}
                    </tspan>
                  </text>
                );
              }}
            />
          </PolarRadiusAxis>
        </RadialBarChart>
      </CardContent>
    </Card>
  );
};

export default MacroRangeRadial;
