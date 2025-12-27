import ChildCard from "@/components/card/child-card";
import ProfileChildCard from "@/components/card/profile-child";
import StatusAsupan from "@/components/card/status-asupan";
import { Button } from "@/components/ui/button";
import { ProfileChildType } from "@/types/card";
import { Icon } from "@iconify/react/dist/iconify.js";
import Link from "next/link";

interface ProfileChildProps {
  profileChild: ProfileChildType[];
}

const ProfileAnakHeroSection: React.FC<ProfileChildProps> = ({
  profileChild,
}) => {
  const ButtonData = [
    {
      icon: (
        <Icon icon="ph:baby" width="256" height="256" className="scale-130" />
      ),
      title: "Data Anak",
      icon2: (
        <Icon
          icon="mingcute:arrow-right-fill"
          width="24"
          height="24"
          className="scale-150 text-end "
        />
      ),
      href: "#",
    },
    {
      icon: (
        <Icon icon="ph:baby" width="256" height="256" className="scale-130" />
      ),
      title: "Data Anak",
      icon2: (
        <Icon
          icon="mingcute:arrow-right-fill"
          width="24"
          height="24"
          className="scale-150 text-end "
        />
      ),
      href: "#",
    },
    {
      icon: (
        <Icon icon="ph:baby" width="256" height="256" className="scale-130" />
      ),
      title: "Data Anak",
      icon2: (
        <Icon
          icon="mingcute:arrow-right-fill"
          width="24"
          height="24"
          className="scale-150 text-end "
        />
      ),
      href: "#",
    },
  ];
  return (
    <div className="w-full min-h-screen flex justify-start items-center flex-col p-2">
      <div className="w-full flex  flex-col space-y-4">
        <div className="w-full flex justify-between items-start">
          <h1 className="text-3xl font-bold">Profil Anak</h1>
          <Button variant={"btn"} className="w-auto flex items-center">
            <Icon
              icon="material-symbols:child-care-outline"
              width="50"
              height="50"
            />
            <h1 className="text-lg">Tambah Data Anak</h1>
          </Button>
        </div>

        <div className="w-full flex">
          <h1 className="text-lg font-bold">
            Pantau tumbuh kembang dan asupan gizi anak Anda
          </h1>
        </div>
        <div className="w-full">
          <ChildCard />
        </div>
        <div className="w-full flex justify-between items-center">
          <h1 className="font-extralight text-xs">Terakhir Diperbarui</h1>
          <h1 className="font-extralight text-xs">09 Juli 2025 14.39 WIB</h1>
        </div>
        <div className="w-full grid grid-cols-3 grid-rows-1 justify-center items-center gap-2">
          {profileChild.map((items) => (
            <ProfileChildCard data={items} key={items.id} />
          ))}
        </div>
        <div className="w-full space-y-4">
          <div className="w-full flex items-center space-x-1">
            <Icon
              icon="streamline:task-list-remix"
              width="25"
              height="25"
              className="text-primary"
            />
            <h1 className="text-xl font-extrabold">Data Pertumbuhan Anak</h1>
          </div>
          <p className="font-light">
            Kelola informasi, kesehatan, dan pertumbuhan anak
          </p>
          <div className="w-full h-auto  space-y-2 ">
            {ButtonData.map((items, key) => (
              <Button variant={"btn"} className="w-full h-auto " key={key}>
                <Link href={items.href} className="w-full h-auto  ">
                  <div className="w-full grid grid-cols-2 grid-rows-1 items-center ">
                    <div className="w-full flex justify-start items-center space-x-1">
                      {items.icon}
                      <h1 className="text-lg font-extrabold">Data Anak</h1>
                    </div>
                    <div className="w-full border  flex justify-end">
                      {items.icon2}
                    </div>
                  </div>
                </Link>
              </Button>
            ))}
          </div>
          <div className="w-full">
            <div className="w-full flex justify-start items-center space-x-2">
              <Icon
                icon="lsicon:rice-outline"
                width="36"
                height="36"
                className="text-primary"
              />
              <h1 className="text-2xl font-bold">Asupan Gizi Hari Ini</h1>
            </div>
            <p className="font-light">
              Kondisi gizi anak berdasarkan makanan hari ini
            </p>
            <div className="w-full mb-15">
              <StatusAsupan />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileAnakHeroSection;
