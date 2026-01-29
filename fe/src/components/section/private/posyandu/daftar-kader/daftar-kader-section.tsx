import { Icon } from "@iconify/react/dist/iconify.js";
import { ChevronLeft } from "lucide-react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import Link from "next/link";

interface DaftarKaderPosyanduSectionProps {
  namespace: {
    router: AppRouterInstance;
  };
}

const DaftarKaderPosyanduSection: React.FC<DaftarKaderPosyanduSectionProps> = ({
  namespace,
}) => {
  return (
    <section className="flex w-full min-h-screen flex-col items-center justify-start overflow-x-hidden p-2 space-y-2">
      <div className="w-full flex items-center justify-between ">
        <div className="w-full flex items-center">
          <ChevronLeft
            onClick={() => namespace.router.back()}
            className="scale-120"
          />
          <h1 className="text-2xl font-bold">Daftar Kader</h1>
        </div>
        <Link className=" h-auto" href={"/posyandu/daftar-kader/status"}>
          <Icon
            icon="fluent:status-12-filled"
            width="24"
            height="24"
            className="text-primary"
          />
        </Link>
      </div>
    </section>
  );
};

export default DaftarKaderPosyanduSection;
