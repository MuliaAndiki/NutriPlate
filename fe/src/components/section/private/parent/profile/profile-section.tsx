import { IAuth } from "@/types/schema/auth.schema";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react/dist/iconify.js";
import Link from "next/link";
import ProfileSectionSkeleton from "@/components/skeleton/private/parent/profile/profile-section-skeleton";
import DataNotFound from "@/components/empty/data-not-found";
import { Spinner } from "@/components/ui/spinner";

export interface ProfileProps {
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
}

const ProfileParentHeroSection: React.FC<ProfileProps> = ({ service }) => {
  const resProfile = service.query.userProfileType;

  if (service.query.isLoading) {
    return <ProfileSectionSkeleton />;
  }

  if (!resProfile) {
    return <DataNotFound />;
  }

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
    {
      title: "Personalisasi & Bahasa",
      icon: "uil:setting",
      icon2: "mingcute:arrow-right-fill",
      href: "/setting",
    },
    {
      title: "Kebijakan Privasi",
      icon: "ic:outline-policy",
      icon2: "mingcute:arrow-right-fill",
      href: "/policy",
    },
    {
      title: "Tentang Aplikasi",
      icon: "mdi:about-circle-outline",
      icon2: "mingcute:arrow-right-fill",
      href: "/about",
    },
  ];

  return (
    <div className="relative w-full min-h-screen flex flex-col p-4 overflow-hidden bg-background">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-chart-2/5" />

      <div className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-primary/20 blur-3xl animate-float opacity-70" />
      <div className="absolute -bottom-40 -right-40 h-[550px] w-[550px] rounded-full bg-chart-2/20 blur-3xl animate-float-slow animate-float-delay-2 opacity-70" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 h-60 w-60 rounded-full bg-chart-3/20 blur-2xl animate-float-fast animate-float-delay-1 opacity-60" />

      <div className="absolute inset-0 backdrop-blur-[2px]" />

      <div className="relative z-10 w-full flex flex-col h-full">
        <div className="w-full flex flex-col items-center space-y-6 rounded-2xl bg-card/70  border border-border p-6 shadow-enhanced">
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
        </div>

        <div className="w-full flex flex-col flex-1 justify-between mt-6">
          <div className="w-full flex flex-col space-y-3">
            {Routing.map((items, key) => (
              <Button
                key={key}
                className="w-full justify-start h-auto p-0 hover-lift"
                variant="liner"
              >
                <Link
                  href={items.href}
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
            className="w-full mt-6"
            variant="destructive"
            disabled={service.mutation.isPending}
            onClick={() => service.mutation.onLogout()}
          >
            {service.mutation.isPending ? <Spinner /> : "Keluar"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProfileParentHeroSection;
