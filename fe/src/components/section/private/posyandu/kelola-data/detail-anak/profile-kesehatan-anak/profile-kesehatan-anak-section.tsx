import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ProfileKesehatanAnakSectionSkeleton from "@/components/skeleton/private/posyandu/kelola-data/detail-anak/profile-kesehatan-anak/profile-kesehatan-anak-section-skeleton";
import DataNotFound from "@/components/empty/data-not-found";
import { Textarea } from "@/components/ui/textarea";
import { ChildRespone } from "@/types/res";
import { Icon } from "@iconify/react/dist/iconify.js";
import { ChevronLeft } from "lucide-react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

interface ProfileKesehatanAnakPosyanduSectionProps {
  namespace: {
    router: AppRouterInstance;
  };
  service: {
    query: {
      isLoading: boolean;
      children: ChildRespone;
    };
  };
}
const ProfileKesehatanAnakPosyanduSection: React.FC<
  ProfileKesehatanAnakPosyanduSectionProps
> = ({ namespace, service }) => {
  const resChildren = service.query.children;
  if (service.query.isLoading) {
    return <ProfileKesehatanAnakSectionSkeleton />;
  }
  if (!resChildren) {
    return <DataNotFound />;
  }
  return (
    <div className="w-full min-h-screen flex justify-start items-center flex-col p-2 space-y-2">
      <div className="w-full flex justify-start items-center">
        <ChevronLeft
          className="scale-120"
          onClick={() => namespace.router.back()}
        />
        <h1 className="text-2xl font-bold">Profile Kesehatan Anak</h1>
      </div>
      <form className="w-full h-auto">
        <div className="w-full  rounded-lg border flex flex-col  ">
          <div className="w-full p-2 bg-info  rounded-lg flex   items-center justify-start">
            <Icon
              icon="streamline-flex:health-care-2-remix"
              width="24"
              height="24"
              className="text-background"
            />
            <h1 className="text-lg text-background font-semibold">
              Profile Kesehatan Anak
            </h1>
          </div>
          <div className="w-full p-2 space-y-2 ">
            <div className="w-full flex gap-2 justify-between items-center">
              <div className="w-full flex flex-col justify-start items-start">
                <h1 className="text-lg font-bold">Berat Lahir</h1>
                <Input
                  placeholder="kg"
                  type="number"
                  required
                  disabled
                  value={resChildren.profileChild.birthWeightKg}
                />
              </div>
              <div className="w-full flex flex-col justify-start items-start">
                <h1 className="text-lg font-bold">Tinggi Lahir</h1>
                <Input
                  placeholder="cm"
                  type="number"
                  disabled
                  value={resChildren.profileChild.birthHeightCm}
                />
              </div>
            </div>
            <h1 className="text-lg font-bold">Alergi Makanan</h1>
            <Input
              placeholder="Masukkan Alergi makanan anak (optional)"
              value={resChildren.profileChild.allergicFoods}
              disabled
            />

            <h1 className="text-lg font-bold">Catatan Kesehatan</h1>
            <div className="w-full ">
              <Textarea
                placeholder="Masukan Catatan Kesehatan Anak"
                disabled
                value={resChildren.profileChild.chronicConditions}
              />
            </div>
            <h1 className="text-lg font-bold">Usia Kehamilan Saat Lahir</h1>
            <Input
              placeholder="minggu (contoh: 38)"
              type="number"
              disabled
              value={resChildren.profileChild.pregnancyAgeWeeks}
            />

            <div className="w-full grid grid-cols-2 grid-rows-1 gap-2  ">
              <div className="w-full">
                <h1 className="text-sm font-bold">Jenis Pemberian Makan</h1>
                <Select
                  disabled
                  key={resChildren.profileChild.feedingType}
                  value={resChildren.profileChild.feedingType}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Pilih Jenis Pemberian Makan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="ASI">ASI</SelectItem>
                      <SelectItem value="SUSU_FORMULA">Susu Formula</SelectItem>
                      <SelectItem value="CAMPURAN">Campuran</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="w-full">
                <h1 className="text-sm font-bold ">Tingkat Aktivitas Anak</h1>

                <Select
                  disabled
                  key={resChildren.profileChild.activityLevel}
                  value={resChildren.profileChild.activityLevel}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Pilih Tingkat Aktivitas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="RENDAH">Rendah</SelectItem>
                      <SelectItem value="SEDANG">Sedang</SelectItem>
                      <SelectItem value="TINGGI">Tinggi</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ProfileKesehatanAnakPosyanduSection;
