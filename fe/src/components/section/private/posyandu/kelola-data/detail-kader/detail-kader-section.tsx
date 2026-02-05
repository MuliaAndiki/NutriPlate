import { ChevronLeft } from "lucide-react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

interface DetailKaderPosyanduSectionProps {
  namespace: {
    router: AppRouterInstance;
  };
}
const DetailKaderPosyanduSection: React.FC<DetailKaderPosyanduSectionProps> = ({
  namespace,
}) => {
  return (
    <section className="w-full min-h-screen flex flex-col p-2 space-y-2">
      <div className="w-full flex items-center">
        <ChevronLeft
          className="cursor-pointer"
          onClick={() => namespace.router.back()}
        />
        <h1 className="text-lg font-bold">Detail Kader</h1>
      </div>
    </section>
  );
};

export default DetailKaderPosyanduSection;
