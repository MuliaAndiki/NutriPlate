import { ChevronLeft } from "lucide-react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

interface PolicySectionProps {
  namespace: {
    router: AppRouterInstance;
  };
}
const PolicySection: React.FC<PolicySectionProps> = ({ namespace }) => {
  return (
    <section className="w-full flex items-center flex-col justify-start min-h-screen overflow-x-hidden p-2">
      <div className="w-full flex items-center">
        <ChevronLeft
          onClick={() => namespace.router.back()}
          className="scale-120"
        />
        <h1 className="text-2xl font-bold">Kebijakan Privasi</h1>
      </div>
      <div className="w-full">initial content</div>
    </section>
  );
};

export default PolicySection;
