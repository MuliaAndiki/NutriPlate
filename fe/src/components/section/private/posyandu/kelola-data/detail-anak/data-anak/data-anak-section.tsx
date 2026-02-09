import { Icon } from "@iconify/react/dist/iconify.js";
import { ChevronLeft } from "lucide-react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import DataAnakSectionSkeleton from "@/components/skeleton/private/posyandu/kelola-data/detail-anak/data-anak/data-anak-section-skeleton";
import DataNotFound from "@/components/empty/data-not-found";
import { AlertContexType } from "@/types/ui";
import { ChildRespone } from "@/types/res";
interface DataAnakPosyanduHeroSectionProps {
  namespace: {
    router: AppRouterInstance;
    alert: AlertContexType;
  };

  service: {
    query: {
      isLoading: boolean;
      children: ChildRespone;
    };
  };
}

const DataAnakPosyanduHeroSection: React.FC<
  DataAnakPosyanduHeroSectionProps
> = ({ namespace, service }) => {
  const resChildren = service.query.children;

  if (service.query.isLoading) {
    return <DataAnakSectionSkeleton />;
  }
  if (!resChildren) {
    return <DataNotFound />;
  }
  return (
    <div className="w-full min-h-screen flex justify-start items-center flex-col p-2 space-y-2">
      <div className="w-full flex justify-start items-center">
        <ChevronLeft
          onClick={() => namespace.router.back()}
          className="scale-120"
        />
        <h1 className="text-2xl font-bold">Data Anak</h1>
      </div>
      <div className="w-full flex flex-col border rounded-lg">
        <div className="w-full flex  items-center justify-start bg-primary rounded-lg border p-2">
          <Icon
            icon="ph:baby"
            width="24"
            height="24"
            className="text-background"
          />
          <h1 className="font-bold text-lg text-background">Data Diri</h1>
        </div>
        <div className="flex justify-center items-center p-4 flex-col ">
          <Image
            alt="child"
            src={resChildren.avaChild ? resChildren.avaChild : "/avatars/1.png"}
            width={250}
            height={250}
            className="rounded-full aspect-square object-cover"
          />

          <div className="w-full space-y-3">
            <label className="text-lg font-bold">Nama Lengkap</label>
            <Input value={resChildren.fullName} disabled type="text" />
            <label className="text-lg font-bold">Tempat/Tanggal Lahir</label>
            <div className="w-full grid grid-cols-2 grid-rows-1 items-center gap-4">
              <Input value={resChildren.placeOfBirth} disabled type="text" />
              <Input value={resChildren.dateOfBirth} disabled type="date" />
            </div>
            <div className="w-full">
              <h1 className="text-lg font-bold">Jenis Kelamin</h1>
              <Select value={resChildren.gender} disabled>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Jenis Kelamin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Peran</SelectLabel>
                    <SelectItem value="MALE">Laki - Laki</SelectItem>
                    <SelectItem value="FEMALE">Perempuan</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataAnakPosyanduHeroSection;
