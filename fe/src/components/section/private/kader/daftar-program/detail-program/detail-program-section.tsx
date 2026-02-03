import { ProgramRespone } from "@/types/res";
import { camelCaseToWords } from "@/utils/string.format";
import { ChevronLeft } from "lucide-react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

interface DetailProgramKaderSectionProps {
  namespace: {
    router: AppRouterInstance;
  };
  service: {
    isLoading: boolean;
    program: ProgramRespone;
  };
}
const DetailProgramKaderSection: React.FC<DetailProgramKaderSectionProps> = ({
  namespace,
  service,
}) => {
  const res = service.program;
  // need fallback
  if (!res) {
    return <div>data tidak di temukan</div>;
  }
  if (service.isLoading) {
    return <div>loading...</div>;
  }
  return (
    <section className="-full min-h-screen flex justify-start items-center flex-col p-2 space-y-2">
      <div className="w-full flex items-center">
        <ChevronLeft
          className="scale-120"
          onClick={() => namespace.router.back()}
        />
        <h1 className="text-2xl font-bold">{camelCaseToWords(res.name)}</h1>
      </div>
    </section>
  );
};

export default DetailProgramKaderSection;
