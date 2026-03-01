"use client";
import TermsSection from "@/components/section/general/terms/terms-section";
import { useAppNameSpace } from "@/hooks/useAppNameSpace";

const TermsContainer = () => {
  const namespace = useAppNameSpace();
  return (
    <main className="w-full min-h-screen">
      <TermsSection
        namespace={{
          router: namespace.router,
        }}
      />
    </main>
  );
};

export default TermsContainer;
