import { Icon } from "@iconify/react";

import { NagivationType } from "@/types/ui";

export const NavigationParent: NagivationType[] = [
  {
    name: "Home",
    icon: <Icon icon="streamline-ultimate:house-4-bold" />,
    href: "/parent/home",
  },
  {
    name: "Profile Anak",
    icon: <Icon icon="healthicons:child-program" />,
    href: "/parent/profile-anak",
  },
  {
    name: "Asupan Gizi",
    icon: <Icon icon="fa7-solid:cutlery" />,
    href: "/parent/asupan-gizi",
  },
  {
    name: "Programs",
    icon: <Icon icon="hugeicons:note" />,
    href: "#",
  },
  {
    name: "Profile",
    icon: <Icon icon="mdi:account-outline" />,
    href: "#",
  },
];

export const NavigationKader: NagivationType[] = [
  //
];

export const NavigationPosyandu: NagivationType[] = [
  //
];

export const NavigationAdmin: NagivationType[] = [
  //
];
