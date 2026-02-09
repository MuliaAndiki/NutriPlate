import { KaderDetailResponse } from "@/types/res";
import { ChevronLeft, Mail, Phone } from "lucide-react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import Image from "next/image";
import DetailKaderSectionSkeleton from "@/components/skeleton/private/posyandu/kelola-data/detail-kader/detail-kader-section-skeleton";
import DataNotFound from "@/components/empty/data-not-found";

interface DetailKaderPosyanduSectionProps {
  namespace: {
    router: AppRouterInstance;
  };
  service: {
    query: {
      kader: KaderDetailResponse;
      isLoading: boolean;
    };
  };
}

const DetailKaderPosyanduSection: React.FC<DetailKaderPosyanduSectionProps> = ({
  namespace,
  service,
}) => {
  const resKader = service.query.kader;

  if (service.query.isLoading) {
    return <DetailKaderSectionSkeleton />;
  }

  if (!resKader) {
    return <DataNotFound message="Data kader tidak ditemukan" />;
  }

  return (
    <section className="w-full min-h-screen flex flex-col p-4 space-y-4">
      <div className="flex items-center gap-2">
        <ChevronLeft
          className="cursor-pointer"
          onClick={() => namespace.router.back()}
        />
        <h1 className="text-lg font-bold">Detail Kader</h1>
      </div>
      <div className="w-full bg-background border rounded-xl shadow p-4 space-y-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full overflow-hidden bg-background flex items-center justify-center">
            <Image
              src={resKader.avaUrl ? resKader.avaUrl : "/avatars/1.png"}
              alt={resKader.fullName}
              width={64}
              height={64}
              className="object-cover"
            />
          </div>

          <div>
            <h2 className="text-base font-semibold">{resKader.fullName}</h2>
            <p className="text-xs text-muted-foreground">ID: {resKader.id}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-background">
            <Mail size={18} />
            <div>
              <p className="text-xs text-muted-foreground">Email</p>
              <p className="text-sm font-medium">{resKader.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-lg bg-background ">
            <Phone size={18} />
            <div>
              <p className="text-xs text-muted-foreground">No. HP</p>
              <p className="text-sm font-medium">{resKader.phone}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DetailKaderPosyanduSection;
