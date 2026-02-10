import NotifikasiManageCard from "@/components/card/notifikasi/notif-manage-card";
import DataNotFound from "@/components/empty/data-not-found";
import EmptyCard from "@/components/fallback/empty-card";
import NotifikasiSectionSkeleton from "@/components/skeleton/private/posyandu/notifikasi/notifikasi-section-skeleton";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ButtonWrapper } from "@/components/wrapper/ButtonWrapper";
import { NotifikasiIcons } from "@/configs/component.config";
import { NotifTypeInterface } from "@/types/partial";
import { INotification } from "@/types/schema/notafication.schema";
import { Icon } from "@iconify/react/dist/iconify.js";
import {
  BellIcon,
  Book,
  ChevronLeft,
  MailIcon,
  MessageSquareIcon,
} from "lucide-react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

interface NotifikasiPosyanduSectionProp {
  namespace: {
    router: AppRouterInstance;
  };
  service: {
    query: {
      notifikasi: INotification[];
      isLoading: boolean;
    };
  };
  state: {
    filter: "Read" | "NotRead";
    selectedTypes: NotifTypeInterface[];
    broadcastFilter: "all" | "broadcast" | "draft";
  };
  handler: {
    onDetail: (id: string) => void;
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
    onBroadcast: (id: string) => void;
    onFilterChange: (value: "Read" | "NotRead") => void;
    onToggleType: (type: NotifTypeInterface) => void;
    onBroadcastFilterChange: (value: "all" | "broadcast" | "draft") => void;
  };
  readStatus: Record<string, boolean>;
}

const NotifikasiPosyanduSection: React.FC<NotifikasiPosyanduSectionProp> = ({
  namespace,
  service,
  state,
  handler,
  readStatus,
}) => {
  if (service.query.isLoading) {
    return <NotifikasiSectionSkeleton />;
  }

  if (!service.query.notifikasi) {
    return <DataNotFound />;
  }

  const filtered = service.query.notifikasi.filter((item) => {
    const itemIsRead = readStatus[item.id] ?? false;
    const isBroadcast = item.isBroadcast ?? false;
    if (state.filter === "NotRead" && itemIsRead) return false;
    if (
      state.selectedTypes.length > 0 &&
      !state.selectedTypes.includes(item.type)
    ) {
      return false;
    }
    if (state.broadcastFilter === "broadcast" && !isBroadcast) return false;
    if (state.broadcastFilter === "draft" && isBroadcast) return false;
    return true;
  });

  return (
    <section className="w-full min-h-screen flex items-center justify-start flex-col overflow-x-hidden relative p-2 space-y-2">
      <div className="w-full flex items-center justify-between mt-2">
        <div className="flex items-center">
          <ChevronLeft
            onClick={() => namespace.router.back()}
            className="scale-120"
          />
          <h1 className="text-2xl font-bold">Notifikasi</h1>
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Icon
                icon="iconoir:filter-solid"
                width={24}
                height={24}
                className="text-primary cursor-pointer"
              />
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-52">
              <DropdownMenuLabel>Filter Tipe</DropdownMenuLabel>

              <DropdownMenuCheckboxItem
                checked={state.selectedTypes.includes("reminder")}
                onCheckedChange={() => handler.onToggleType("reminder")}
              >
                <MailIcon className="mr-2 h-4 w-4" />
                Pengingat
              </DropdownMenuCheckboxItem>

              <DropdownMenuCheckboxItem
                checked={state.selectedTypes.includes("result")}
                onCheckedChange={() => handler.onToggleType("result")}
              >
                <MessageSquareIcon className="mr-2 h-4 w-4" />
                Hasil
              </DropdownMenuCheckboxItem>

              <DropdownMenuCheckboxItem
                checked={state.selectedTypes.includes("alert")}
                onCheckedChange={() => handler.onToggleType("alert")}
              >
                <BellIcon className="mr-2 h-4 w-4" />
                Peringatan
              </DropdownMenuCheckboxItem>

              <DropdownMenuCheckboxItem
                checked={state.selectedTypes.includes("edukasi")}
                onCheckedChange={() => handler.onToggleType("edukasi")}
              >
                <Book className="mr-2 h-4 w-4" />
                Edukasi
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <ButtonWrapper
            variant={"notLinter"}
            onClick={() => namespace.router.push("/posyandu/notifikasi/create")}
          >
            Tambah
          </ButtonWrapper>
        </div>
      </div>

      <div className="w-full flex justify-between items-center border-y py-3 space-x-3">
        <div className="w-full">
          <Button
            className="w-full"
            variant={state.filter === "Read" ? "notLinter" : "linter"}
            onClick={() => handler.onFilterChange("Read")}
          >
            Semua
          </Button>
        </div>
        <div className="w-full">
          <Button
            className="w-full"
            variant={state.filter === "NotRead" ? "notLinter" : "linter"}
            onClick={() => handler.onFilterChange("NotRead")}
          >
            Belum Dibaca
          </Button>
        </div>
      </div>

      <div className="w-full grid grid-cols-3 gap-2 py-3 border-b">
        <Button
          className="w-full"
          variant={state.broadcastFilter === "all" ? "notLinter" : "linter"}
          onClick={() => handler.onBroadcastFilterChange("all")}
        >
          Semua
        </Button>
        <Button
          className="w-full"
          variant={
            state.broadcastFilter === "broadcast" ? "notLinter" : "linter"
          }
          onClick={() => handler.onBroadcastFilterChange("broadcast")}
        >
          Broadcast
        </Button>
        <Button
          className="w-full"
          variant={state.broadcastFilter === "draft" ? "notLinter" : "linter"}
          onClick={() => handler.onBroadcastFilterChange("draft")}
        >
          Draft
        </Button>
      </div>

      <div className="w-full grid grid-cols-4 gap-2 py-3 border-b">
        {NotifikasiIcons.map((item, idx) => (
          <div
            key={idx}
            className="flex flex-col items-center justify-center space-y-1"
          >
            <div
              className={`w-10 h-10 rounded-full border flex items-center justify-center ${item.color}`}
            >
              <Icon icon={item.icon} width={24} height={24} />
            </div>

            <p className="text-sm font-medium text-center">{item.title}</p>
          </div>
        ))}
      </div>

      <div className="w-full space-y-2">
        {filtered.length === 0 ? (
          <EmptyCard message="Tidak ada notifikasi" />
        ) : (
          filtered.map((items) => (
            <NotifikasiManageCard
              key={items.id}
              res={items}
              isRead={readStatus[items.id] ?? false}
              onDetail={handler.onDetail}
              onEdit={handler.onEdit}
              onDelete={handler.onDelete}
              onBroadcast={handler.onBroadcast}
            />
          ))
        )}
      </div>
    </section>
  );
};

export default NotifikasiPosyanduSection;
