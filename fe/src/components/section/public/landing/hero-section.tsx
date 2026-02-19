"use client";

import AppStore from "@/components/svg/app-store";
import IconPlate from "@/components/svg/icon-plate";
import IconRuler from "@/components/svg/icon-ruler";
import IconScale from "@/components/svg/icon.scale";
import PhoneMockup from "@/components/svg/phone-mockup";
import PlayStore from "@/components/svg/play-store";
import { PWAInstallDialog } from "@/components/pwa/PWAInstallDialog";
import { ButtonWrapper } from "@/components/wrapper/ButtonWrapper";

const HeroSection = () => {
  return (
    <section className="w-full min-h-screen flex items-center justify-center px-6 py-16 md:px-10 md:py-20 lg:p-20 ">
      <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div
          className="w-full flex items-start flex-col justify-center space-y-4"
          data-aos="fade-right"
        >
          <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold">
            Pantau Gizi & Tumbuh Kembang Anak dengan NutriPlate
          </h1>
          <p className="text-base md:text-lg lg:text-xl font-light text-foreground/60 text-justify lg:text-wrap">
            Aplikasi resmi bagi orang tua dan posyandu untuk memantau asupan
            gizi harian, pertumbuhan fisik, serta kondisi kesehatan balita
            secara terintegrasi, mudah dipahami, dan berbasis data yang akurat.
          </p>
          <div className="flex  items-start flex-col space-y-3 w-full lg:w-auto">
            <PWAInstallDialog
              trigger={
                <ButtonWrapper className="w-full ">
                  Download Aplikasi
                </ButtonWrapper>
              }
            />
            <div className="w-full flex flex-wrap items-center gap-4 justify-center">
              <PlayStore />
              <AppStore />
            </div>
          </div>
        </div>
        <div
          className="w-full h-full flex justify-center relative"
          data-aos="fade-left"
        >
          <div className="absolute animate-float w-12 h-12 md:w-15 md:h-15 bottom-16 left-6 md:bottom-50 md:left-30">
            <IconRuler />
          </div>

          <div className="absolute animate-float-slow animate-float-delay-2 w-16 h-16 md:w-20 md:h-20 bottom-6 left-16 md:bottom-15 md:left-40">
            <IconScale />
          </div>

          <div className="absolute animate-float-fast animate-float-delay-1 w-20 h-20 md:w-25 md:h-25 top-8 right-6 md:top-65 md:right-50">
            <IconPlate />
          </div>
          <div className="w-[280px] h-[280px] sm:w-[360px] sm:h-[360px] md:w-[460px] md:h-[460px] lg:w-[550px] lg:h-[550px]">
            <PhoneMockup />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
