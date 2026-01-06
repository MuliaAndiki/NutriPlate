import { IAuth } from "@/types/schema/auth.schema";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react/dist/iconify.js";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
export interface ProfileProps {
  userProfileType: IAuth;
}
const ProfileParentHeroSection: React.FC<ProfileProps> = ({
  userProfileType,
}) => {
  // Bikin Routeing lalu map
  return (
    <div className="w-full min-h-full flex justify-start items-start flex-col">
      <h1 className="text-2xl font-extrabold">Akun</h1>
      <div className="w-full flex justify-center items-center flex-col space-y-5">
        <Image
          alt="profile"
          src={userProfileType.photoUrl ?? "/avatars/1.png"}
          width={150}
          height={150}
          className="object-cover rounded-full"
        />

        <h1 className="text-2xl font-bold">{userProfileType.fullName}</h1>
        <h1 className="font-light">
          {userProfileType.email ?? userProfileType.phone}
        </h1>
      </div>
      <div className="w-full my-2 flex justify-center items-center">
        <Button
          className="w-full flex items-center justify-between p-1 h-auto"
          variant={"liner"}
        >
          <div className="flex h-auto justify-start items-center w-full ">
            <Icon
              icon="mage:edit"
              width="104"
              height="104"
              className="text-primary "
            />
            <h1 className="text-lg font-semibold">Edit Profile</h1>
          </div>
          <ChevronRight />
        </Button>
      </div>
    </div>
  );
};
export default ProfileParentHeroSection;
