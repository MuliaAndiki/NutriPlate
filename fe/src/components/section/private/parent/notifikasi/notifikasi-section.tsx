import NotifikasiCard from "@/components/card/notifikasi/notif-card";
import { ButtonWrapper } from "@/components/wrapper/ButtonWrapper";
import { INotification } from "@/types/schema/notafication.schema";
import { Icon } from "@iconify/react/dist/iconify.js";
import { ChevronLeft } from "lucide-react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { NotifikasiIcons } from "@/configs/component.config";

interface NotifikasiParentSectionProp {
  namespace: {
    router: AppRouterInstance;
  };
  service: {
    query: {
      notifikasi: INotification[];
      isLoading: boolean;
    };
  };
}
const NotifikasiParentSection: React.FC<NotifikasiParentSectionProp> = ({
  namespace,
  service,
}) => {
  if (service.query.isLoading) {
    return <div>loading...</div>;
  }
  return (
    <div className="w-full min-h-screen flex items-center justify-start flex-col overflow-x-hidden relative p-2 space-y-2 ">
      <div className="w-full flex items-center justify-between  mt-2">
        <div className="flex items-center">
          <ChevronLeft
            onClick={() => namespace.router.back()}
            className="scale-120"
          />
          <h1 className="text-2xl font-bold">Notifikasi</h1>
        </div>
        <Icon
          icon="iconoir:filter-solid"
          width="24"
          height="24"
          className="text-primary"
        />
      </div>
      <div className="w-full flex justify-between items-center border-y py-3 space-x-3">
        <div className="w-full">
          <ButtonWrapper className="w-full" variant={"linter"}>
            Semua
          </ButtonWrapper>
        </div>
        <div className="w-full">
          <ButtonWrapper className=" w-full" variant={"notLinter"}>
            Belum Dibaca
          </ButtonWrapper>
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
        {service.query.notifikasi.map((items) => (
          <NotifikasiCard key={items.id} res={items} />
        ))}
      </div>
    </div>
  );
};

export default NotifikasiParentSection;
