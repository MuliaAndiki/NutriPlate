import { IAuth } from "@/types/schema";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import ProfileSkeleton from "@/components/skeleton/private/posyandu/profile/profile-skeleton";
import DataNotFound from "@/components/empty/data-not-found";
import Link from "next/link";
import { Spinner } from "@/components/ui/spinner";
import { Icon } from "@iconify/react/dist/iconify.js";
import { RoutingProfile } from "@/configs/app.config";
import { AlertContexType } from "@/types/ui";

interface ProfilePosyanduProps {
  namespace: {
    alert: AlertContexType;
  };
  service: {
    mutation: {
      onLogout: () => void;
      isPending: boolean;
    };
    query: {
      userProfileType: IAuth;
      isLoading: boolean;
    };
  };
  selector: {
    role: string;
  };
}
const ProfilePosyanduSection: React.FC<ProfilePosyanduProps> = ({
  service,
  selector,
  namespace,
}) => {
  const resProfile = service.query.userProfileType;

  if (!resProfile) {
    return <DataNotFound />;
  }
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
      <div className="w-full flex flex-col flex-1 justify-between mt-6">
        <div className="w-full flex flex-col space-y-3">
          {RoutingProfile.map((items, key) => (
            <Button
              key={key}
              className="w-full justify-start h-auto p-0 hover-lift"
              variant="liner"
            >
              <Link
                href={
                  items.href
                    ? items.href(selector.role.toLocaleLowerCase())
                    : "#"
                }
                className="w-full flex items-center justify-between p-4"
              >
                <div className="flex items-center space-x-4">
                  <Icon
                    icon={items.icon}
                    width={28}
                    height={28}
                    className="text-primary"
                  />
                  <span className="text-base font-semibold">{items.title}</span>
                </div>
                <Icon icon={items.icon2} width={22} height={22} />
              </Link>
            </Button>
          ))}
        </div>

        <Button
          className="w-full mt-6 text-background"
          variant="destructive"
          disabled={service.mutation.isPending}
          onClick={() =>
            namespace.alert.confirm({
              title: "Yakin keluar dari akun NutriPlate?",
              deskripsi: "Anda harus login kembali untuk menggunakan aplikasi",
              icon: "warning",
              onConfirm: () => {
                service.mutation.onLogout();
              },
            })
          }
        >
          {service.mutation.isPending ? <Spinner /> : "Keluar"}
        </Button>
      </div>
    </div>
  );
};

export default ProfilePosyanduSection;
