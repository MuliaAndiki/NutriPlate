import ProgresListCard from "@/components/card/program/program-list";
import { Spinner } from "@/components/ui/spinner";
import { ButtonWrapper } from "@/components/wrapper/ButtonWrapper";
import { ProgresRespone } from "@/types/res";
import { ChevronLeft } from "lucide-react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

interface ProgresDetailSectionProps {
  namespace: {
    router: AppRouterInstance;
    pathname: string;
  };
  service: {
    mutation: {
      isPending: boolean;
      onCancelPropgram: () => void;
    };
    query: {
      progres: ProgresRespone;
      isLoading: boolean;
    };
  };
}
const ProgresDetailSection: React.FC<ProgresDetailSectionProps> = ({
  namespace,
  service,
}) => {
  if (service.query.isLoading) {
    return <div>loading...</div>;
  }
  return (
    <section className="w-full min-h-screen overflow-x-hidden flex items-center justify-start flex-col space-y-2 p-2">
      <div className="w-full flex items-center justify-between">
        <div className="w-full flex items-center">
          <ChevronLeft
            onClick={() => namespace.router.back()}
            width={36}
            height={36}
          />
          <h1 className="font-bold text-xl">Detail Program</h1>
        </div>
        <ButtonWrapper
          variant={"destructive"}
          disabled={service.mutation.isPending}
          onClick={() => service.mutation.onCancelPropgram()}
          className="text-background"
        >
          {service.mutation.isPending ? <Spinner /> : "Batalkan Program"}
        </ButtonWrapper>
      </div>
      <div className="w-full">
        <ProgresListCard
          key={service.query.progres.id}
          res={service.query.progres}
          pathname={namespace.pathname}
        />
      </div>
      <div>{/* content */}</div>
    </section>
  );
};

export default ProgresDetailSection;
