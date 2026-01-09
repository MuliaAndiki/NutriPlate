import { Icon } from "@iconify/react/dist/iconify.js";

interface ChartGrowthFallBackSection {
  title: any;
}
const ChartGrowthFallBack: React.FC<ChartGrowthFallBackSection> = ({
  title,
}) => {
  return (
    <div className="w-full rounded-lg  border flex flex-col">
      <div className="w-full flex items-center space-x-1 bg-primary rounded-t-lg p-4 ">
        <Icon
          icon="famicons:scale-outline"
          width="24"
          height="24"
          className="text-background"
        />
        <h1 className="text-lg font-bold text-background">{title}</h1>
      </div>
      <div className="flex items-center justify-center">
        <h1 className="text-sm text-muted-foreground">Grafik Belum Tersedia</h1>
      </div>
    </div>
  );
};

export default ChartGrowthFallBack;
