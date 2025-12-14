"use client";
import HomeHeroSection from "@/components/section/public/home-section";
import NavLayout from "@/core/layouts/nav.layout";

export default function ContainerHome() {
  return (
    <NavLayout>
      <main className="w-full min-h-screen overflow-x-hidden">
        <HomeHeroSection />
      </main>
    </NavLayout>
  );
}
