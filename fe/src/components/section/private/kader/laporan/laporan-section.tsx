import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Icon } from "@iconify/react/dist/iconify.js";
import { BellIcon, Book, MailIcon, MessageSquareIcon } from "lucide-react";
import { Pie, PieChart } from "recharts";

import { Card, CardContent } from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart";

const LaporanSection = () => {
  const chartData = [
    { browser: "chrome", visitors: 275, fill: "var(--color-chrome)" },
    { browser: "safari", visitors: 200, fill: "var(--color-safari)" },
    { browser: "firefox", visitors: 187, fill: "var(--color-firefox)" },
  ];

  const chartConfig = {
    visitors: {
      label: "Visitors",
    },
    chrome: {
      label: "Chrome",
      color: "var(--chart-1)",
    },
    safari: {
      label: "Safari",
      color: "var(--chart-2)",
    },
    firefox: {
      label: "Firefox",
      color: "var(--chart-3)",
    },
  } satisfies ChartConfig;
  return (
    <section className="w-full min-h-screen flex items-center justify-start flex-col overflow-x-hidden relative p-2 space-y-2">
      <div className="w-full flex items-center justify-between">
        <h1 className="text-2xl font-bold">Laporan Posyandu</h1>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Icon
              icon="iconoir:filter-solid"
              width={24}
              height={24}
              className="text-primary cursor-pointer"
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-52">
            <DropdownMenuLabel>Filter Tipe</DropdownMenuLabel>
            <DropdownMenuCheckboxItem>
              <MailIcon className="mr-2 h-4 w-4" />
              Pengingat
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem>
              <MessageSquareIcon className="mr-2 h-4 w-4" />
              Hasil
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem>
              <BellIcon className="mr-2 h-4 w-4" />
              Peringatan
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem>
              <Book className="mr-2 h-4 w-4" />
              Edukasi
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="w-full">
        <h1 className="text-xl font-bold">Rekap data balita dan penimbangan</h1>
      </div>
      <div className="w-full flex items-center justify-between">
        <h1>INotification</h1>
        <h1>INotification</h1>
      </div>
      <div className="w-full flex items-center">
        <Icon
          icon="tabler:chart-pie"
          width="34"
          height="34"
          className="text-primary"
        />
        <h1 className="text-lg font-bold">Distribusi Status Gizi</h1>
      </div>
      <div className="w-full  ">
        <Card className="flex flex-col">
          <CardContent className="flex-1 pb-0">
            <ChartContainer
              config={chartConfig}
              className="mx-auto aspect-square max-h-[300px]"
            >
              <PieChart>
                <Pie data={chartData} dataKey="visitors" />
                <ChartLegend
                  content={<ChartLegendContent nameKey="statusGizi" />}
                  className="-translate-y-2 flex-wrap gap-2 *:basis-1/4 *:justify-center"
                />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <div className="w-full flex items-center ">
        <Icon
          icon="material-symbols:history-rounded"
          width="34"
          height="34"
          className="text-primary"
        />
        <h1 className="text-lg font-bold">Rekap Penimbangan</h1>
      </div>
    </section>
  );
};

export default LaporanSection;
