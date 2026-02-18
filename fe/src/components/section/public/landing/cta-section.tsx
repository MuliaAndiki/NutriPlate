import AppStore from "@/components/svg/app-store";
import PhoneLeft from "@/components/svg/phone-left";
import PhoneRight from "@/components/svg/phone-right";
import PlayStore from "@/components/svg/play-store";
import { PWAInstallDialog } from "@/components/pwa/PWAInstallDialog";

const CtaSection = () => {
  return (
    <section className="w-full py-16 md:py-20" data-aos="fade-up">
      <div className="mx-auto w-full max-w-6xl px-6">
        <div className="relative overflow-hidden rounded-[32px] bg-[linear-gradient(135deg,var(--secondary)_0%,var(--primary)_100%)] text-primary-foreground">
          <div className="absolute left-10 bottom-0 hidden md:block w-52 md:w-72 lg:w-20 -translate-y-15 ">
            <PhoneLeft />
          </div>
          <div className="absolute left-50 bottom-0 hidden md:block w-52 md:w-72 lg:w-40 translate-y-15 ">
            <PhoneRight />
          </div>

          <div className="relative z-10 ml-auto flex max-w-xl flex-col gap-4 px-8 py-10 sm:px-10 sm:py-12 md:px-12 md:py-16">
            <h2 className="text-2xl font-bold sm:text-3xl text-center md:text-left">
              Download NutriPlate
            </h2>
            <p className="text-sm text-primary-foreground/80 text-center md:text-left">
              Unduh aplikasi NutriPlate agar pemantauan gizi, notifikasi, dan
              data pertumbuhan anak selalu mudah diakses kapan pun dibutuhkan.
            </p>
            <div className="flex flex-wrap items-center gap-4 justify-center md:justify-start">
              <PWAInstallDialog
                trigger={
                  <button
                    type="button"
                    className="rounded-md bg-white px-5 py-2.5 text-sm font-semibold text-primary shadow-sm transition hover:bg-white/90"
                  >
                    Download Aplikasi
                  </button>
                }
              />
              <div className="flex items-center gap-3">
                <PlayStore />
                <AppStore />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;
