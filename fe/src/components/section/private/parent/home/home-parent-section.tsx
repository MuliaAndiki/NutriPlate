import HeaderHomeCard from "@/components/card/general/header/home";
import CardKontenHomeParent from "@/components/card/general/home-parent/card-content";
import CardKontenHomeParent2 from "@/components/card/general/home-parent/card-content2";
import CardKontenHomeParent3 from "@/components/card/general/home-parent/card-content3";
import CardKontenHomeParent4 from "@/components/card/general/home-parent/card-content4";
import { UserResponse } from "@/types/res";
import { Icon } from "@iconify/react/dist/iconify.js";

interface HomeParentSectionProps {
  service: {
    query: {
      profile: UserResponse;
      isLoading: boolean;
    };
  };
}

const HomeParentHeroSection: React.FC<HomeParentSectionProps> = ({
  service,
}) => {
  if (service.query.isLoading) {
    return <div>loading</div>;
  }
  return (
    <div className="w-full overflow-hidden">
      <HeaderHomeCard
        res={service.query.profile ?? null}
        role={service.query.profile.role}
      />
      <section className="relative z-10 bg-background px-4 py-6 rounded-t-3xl -mt-6 space-y-1">
        <CardKontenHomeParent />
        <div className="w-full flex items-center flex-col space-y-4 ">
          <div className="w-full flex items-center flex-col">
            <div className="w-full flex items-center">
              <Icon
                icon="flowbite:star-solid"
                width="36"
                height="36"
                className="text-primary"
              />
              <h1 className="text-2xl font-bold">Fitur Utama Aplikasi</h1>
            </div>

            <p className="font-light text-sm">
              Lengkapi data anak untuk mulai menggunakan semua fitur.
            </p>
          </div>

          <CardKontenHomeParent2 />
          <CardKontenHomeParent3 />
          <CardKontenHomeParent4 />
        </div>
      </section>
    </div>
  );
};

export default HomeParentHeroSection;
