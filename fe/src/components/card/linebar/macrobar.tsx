import { isPolarViewBox } from "@/utils/polar";

import {
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
  Label,
} from "recharts";
const MacroRadial = ({
  label,
  value,
  target,
  color,
  centerLabel,
}: {
  label: string;
  value: number;
  target: number;
  color: string;
  centerLabel?: string;
}) => {
  const percent =
    target > 0 ? Math.min(Math.round((value / target) * 100), 100) : 0;

  const chartData = [{ value: percent, fill: color }];

  return (
    <div className="flex flex-col items-center gap-1">
      <RadialBarChart
        width={90}
        height={90}
        cx="50%"
        cy="50%"
        innerRadius={30}
        outerRadius={42}
        barSize={8}
        data={chartData}
        startAngle={90}
        endAngle={-270}
      >
        <PolarGrid
          gridType="circle"
          radialLines={false}
          stroke="none"
          polarRadius={[36]}
          className="fill-muted"
        />
        <RadialBar dataKey="value" cornerRadius={10} />
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
                  <tspan className="text-sm font-bold">{percent}%</tspan>
                </text>
              );
            }}
          />
        </PolarRadiusAxis>
      </RadialBarChart>

      <span className="text-xs font-medium">{label}</span>
    </div>
  );
};

export default MacroRadial;
