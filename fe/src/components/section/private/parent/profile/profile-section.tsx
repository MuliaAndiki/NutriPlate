import { IAuth } from "@/types/schema/auth.schema";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react/dist/iconify.js";
import Link from "next/link";
export interface ProfileProps {
  service: {
    mutation: {
      onLogout: () => void;
    };
    query: {
      userProfileType: IAuth;
    };
  };
}
const ProfileParentHeroSection: React.FC<ProfileProps> = ({ service }) => {
  const Routing = [
    {
      title: "Edit Profile",
      icon: "akar-icons:edit",
      icon2: "mingcute:arrow-right-fill",
      href: "/parent/profile/edit-profile",
    },
    {
      title: "Ubah Kata Sandi",
      icon: "material-symbols:lock-outline",
      icon2: "mingcute:arrow-right-fill",
      href: "/parent/profile/ubah-password",
    },
  ];
  return (
    <div className="w-full min-h-full flex justify-start items-start flex-col p-2">
      <div className="w-full flex justify-center items-center flex-col space-y-5">
        <Image
          alt="profile"
          src={service.query.userProfileType.avaUrl ?? "/avatars/1.png"}
          width={150}
          height={150}
          className="object-cover rounded-full"
        />

        <h1 className="text-2xl font-bold">
          {service.query.userProfileType.fullName}
        </h1>
        <h1 className="font-light">
          {service.query.userProfileType.email ??
            service.query.userProfileType.phone}
        </h1>
      </div>
      <div className="w-full flex flex-col h-full max-h-lg  items-center justify-between">
        <div className="w-full my-2 flex  space-y-2 justify-center flex-col items-center">
          {Routing.map((items, key) => (
            <Button
              className="w-full flex items-start  justify-start p-1 h-auto"
              key={key}
              variant={"liner"}
            >
              <Link
                className="w-full flex items-center justify-between h-auto p-2"
                href={items.href}
              >
                <div className="flex h-auto justify-start items-center w-full space-x-4 ">
                  <Icon
                    icon={items.icon}
                    width={34}
                    height={34}
                    className="text-primary scale-150 "
                  />
                  <h1 className="text-lg font-semibold">{items.title}</h1>
                </div>
                <Icon icon={items.icon2} width={34} height={34} />
              </Link>
            </Button>
          ))}
        </div>

        <Button
          className="w-full"
          variant={"destructive"}
          onClick={() => service.mutation.onLogout()}
        >
          Keluar
        </Button>
      </div>
    </div>
  );
};
export default ProfileParentHeroSection;
