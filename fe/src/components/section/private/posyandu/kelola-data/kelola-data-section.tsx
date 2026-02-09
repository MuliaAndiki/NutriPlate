import ChildMeasurement from "@/components/card/child/child-measuremet";
import KaderCard from "@/components/card/kader/kader-list";
import KelolaDataSectionSkeleton from "@/components/skeleton/private/posyandu/kelola-data/kelola-data-section-skeleton";
import DataNotFound from "@/components/empty/data-not-found";

import ParentCardList from "@/components/card/parent/parent-list";
import ChildFallback from "@/components/fallback/child.fallback";
import { ButtonWrapper } from "@/components/wrapper/ButtonWrapper";
import { InputWrapper } from "@/components/wrapper/InputWrapper";
import { nutritionFilterMap, NutritionStatus } from "@/types/partial";
import {
  GetListKader,
  MeasurementRespone,
  ParentListResponse,
} from "@/types/res";
import { AlertContexType } from "@/types/ui";
import { Icon } from "@iconify/react/dist/iconify.js";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

interface KelolaDataSectionProps {
  namespace: {
    router: AppRouterInstance;
    alert: AlertContexType;
  };
  service: {
    query: {
      isLoading: boolean;
      children: MeasurementRespone[];
      kader: GetListKader[];
      parent: ParentListResponse[];
    };
    mutation: {
      isPending: boolean;
      onDeleteKader: () => void;
    };
  };
  state: {
    filter: "PARENT" | "KADER" | "CHILDREN";
    setFilter: React.Dispatch<
      React.SetStateAction<"PARENT" | "KADER" | "CHILDREN">
    >;
    detailFilter: NutritionStatus | "Semua";
    setDetailFilter: React.Dispatch<
      React.SetStateAction<NutritionStatus | "Semua">
    >;
    setRegisterKaderId: React.Dispatch<React.SetStateAction<string>>;
  };
}
const KelolaDataSection: React.FC<KelolaDataSectionProps> = ({
  service,
  state,
  namespace,
}) => {
  const resChildren = service.query.children;
  const resKader = service.query.kader;
  const resParent = service.query.parent;

  if (service.query.isLoading) {
    return <KelolaDataSectionSkeleton />;
  }
  if (!resChildren || !resKader || !resParent) {
    return <DataNotFound />;
  }

  //filter
  const filteredChildren =
    state.detailFilter === "Semua"
      ? resChildren
      : resChildren.filter(
          (item) => item.nutritionStatus === state.detailFilter,
        );

  const renderContent = () => {
    switch (state.filter) {
      case "CHILDREN":
        if (resChildren.length === 0) {
          return <ChildFallback />;
        }

        return (
          <div className="w-full grid grid-cols-1 gap-2">
            {filteredChildren.map((items, key) => (
              <ChildMeasurement
                res={items}
                index={key + 1}
                key={items.id}
                onDetail={() =>
                  namespace.router.push(
                    `/posyandu/kelola-data/detail-anak/${items.childId}`,
                  )
                }
              />
            ))}
          </div>
        );

      case "PARENT":
        if (resParent.length === 0) {
          return <div>Tidak ada data parent</div>;
        }

        return (
          <div className="w-full grid grid-cols-1 gap-2">
            {resParent.map((items, key) => (
              <ParentCardList
                data={items}
                index={key}
                key={items.id}
                onClick={() =>
                  namespace.router.push(
                    `/posyandu/kelola-data/detail-orang-tua/${items.id}`,
                  )
                }
              />
            ))}
          </div>
        );

      case "KADER":
        if (resKader.length === 0) {
          return <div>Tidak ada data kader</div>;
        }

        return (
          <div className="w-full grid grid-cols-1 gap-2">
            {resKader.map((items, idx) => (
              <KaderCard
                data={items}
                index={idx}
                alert={namespace.alert}
                onDeleteKader={service.mutation.onDeleteKader}
                setRegisterKaderId={state.setRegisterKaderId}
                onDetail={() =>
                  namespace.router.push(
                    `/posyandu/kelola-data/detail-kader/${items.kader.id}`,
                  )
                }
              />
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <section className="flex w-full min-h-screen flex-col items-center justify-start overflow-x-hidden p-2 space-y-2">
      <div className="w-full ">
        <h1 className="text-lg font-bold">Kelola Data</h1>
      </div>
      <InputWrapper
        className="w-full border rounded-lg"
        placeholder="cari disini..."
        rightIcon={
          <Icon
            icon="ic:baseline-search"
            width="24"
            height="24"
            className="text-primary"
          />
        }
      />
      <div className="w-full grid grid-cols-3 grid-rows-1 gap-2">
        <ButtonWrapper
          className="w-full"
          variant={state.filter === "CHILDREN" ? "notLinter" : "linter"}
          onClick={() => state.setFilter("CHILDREN")}
        >
          Balita
        </ButtonWrapper>

        <ButtonWrapper
          className="w-full"
          variant={state.filter === "PARENT" ? "notLinter" : "linter"}
          onClick={() => state.setFilter("PARENT")}
        >
          Orang Tua
        </ButtonWrapper>

        <ButtonWrapper
          className="w-full"
          variant={state.filter === "KADER" ? "notLinter" : "linter"}
          onClick={() => state.setFilter("KADER")}
        >
          Kader
        </ButtonWrapper>
      </div>
      {state.filter === "CHILDREN" && (
        <div className="w-full grid grid-cols-4 mt-2 gap-2">
          {nutritionFilterMap.map((item) => (
            <ButtonWrapper
              key={item.label}
              variant={
                state.detailFilter === item.value ? "notLinter" : "linter"
              }
              onClick={() => state.setDetailFilter(item.value)}
            >
              {item.label}
            </ButtonWrapper>
          ))}
        </div>
      )}
      <div className="w-full">{renderContent()}</div>
    </section>
  );
};

export default KelolaDataSection;
