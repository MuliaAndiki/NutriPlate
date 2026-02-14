"use client";
import PolicySection from "@/components/section/general/policy/policy-section";
import { useAppNameSpace } from "@/hooks/useAppNameSpace";

const PolicyContainer = () => {
  const namespace = useAppNameSpace();

  return (
    <main className="w-full min-h-screen">
      <PolicySection
        namespace={{
          router: namespace.router,
        }}
      />
    </main>
  );
};

export default PolicyContainer;
