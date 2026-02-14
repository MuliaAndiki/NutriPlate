import { Icon } from "@iconify/react";
import { NagivationType } from "@/types/ui";

const routing = {
  parent: "/parent",
  kader: "/kader",
  posyandu: "/posyandu",
  admin: "/admin",
};
export const NavigationParent: NagivationType[] = [
  {
    name: "Home",
    icon: <Icon icon="streamline-ultimate:house-4-bold" />,
    href: `${routing.parent}/home`,
  },
  {
    name: "Profile Anak",
    icon: <Icon icon="healthicons:child-program" />,
    href: `${routing.parent}/profile-anak`,
  },
  {
    name: "Asupan Gizi",
    icon: <Icon icon="fa7-solid:cutlery" />,
    href: `${routing.parent}/asupan-gizi`,
  },
  {
    name: "Programs",
    icon: <Icon icon="hugeicons:note" />,
    href: `${routing.parent}/program`,
  },
  {
    name: "Profile",
    icon: <Icon icon="mdi:account-outline" />,
    href: `${routing.parent}/profile`,
  },
];

export const NavigationKader: NagivationType[] = [
  {
    name: "Beranda",
    icon: <Icon icon="fa7-solid:house" />,
    href: `${routing.kader}/home`,
  },
  {
    name: "Daftar Balita",
    icon: <Icon icon="healthicons:child-program" />,
    href: `${routing.kader}/daftar-balita`,
  },
  {
    name: "Laporan",
    icon: <Icon icon="proicons:note" />,
    href: `${routing.kader}/laporan`,
  },
  {
    name: "Akun",
    icon: <Icon icon="mdi:user" />,
    href: `${routing.kader}/profile`,
  },
];

export const NavigationPosyandu: NagivationType[] = [
  {
    name: "Beranda",
    icon: <Icon icon="fa7-solid:house" />,
    href: `${routing.posyandu}/home`,
  },
  {
    name: "Kelola Data",
    icon: <Icon icon="healthicons:child-program" />,
    href: `${routing.posyandu}/kelola-data`,
  },
  {
    name: "Pengukuran",
    icon: <Icon icon="ion:scale-sharp" />,
    href: `${routing.posyandu}/pengukuran`,
  },
  {
    name: "Program",
    icon: <Icon icon="proicons:note" />,
    href: `${routing.posyandu}/program`,
  },
  {
    name: "Akun",
    icon: <Icon icon="mdi:user" />,
    href: `${routing.posyandu}/profile`,
  },
];

export const NavigationAdmin: NagivationType[] = [
  //
];
