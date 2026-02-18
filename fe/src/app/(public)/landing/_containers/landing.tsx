import LandingSection from "@/components/section/public/landing/lading-section";
import NavLayout from "@/core/layouts/nav.layout";

export default function LandingContainer() {
  return (
    <NavLayout>
      <main className="w-full min-h-screen">
        <LandingSection />
      </main>
    </NavLayout>
  );
}
