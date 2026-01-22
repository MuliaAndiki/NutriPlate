import HeaderHomeSvg from "@/components/svg/header-home";
import IconPlate from "@/components/svg/icon-plate";
import IconRuler from "@/components/svg/icon-ruler";
import IconScale from "@/components/svg/icon.scale";
import { IAuth } from "@/types/schema/auth.schema";
import { Icon } from "@iconify/react/dist/iconify.js";
import Link from "next/link";

interface HeaderHomeProps {
  res: IAuth;
  role: string;
}
const HeaderHomeCard: React.FC<HeaderHomeProps> = ({ res, role }) => {
  return (
    <section className="relative min-h-[35vh] w-full">
      <div className="absolute inset-0 z-0">
        <HeaderHomeSvg />

        <div className="w-45 h-45 rounded-full bg-background absolute -right-10 top-37">
          <div className="w-27 h-27 bg-primary rounded-full translate-x-8 translate-y-8 flex justify-center items-center">
            <Icon
              icon="lucide:baby"
              width="70"
              height="70"
              className="text-background"
            />
          </div>
        </div>

        <div className="p-3 rounded-xl bg-background absolute top-15 -right-3">
          <Link href={`/${role.toLocaleLowerCase()}/notifikasi`}>
            <Icon
              icon="mdi:bell-outline"
              width="34"
              height="34"
              className="text-primary"
            />
          </Link>
        </div>

        <div className="absolute left-6 top-24">
          <h1 className="font-light text-background text-2xl">
            Selamat Datang
          </h1>
          <h1 className="font-bold text-background text-3xl">
            {res.fullName}!
          </h1>
        </div>

        <div className="absolute animate-float w-13 h-13 right-30 top-60">
          <IconRuler />
        </div>

        <div className="absolute animate-float-slow animate-float-delay-2 w-16 h-16 right-25 top-30">
          <IconScale />
        </div>

        <div className="absolute animate-float-fast animate-float-delay-1 w-15 h-15 right-5 top-29">
          <IconPlate />
        </div>
      </div>
    </section>
  );
};

export default HeaderHomeCard;
