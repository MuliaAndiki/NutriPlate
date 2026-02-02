"use client";
import SettingSection from "@/components/section/general/setting/setting-section";
import { useAppNameSpace } from "@/hooks/useAppNameSpace";

const SettingContainer = () => {
  const namespace = useAppNameSpace();

  return (
    <main className="w-full min-h-screen">
      <SettingSection
        namespace={{
          router: namespace.router,
        }}
      />
    </main>
  );
};

export default SettingContainer;
