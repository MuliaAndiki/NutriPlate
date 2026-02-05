import KaderCard from "@/components/card/kader/kader-list";
import ParentCard from "@/components/card/parent/parent-card";
import ParentCardList from "@/components/card/parent/parent-list";
import ChildFallback from "@/components/fallback/child.fallback";
import { ButtonWrapper } from "@/components/wrapper/ButtonWrapper";
import { InputWrapper } from "@/components/wrapper/InputWrapper";
import { ChildRespone, GetListKader, ParentListResponse } from "@/types/res";
import { Icon } from "@iconify/react/dist/iconify.js";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

interface KelolaDataSectionProps {
  namespace: {
    router: AppRouterInstance;
  };
  service: {
    query: {
      isLoading: boolean;
      children: ChildRespone[];
      kader: GetListKader[];
      parent: ParentListResponse[];
    };
  };
  state: {
    filter: "PARENT" | "KADER" | "CHILDREN";
    setFilter: React.Dispatch<
      React.SetStateAction<"PARENT" | "KADER" | "CHILDREN">
    >;
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

  if (!resChildren || !resKader || !resParent) {
    return <div>data tidak temukan</div>;
  }
  if (service.query.isLoading) {
    return <div>loading...</div>;
  }

  const renderContent = () => {
    switch (state.filter) {
      //bulum ada
      // case "CHILDREN":
      //   if (resChildren.length === 0) {
      //     return <ChildFallback />;
      //   }

      //   return (
      //     <div className="w-full grid grid-cols-1 gap-2">
      //       {/* map children disini */}
      //       {/* resChildren.map(child => <ChildCard />) */}
      //     </div>
      //   );

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
        <div className="w-full grid grid-cols-4  mt-2 gap-2 grid-rows-1">
          <ButtonWrapper>Semua</ButtonWrapper>
          <ButtonWrapper>Normal</ButtonWrapper>
          <ButtonWrapper>Berisiko</ButtonWrapper>
          <ButtonWrapper>Gizi Buruk</ButtonWrapper>
        </div>
      )}
      <div className="w-full">{renderContent()}</div>
    </section>
  );
};

export default KelolaDataSection;
