import { Icon } from "@iconify/react/dist/iconify.js";
import Link from "next/link";

import ChildCard from "@/components/card/child-card";
import ChildFallback from "@/components/fallback/child.fallback";
import { Button } from "@/components/ui/button";
import { ChildCardType } from "@/types/card";

interface ProfileAnakSectionProps {
  profileAnak: ChildCardType[];
}
const ProfileAnakHeroSection: React.FC<ProfileAnakSectionProps> = ({
  profileAnak,
}) => {
  return (
    <div className="w-full min-h-screen flex justify-start items-center flex-col p-2 space-y-2">
      <div className="w-full">
        <h1 className="text-3xl font-extrabold">Profile Anak</h1>
      </div>
      <p className="font-extrabold text-lg">
        Pantau tumbuh kembang dan asupan gizi anak Anda
      </p>
      <div className="w-full h-full ">
        <Link href={"/parent/profile-anak/form"}>
          <Button className="w-full flex  p-4 h-auto" variant={"btn"}>
            <Icon
              icon="ph:baby"
              width="256"
              height="256"
              className="scale-170"
            />
            <h1 className="font-semibold text-lg">Tambah Data Anak</h1>
          </Button>
        </Link>
      </div>

      <div className="w-full flex items-center ">
        <Icon icon="ph:baby" width="30" height="30" className="text-primary" />
        <h1 className="text-lg font-extrabold">Daftar Anak</h1>
      </div>

      {profileAnak.length > 0 ? (
        <div className="w-full flex flex-col space-y-3 ">
          {profileAnak.map((item) => (
            <ChildCard key={item.id} data={item} />
          ))}
        </div>
      ) : (
        <ChildFallback />
      )}
    </div>
  );
};

export default ProfileAnakHeroSection;
