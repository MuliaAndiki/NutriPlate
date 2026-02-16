import { IAuth } from "@/types/schema/auth.schema";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react/dist/iconify.js";
import Link from "next/link";
import ProfileSectionSkeleton from "@/components/skeleton/private/parent/profile/profile-section-skeleton";
import DataNotFound from "@/components/empty/data-not-found";
import { Spinner } from "@/components/ui/spinner";
import { RoutingProfile } from "@/configs/app.config";
import { AlertContexType } from "@/types/ui";

export interface ProfileProps {
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

const ProfileParentHeroSection: React.FC<ProfileProps> = ({
  service,
  selector,
  namespace,
}) => {
  const resProfile = service.query.userProfileType;

  if (service.query.isLoading) {
    return <ProfileSectionSkeleton />;
  }

  if (!resProfile) {
    return <DataNotFound />;
  }

  return (
    <div className="relative w-full min-h-screen flex flex-col p-4 overflow-hidden bg-background">
      <div className="relative z-10 w-full flex flex-col h-full items-center">
        <Image
          alt="profile"
          src={resProfile.avaUrl ?? "/avatars/1.png"}
          width={140}
          height={140}
          className="object-cover rounded-full aspect-square border-4 border-primary/20 shadow-enhanced"
        />

        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground">
            {resProfile.fullName}
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {resProfile.email ?? resProfile.phone}
          </p>
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
                    <span className="text-base font-semibold">
                      {items.title}
                    </span>
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
                deskripsi:
                  "Anda harus login kembali untuk menggunakan aplikasi",
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
    </div>
  );
};

export default ProfileParentHeroSection;
