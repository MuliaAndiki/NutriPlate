import ComingSoon from "@/components/card/comingsoon/comingsoon";
import { ChevronLeft } from "lucide-react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

interface AboutSoftwareSectionProps {
  namespace: {
    router: AppRouterInstance;
  };
}
const AboutSoftwareSection: React.FC<AboutSoftwareSectionProps> = ({
  namespace,
}) => {
  return (
    <section className="w-full min-h-screen flex justify-start flex-col items-center ">
      <ComingSoon router={namespace.router} />
    </section>
  );
};

export default AboutSoftwareSection;
