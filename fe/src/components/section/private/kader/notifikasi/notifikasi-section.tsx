import NotifikasiCard from "@/components/card/notifikasi/notif-card";

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
import { NotifikasiIcons } from "@/configs/component.config";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { NotifTypeInterface } from "@/types/partial";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import useService from "@/hooks/mutation/prop.service";

interface NotifikasiKaderSectionProp {
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
    setFilter: React.Dispatch<React.SetStateAction<"Read" | "NotRead">>;
    selectedTypes: NotifTypeInterface[];
    setSelectedTypes: React.Dispatch<
      React.SetStateAction<NotifTypeInterface[]>
    >;
  };
  readStatus: Record<string, boolean>;
}
const NotifikasiKaderSection: React.FC<NotifikasiKaderSectionProp> = ({
  namespace,
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
    return <div>loading...</div>;
  }

  const filtered = service.query.notifikasi.filter((item) => {
    const itemIsRead = readStatus[item.id] ?? false;
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
    <section className="w-full min-h-screen flex items-center justify-start flex-col overflow-x-hidden relative p-2 space-y-2 ">
      <div className="w-full flex items-center justify-between  mt-2">
        <div className="flex items-center">
          <ChevronLeft
            onClick={() => namespace.router.back()}
            className="scale-120"
          />
          <h1 className="text-2xl font-bold">Notifikasi</h1>
        </div>
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
      <div className="w-full flex justify-between items-center border-y py-3 space-x-3">
        <div className="w-full">
          <Button
            className="w-full"
            variant={state.filter === "Read" ? "notLinter" : "linter"}
            onClick={() => state.setFilter("Read")}
          >
            Semua
          </Button>
        </div>
        <div className="w-full">
          <Button
            className=" w-full"
            variant={state.filter === "NotRead" ? "notLinter" : "linter"}
            onClick={() => state.setFilter("NotRead")}
          >
            Belum Dibaca
          </Button>
        </div>
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
        {filtered.map((items) => (
          <NotifikasiCard
            key={items.id}
            res={items}
            isRead={readStatus[items.id] ?? false}
          />
        ))}
      </div>
    </section>
  );
};

export default NotifikasiKaderSection;
