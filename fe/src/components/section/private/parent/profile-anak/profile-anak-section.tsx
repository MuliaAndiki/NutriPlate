import ChildCard from "@/components/card/child-card";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react/dist/iconify.js";
import Link from "next/link";

const ProfileAnakHeroSection = () => {
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

      <div className="w-full">{/* <ChildFallback /> */}</div>

      <div className="w-full flex items-center ">
        <Icon icon="ph:baby" width="30" height="30" className="text-primary" />
        <h1 className="text-lg font-extrabold">Daftar Anak</h1>
      </div>
      <div className="w-full">
        <ChildCard />
      </div>
    </div>
  );
};

export default ProfileAnakHeroSection;
