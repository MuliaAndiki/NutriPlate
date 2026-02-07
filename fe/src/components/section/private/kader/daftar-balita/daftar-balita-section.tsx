import ChildFallback from "@/components/fallback/child.fallback";
import { ButtonWrapper } from "@/components/wrapper/ButtonWrapper";
import { InputWrapper } from "@/components/wrapper/InputWrapper";
import { Icon } from "@iconify/react/dist/iconify.js";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BellIcon, Book, MailIcon, MessageSquareIcon } from "lucide-react";
import { nutritionFilterMap, NutritionStatus } from "@/types/partial";
import { MeasurementRespone } from "@/types/res";
import ChildMeasurement from "@/components/card/child/child-measuremet";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

interface DaftarBalitaKaderSectionProps {
  namespace: {
    router: AppRouterInstance;
  };
  service: {
    query: {
      isLoading: boolean;
      children: MeasurementRespone[];
    };
  };
  state: {
    filter: NutritionStatus | "Semua";
    setFilter: React.Dispatch<React.SetStateAction<NutritionStatus | "Semua">>;
  };
}
const DaftarBalitaKaderSection: React.FC<DaftarBalitaKaderSectionProps> = ({
  service,
  state,
  namespace,
}) => {
  const resChildren = service.query.children;

  if (!resChildren) {
    return <div>data tidak ditemukan</div>;
  }
  if (service.query.isLoading) {
    return <div>loading...</div>;
  }
  //filter
  const filteredChildren =
    state.filter === "Semua"
      ? resChildren
      : resChildren.filter((item) => item.nutritionStatus === state.filter);
  return (
    <section className="w-full min-h-screen flex items-center justify-start flex-col overflow-x-hidden relative p-2 space-y-2">
      <div className="w-full flex items-center justify-between ">
        <h1 className="text-2xl font-bold">Daftar Balita</h1>
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
            <DropdownMenuCheckboxItem>
              <MailIcon className="mr-2 h-4 w-4" />
              0-12 bulan
            </DropdownMenuCheckboxItem>

            <DropdownMenuCheckboxItem>
              <MessageSquareIcon className="mr-2 h-4 w-4" />
              1-3 tahun
            </DropdownMenuCheckboxItem>

            <DropdownMenuCheckboxItem>
              <BellIcon className="mr-2 h-4 w-4" />
              3-5 tahun
            </DropdownMenuCheckboxItem>

            <DropdownMenuCheckboxItem>
              <Book className="mr-2 h-4 w-4" />
              Laki-laki
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem>
              <Book className="mr-2 h-4 w-4" />
              Perempuan
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="w-full ">
        <InputWrapper
          className="w-full border rounded-lg"
          placeholder="cari disini...."
          rightIcon={
            <Icon
              icon="material-symbols:search-rounded"
              width="24"
              height="24"
            />
          }
        />
        <div className="w-full grid grid-cols-4  mt-2 gap-2 grid-rows-1">
          {nutritionFilterMap.map((item) => (
            <ButtonWrapper
              key={item.label}
              variant={state.filter === item.value ? "notLinter" : "linter"}
              onClick={() => state.setFilter(item.value)}
            >
              {item.label}
            </ButtonWrapper>
          ))}
        </div>
      </div>
      <div className="w-full">
        <div className="w-full grid grid-cols-1 gap-2">
          {filteredChildren.map((items, key) => (
            <ChildMeasurement
              res={items}
              index={key + 1}
              key={items.id}
              onDetail={() =>
                namespace.router.push(
                  `/kader/daftar-balita/detail-anak/${items.childId}`,
                )
              }
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default DaftarBalitaKaderSection;
