import HeaderHomeCard from "@/components/card/general/header/home";
import EmptyCard from "@/components/fallback/empty-card";
import { INotification } from "@/types/schema";
import { UserResponse } from "@/types/res";
import { Icon } from "@iconify/react/dist/iconify.js";
import Link from "next/link";

interface HomeAdminHeroSectionProps {
  service: {
    query: {
      isLoading: boolean;
      profile: UserResponse | null;
      totals: {
        parent: number;
        kader: number;
        child: number;
        posyandu: number;
        foodClass: number;
        notification: number;
        unreadNotification: number;
      };
      latestNotifications: INotification[];
    };
  };
}

const HomeAdminHeroSection: React.FC<HomeAdminHeroSectionProps> = ({
  service,
}) => {
  const { profile, totals, latestNotifications, isLoading } = service.query;

  if (isLoading) {
    return (
      <section className="w-full min-h-screen p-4 space-y-4">
        <div className="h-36 rounded-2xl bg-muted animate-pulse" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="h-24 rounded-xl bg-muted animate-pulse" />
          <div className="h-24 rounded-xl bg-muted animate-pulse" />
          <div className="h-24 rounded-xl bg-muted animate-pulse" />
          <div className="h-24 rounded-xl bg-muted animate-pulse" />
        </div>
      </section>
    );
  }

  if (!profile) {
    return <EmptyCard message="Data admin tidak ditemukan" />;
  }

  const overviewCards = [
    {
      title: "Total Posyandu",
      value: totals.posyandu,
      icon: "material-symbols:holiday-village-rounded",
      tint: "bg-info-foreground border-info",
    },
    {
      title: "Total Kader",
      value: totals.kader,
      icon: "mdi:account-group-outline",
      tint: "bg-success-foreground border-success",
    },
    {
      title: "Total Orang Tua",
      value: totals.parent,
      icon: "raphael:parent",
      tint: "bg-warning-foreground border-warning",
    },
    {
      title: "Total Balita",
      value: totals.child,
      icon: "healthicons:child-program",
      tint: "bg-primary/10 border-primary",
    },
    {
      title: "Kelas Makanan",
      value: totals.foodClass,
      icon: "material-symbols:nutrition",
      tint: "bg-secondary border-border",
    },
    {
      title: "Notifikasi Aktif",
      value: totals.notification,
      icon: "mdi:bell-outline",
      tint: "bg-card border-border",
    },
  ];

  return (
    <div className="w-full overflow-hidden">
      <HeaderHomeCard
        res={profile}
        role={profile.role}
        isRead={totals.unreadNotification > 0}
      />

      <section className="relative z-10 bg-background px-4 py-6 rounded-t-3xl space-y-4">
        <div className="w-full rounded-2xl border border-border bg-card p-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Dashboard Admin</p>
              <h2 className="text-2xl font-bold text-foreground mt-1">
                Kendali Data NutriPlate
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Pantau ringkasan layanan dan notifikasi sistem dalam satu
                tampilan.
              </p>
            </div>
            <div className="w-12 h-12 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center">
              <Icon
                icon="material-symbols:admin-panel-settings-rounded"
                width={28}
                height={28}
                className="text-primary"
              />
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <Link
              href="/admin/notifikasi"
              className="px-3 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90"
            >
              Lihat Notifikasi
            </Link>
            <Link
              href="/admin/iot"
              className="px-3 py-2 rounded-lg bg-info text-background text-sm font-semibold hover:opacity-90"
            >
              Kelola IoT
            </Link>
            <span className="px-3 py-2 rounded-lg border border-border text-sm text-muted-foreground">
              {totals.unreadNotification} belum dibaca
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
          {overviewCards.map((item) => (
            <div
              key={item.title}
              className={`rounded-xl border p-3 ${item.tint} bg-card`}
            >
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">{item.title}</p>
                <Icon
                  icon={item.icon}
                  width={20}
                  height={20}
                  className="text-primary"
                />
              </div>
              <p className="text-2xl font-bold mt-1">{item.value}</p>
            </div>
          ))}
        </div>

        <div className="w-full rounded-2xl border border-border bg-card p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-bold">Notifikasi Terbaru</h3>
            <Link
              href="/admin/notifikasi"
              className="text-sm text-primary font-semibold"
            >
              Lihat semua
            </Link>
          </div>

          {latestNotifications.length === 0 ? (
            <EmptyCard message="Belum ada notifikasi" />
          ) : (
            <div className="space-y-2">
              {latestNotifications.map((item) => (
                <div
                  key={item.id}
                  className="w-full border border-border rounded-xl p-3 bg-background"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        {item.title}
                      </p>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {item.message}
                      </p>
                    </div>
                    {!item.isRead && (
                      <span className="w-2.5 h-2.5 rounded-full bg-primary mt-1" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default HomeAdminHeroSection;
