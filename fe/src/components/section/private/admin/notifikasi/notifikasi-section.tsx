import EmptyCard from "@/components/fallback/empty-card";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { NotifTypeInterface } from "@/types/partial";
import { INotification } from "@/types/schema";
import { formatDateTime } from "@/utils/time.format";
import { Icon } from "@iconify/react/dist/iconify.js";
import { BellIcon, Book, MailIcon, MessageSquareIcon } from "lucide-react";
import Link from "next/link";

interface NotifikasiAdminSectionProps {
  service: {
    query: {
      isLoading: boolean;
      notifikasi: INotification[];
    };
  };
  state: {
    filter: "Read" | "NotRead";
    setFilter: React.Dispatch<React.SetStateAction<"Read" | "NotRead">>;
    selectedTypes: NotifTypeInterface[];
    setSelectedTypes: React.Dispatch<
      React.SetStateAction<NotifTypeInterface[]>
    >;
  };
  readStatus: Record<string, boolean>;
}

const NotifikasiAdminSection: React.FC<NotifikasiAdminSectionProps> = ({
  service,
  state,
  readStatus,
}) => {
  const toggleType = (type: NotifTypeInterface) => {
    state.setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type],
    );
  };

  if (service.query.isLoading) {
    return (
      <section className="w-full min-h-screen p-4 space-y-3">
        <div className="h-14 rounded-xl bg-muted animate-pulse" />
        <div className="h-24 rounded-xl bg-muted animate-pulse" />
        <div className="h-24 rounded-xl bg-muted animate-pulse" />
      </section>
    );
  }

  const filtered = service.query.notifikasi.filter((item) => {
    const itemIsRead = readStatus[item.id] ?? item.isRead ?? false;

    if (state.filter === "NotRead" && itemIsRead) return false;

    if (
      state.selectedTypes.length > 0 &&
      !state.selectedTypes.includes(item.type)
    ) {
      return false;
    }

    return true;
  });

  return (
    <section className="w-full min-h-screen p-4 space-y-4">
      <div className="w-full flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Notifikasi Admin</h1>
          <p className="text-sm text-muted-foreground">
            Pantau notifikasi sistem dan tindak lanjut operasional.
          </p>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="w-10 h-10 rounded-lg border border-border flex items-center justify-center bg-card"
            >
              <Icon
                icon="iconoir:filter-solid"
                width={20}
                height={20}
                className="text-primary"
              />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="w-52">
            <DropdownMenuLabel>Filter Tipe</DropdownMenuLabel>

            <DropdownMenuCheckboxItem
              checked={state.selectedTypes.includes("reminder")}
              onCheckedChange={() => toggleType("reminder")}
            >
              <MailIcon className="mr-2 h-4 w-4" />
              Pengingat
            </DropdownMenuCheckboxItem>

            <DropdownMenuCheckboxItem
              checked={state.selectedTypes.includes("result")}
              onCheckedChange={() => toggleType("result")}
            >
              <MessageSquareIcon className="mr-2 h-4 w-4" />
              Hasil
            </DropdownMenuCheckboxItem>

            <DropdownMenuCheckboxItem
              checked={state.selectedTypes.includes("alert")}
              onCheckedChange={() => toggleType("alert")}
            >
              <BellIcon className="mr-2 h-4 w-4" />
              Peringatan
            </DropdownMenuCheckboxItem>

            <DropdownMenuCheckboxItem
              checked={state.selectedTypes.includes("edukasi")}
              onCheckedChange={() => toggleType("edukasi")}
            >
              <Book className="mr-2 h-4 w-4" />
              Edukasi
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Link
        href="/admin/notifikasi/create"
        className="w-full px-3 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold text-center"
      >
        Tambah Notifikasi
      </Link>

      <div className="w-full grid grid-cols-2 gap-2">
        <button
          type="button"
          className={`w-full px-3 py-2 rounded-lg border text-sm font-semibold ${
            state.filter === "Read"
              ? "bg-primary text-primary-foreground border-primary"
              : "bg-card text-foreground border-border"
          }`}
          onClick={() => state.setFilter("Read")}
        >
          Semua
        </button>
        <button
          type="button"
          className={`w-full px-3 py-2 rounded-lg border text-sm font-semibold ${
            state.filter === "NotRead"
              ? "bg-primary text-primary-foreground border-primary"
              : "bg-card text-foreground border-border"
          }`}
          onClick={() => state.setFilter("NotRead")}
        >
          Belum Dibaca
        </button>
      </div>

      <div className="w-full space-y-2">
        {filtered.length === 0 ? (
          <EmptyCard message="Tidak ada notifikasi" />
        ) : (
          filtered.map((item) => {
            const isRead = readStatus[item.id] ?? item.isRead ?? false;

            return (
              <div
                key={item.id}
                className={`w-full rounded-xl border p-3 ${
                  isRead
                    ? "bg-card border-border"
                    : "bg-primary/10 border-primary/30"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold">{item.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {item.message}
                    </p>
                  </div>
                  {!isRead && (
                    <span className="w-2.5 h-2.5 rounded-full bg-primary" />
                  )}
                </div>

                <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                  <span className="capitalize">{item.type}</span>
                  <span>
                    {formatDateTime(item.createdAt, { style: "time" })}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
};

export default NotifikasiAdminSection;
