import ProgramPosyanduSection from "@/components/section/private/posyandu/program/program-section";
import { SidebarLayout } from "@/core/layouts/sidebar.layout";

const ProgramPosyanduContainer = () => {
  return (
    <SidebarLayout>
      <main className="w-full min-h-screen">
        <ProgramPosyanduSection />
      </main>
    </SidebarLayout>
  );
};

export default ProgramPosyanduContainer;
