import DataNotFound from "@/components/empty/data-not-found";
import { InputWrapper } from "@/components/wrapper/InputWrapper";
import SectionSkeleton from "@/components/skeleton/section-skeleton";
import { Badge } from "@/components/ui/badge";
import { FoodClassRespone } from "@/types/res";
import { Icon } from "@iconify/react/dist/iconify.js";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { ArrowLeft } from "lucide-react";

interface DetectionMakananSectionProps {
  namespace: {
    router: AppRouterInstance;
  };
  service: {
    query: {
      food: FoodClassRespone[];
      totalFood: number;
      isLoading: boolean;
    };
  };
  state: {
    search: {
      value: string;
      onChange: (value: string) => void;
    };
  };
}

const formatValue = (value: number | null | undefined, suffix?: string) => {
  if (value === null || value === undefined) return "-";
  return `${new Intl.NumberFormat("id-ID", {
    maximumFractionDigits: 2,
  }).format(value)}${suffix ? ` ${suffix}` : ""}`;
};

const DetectionMakananSection: React.FC<DetectionMakananSectionProps> = ({
  service,
  state,
  namespace,
}) => {
  const food = service.query.food;

  if (service.query.isLoading) {
    return <SectionSkeleton />;
  }

  if (!food) {
    return <DataNotFound />;
  }

  return (
    <section className="w-full min-h-screen overflow-x-hidden p-3 space-y-3">
      <div className="w-full flex items-center gap-1">
        <ArrowLeft
          onClick={() => namespace.router.back()}
          className="cursor-pointer h-5 w-5"
        />
        <h1 className="text-lg font-bold">Kembali</h1>
      </div>
      <div className="w-full rounded-lg border bg-card p-3 space-y-3">
        <div className="w-full flex items-center justify-between gap-2">
          <h1 className="text-lg font-semibold">Kelas Makanan</h1>
          <Badge variant="secondary">
            {food.length}/{service.query.totalFood} data
          </Badge>
        </div>

        <InputWrapper
          className="w-full border rounded-lg"
          placeholder="Cari nama, kategori, label, atau sumber..."
          value={state.search.value}
          onChange={(e) => state.search.onChange(e.target.value)}
          rightIcon={
            <Icon
              icon="material-symbols:search-rounded"
              width="20"
              height="20"
            />
          }
        />

        {food.length === 0 ? (
          <div className="w-full border border-dashed rounded-lg p-6 text-center">
            <h2 className="font-medium">Data tidak ditemukan</h2>
            <p className="text-sm text-muted-foreground">
              Coba kata kunci lain untuk melihat data makanan.
            </p>
          </div>
        ) : (
          <div className="w-full overflow-x-auto rounded-lg border">
            <table className="w-full min-w-[980px] text-sm">
              <thead className="bg-primary/10">
                <tr>
                  <th className="px-3 py-2 text-left font-semibold">Nama</th>
                  <th className="px-3 py-2 text-left font-semibold">
                    Kategori
                  </th>
                  <th className="px-3 py-2 text-right font-semibold">Energi</th>
                  <th className="px-3 py-2 text-right font-semibold">
                    Protein
                  </th>
                  <th className="px-3 py-2 text-right font-semibold">Lemak</th>
                  <th className="px-3 py-2 text-right font-semibold">Karbo</th>
                  <th className="px-3 py-2 text-right font-semibold">
                    Kalsium
                  </th>
                  <th className="px-3 py-2 text-right font-semibold">
                    Zat Besi
                  </th>
                  <th className="px-3 py-2 text-left font-semibold">Sumber</th>
                </tr>
              </thead>
              <tbody>
                {food.map((item) => (
                  <tr
                    key={item.id}
                    className="border-t odd:bg-background even:bg-muted/30"
                  >
                    <td className="px-3 py-2">
                      <p className="font-medium">
                        {item.metadata?.label ?? item.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {item.name}
                      </p>
                    </td>
                    <td className="px-3 py-2 capitalize">{item.category}</td>
                    <td className="px-3 py-2 text-right">
                      {formatValue(item.energyKcal, "kkal")}
                    </td>
                    <td className="px-3 py-2 text-right">
                      {formatValue(item.proteinGram, "g")}
                    </td>
                    <td className="px-3 py-2 text-right">
                      {formatValue(item.fatGram, "g")}
                    </td>
                    <td className="px-3 py-2 text-right">
                      {formatValue(item.carbGram, "g")}
                    </td>
                    <td className="px-3 py-2 text-right">
                      {formatValue(item.calciumMg, "mg")}
                    </td>
                    <td className="px-3 py-2 text-right">
                      {formatValue(item.ironMg, "mg")}
                    </td>
                    <td className="px-3 py-2">
                      <p>{item.metadata?.source ?? "-"}</p>
                      {item.metadata?.note && (
                        <p className="text-xs text-muted-foreground truncate max-w-[220px]">
                          {item.metadata.note}
                        </p>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
};

export default DetectionMakananSection;
