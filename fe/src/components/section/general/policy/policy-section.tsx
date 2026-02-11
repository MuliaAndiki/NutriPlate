import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import ComingSoon from "@/components/card/comingsoon/comingsoon";
interface PolicySectionProps {
  namespace: {
    router: AppRouterInstance;
  };
}
const PolicySection: React.FC<PolicySectionProps> = ({ namespace }) => {
  return (
    <section className="w-full flex items-center flex-col justify-start min-h-screen overflow-x-hidden ">
      <ComingSoon router={namespace.router} />
    </section>
  );
};

export default PolicySection;
