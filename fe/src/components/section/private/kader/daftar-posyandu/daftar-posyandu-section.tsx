import { Input } from "@/components/ui/input";
import { PosyanduRespone } from "@/types/res";
import { ChevronLeft, Search } from "lucide-react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import PosyanduCard from "@/components/card/posyandu/posyanduCard";
import { Icon } from "@iconify/react/dist/iconify.js";
import Link from "next/link";
interface DaftarPosyanduKaderSectionProps {
  namespace: {
    router: AppRouterInstance;
  };
  service: {
    query: {
      posyandu: PosyanduRespone[];
      isLoading: boolean;
    };
    search: {
      value: string;
      onChange: (value: string) => void;
    };
  };
}

const DaftarPosyanduKaderSection: React.FC<DaftarPosyanduKaderSectionProps> = ({
  namespace,
  service,
}) => {
  if (service.query.isLoading) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <section className="w-full min-h-screen flex flex-col p-3 space-y-3">
      <div className="flex items-center justify-between ">
        <div className="w-full flex items-center spaxe-x-2">
          <ChevronLeft
            className="cursor-pointer"
            onClick={() => namespace.router.back()}
          />
          <h1 className="text-xl font-bold">Daftar Posyandu</h1>
        </div>
        <Link className=" h-auto" href={"/kader/daftar-posyandu/status"}>
          <Icon
            icon="fluent:status-12-filled"
            width="24"
            height="24"
            className="text-primary"
          />
        </Link>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Cari posyandu / wilayah..."
          className="pl-9"
          value={service.search.value}
          onChange={(e) => service.search.onChange(e.target.value)}
        />
      </div>

      <div className="flex flex-col space-y-3">
        {service.query.posyandu.length === 0 ? (
          <p className="text-center text-muted-foreground py-10">
            Posyandu tidak ditemukan
          </p>
        ) : (
          service.query.posyandu.map((item) => (
            <PosyanduCard key={item.id} data={item} />
          ))
        )}
      </div>
    </section>
  );
};

export default DaftarPosyanduKaderSection;
