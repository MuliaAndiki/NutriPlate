import DataNotFound from "@/components/empty/data-not-found";
import NotifikasiDetailSectionSkeleton from "@/components/skeleton/private/parent/notifikasi/detail/notifikasi-detail-section-skeleton";
import { Button } from "@/components/ui/button";
import { DefaultNotifIcon, NotifiIcon } from "@/types/icons";
import { NotificationDetailResponse } from "@/types/res";
import { AlertContexType } from "@/types/ui";
import { formatDateTime } from "@/utils/time.format";
import { Icon } from "@iconify/react";
import { ChevronLeft } from "lucide-react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

interface NotifikasiDetailPosyanduSectionProps {
  namespace: {
    router: AppRouterInstance;
    alert: AlertContexType;
  };
  service: {
    query: {
      notifikasi: NotificationDetailResponse | null;
      isLoading: boolean;
    };
    mutation: {
      onBroadcast: () => void;
      isPending: boolean;
    };
  };
}

const NotifikasiDetailPosyanduSection: React.FC<
  NotifikasiDetailPosyanduSectionProps
> = ({ namespace, service }) => {
  if (service.query.isLoading) return <NotifikasiDetailSectionSkeleton />;
  if (!service.query.notifikasi) return <DataNotFound />;

  const notifikasi = service.query.notifikasi;
  const { icon, className } = NotifiIcon[notifikasi.type] ?? DefaultNotifIcon;
  const isBroadcast = notifikasi.isBroadcast ?? false;

  return (
    <section className="w-full min-h-screen flex flex-col overflow-x-hidden p-2 space-y-4">
      <div className="w-full flex items-center">
        <ChevronLeft
          onClick={() => namespace.router.back()}
          className="scale-120"
        />
        <h1 className="text-2xl font-bold">Detail Notifikasi</h1>
      </div>

      <div className="w-full flex items-center gap-3">
        <div
          className={`w-12 h-12 rounded-full border flex items-center justify-center ${className}`}
        >
          <Icon icon={icon} width={34} height={34} />
        </div>
        <div className="flex flex-col">
          <h2 className="text-2xl font-bold">{notifikasi.title}</h2>
          <p className="text-sm text-muted-foreground">
            {formatDateTime(notifikasi.createdAt, { style: "time" })} yang lalu
          </p>
        </div>
      </div>

      <div className="w-full p-3 rounded-lg border">
        <p className="text-justify">{notifikasi.message}</p>
      </div>

      <div className="w-full flex items-center gap-2">
        {isBroadcast ? (
          <Button className="w-full" variant="outline" disabled>
            Sudah Broadcast
          </Button>
        ) : (
          <Button
            className="w-full"
            variant="btn"
            disabled={service.mutation.isPending}
            onClick={() =>
              namespace.alert.confirm({
                icon: "question",
                title: "Perhatian",
                deskripsi: "Broadcast notifikasi ini ke semua pengguna?",
                onConfirm: () => service.mutation.onBroadcast(),
              })
            }
          >
            Broadcast
          </Button>
        )}
      </div>
    </section>
  );
};

export default NotifikasiDetailPosyanduSection;
