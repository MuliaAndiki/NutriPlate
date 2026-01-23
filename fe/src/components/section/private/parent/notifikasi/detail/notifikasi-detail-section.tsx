import { DefaultNotifIcon, NotifiIcon } from "@/types/icons";
import { NotificationDetailResponse } from "@/types/res";
import { formatDateTime } from "@/utils/time.format";
import { Icon } from "@iconify/react";
import { ChevronLeft } from "lucide-react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

interface NotifikasiDetailSectionProps {
  namespace: {
    router: AppRouterInstance;
  };
  service: {
    query: {
      notifikasi: NotificationDetailResponse;
      isLoading: boolean;
    };
  };
}

const NotifikasiDetailSection: React.FC<NotifikasiDetailSectionProps> = ({
  namespace: { router },
  service: {
    query: { notifikasi, isLoading },
  },
}) => {
  if (isLoading) return <div>loading...</div>;

  const { icon, className } = NotifiIcon[notifikasi.type] ?? DefaultNotifIcon;

  return (
    <section className="w-full min-h-screen flex flex-col items-center p-2">
      <div className="w-full flex items-center gap-2">
        <ChevronLeft
          onClick={() => router.back()}
          className="cursor-pointer scale-110"
        />
        <h1 className="text-2xl font-bold">Notifikasi</h1>
      </div>

      <div className="w-full flex flex-col items-center mt-4 gap-4">
        <div className="w-full flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-full border flex items-center justify-center ${className}`}
          >
            <Icon icon={icon} width={34} height={34} />
          </div>

          <div className="flex flex-col">
            <h2 className="text-2xl font-bold">{notifikasi.title}</h2>
            <p className="text-sm font-light">
              {formatDateTime(notifikasi.createdAt, { style: "time" })} yang
              lalu
            </p>
          </div>
        </div>

        <div className="w-full">
          <p className="text-justify">{notifikasi.message}</p>
        </div>
      </div>
    </section>
  );
};

export default NotifikasiDetailSection;
