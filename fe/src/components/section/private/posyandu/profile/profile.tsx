import { IAuth } from "@/types/schema";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import ProfileSkeleton from "@/components/skeleton/private/posyandu/profile/profile-skeleton";

interface ProfilePosyanduProps {
  service: {
    mutation: {
      onLogout: () => void;
    };
    query: {
      userProfileType: IAuth;
      isLoading: boolean;
    };
  };
}
const ProfilePosyanduSection: React.FC<ProfilePosyanduProps> = ({
  service,
}) => {
  if (service.query.isLoading) {
    return <ProfileSkeleton />;
  }
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
          {/*  */}
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

export default ProfilePosyanduSection;
