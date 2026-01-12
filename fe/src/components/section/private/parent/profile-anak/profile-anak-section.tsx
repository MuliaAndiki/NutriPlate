import { Icon } from "@iconify/react/dist/iconify.js";
import Link from "next/link";

import ChildCard from "@/components/card/child-card";
import ChildFallback from "@/components/fallback/child.fallback";
import { Button } from "@/components/ui/button";
import { ChildCardType } from "@/types/card";
import { ButtonWrapper } from "@/components/wrapper/ButtonWrapper";

interface ProfileAnakSectionProps {
  servive: {
    query: {
      profileAnak: ChildCardType[];
    };
  };
}
const ProfileAnakHeroSection: React.FC<ProfileAnakSectionProps> = ({
  servive,
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
          <ButtonWrapper
            className="w-full font-semibold text-lg p-4 h-auto"
            variant={"btn"}
            startIcon={
              <Icon
                icon="ph:baby"
                width="256"
                height="256"
                className="scale-170"
              />
            }
          >
            Tambah Data Anak
          </ButtonWrapper>
        </Link>
      </div>

      <div className="w-full flex items-center ">
        <Icon icon="ph:baby" width="45" height="45" className="text-primary" />
        <h1 className="text-2xl font-extrabold">Daftar Anak</h1>
      </div>

      {servive.query.profileAnak.length > 0 ? (
        <div className="w-full flex flex-col space-y-3 ">
          {servive.query.profileAnak.map((item) => (
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
