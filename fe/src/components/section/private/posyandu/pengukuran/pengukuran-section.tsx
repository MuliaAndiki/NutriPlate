import ChildList from "@/components/card/child/child-list";
import { InputWrapper } from "@/components/wrapper/InputWrapper";
import { ChildRespone } from "@/types/res";
import { Icon } from "@iconify/react/dist/iconify.js";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

interface PengukuranSectionProps {
  service: {
    query: {
      isLoading: boolean;
      children: ChildRespone[];
    };
  };
  namespace: {
    pathname: string;
    router: AppRouterInstance;
  };
}
const PengukuranSection: React.FC<PengukuranSectionProps> = ({
  service,
  namespace,
}) => {
  const resChildren = service.query.children;

  if (!resChildren) {
    return <div>data tidak ditemukan</div>;
  }
  if (service.query.isLoading) {
    return <div>loading...</div>;
  }
  return (
    <section className="flex w-full min-h-screen flex-col items-center justify-start overflow-x-hidden space-y-2 p-2">
      <div className="w-full  space-y-1">
        <h1 className="text-2xl font-bold">Pengukuran Balita</h1>
        <p className="text-lg font-bold">
          Catat berat dan tinggi balita untuk memantau pertumbuhan
        </p>
      </div>
      <div className="w-full p-2 border-y">
        <InputWrapper
          placeholder="cari disini"
          rightIcon={
            <Icon icon="material-symbols:search" width="24" height="24" />
          }
        />
      </div>
      <div className="w-full">
        <h1 className="text-lg font-bold">Daftar Balita</h1>
      </div>
      <div className="w-full space-y-2">
        {resChildren.map((items) => (
          <ChildList
            res={items}
            key={items.id}
            onClick={() =>
              namespace.router.push(
                `/posyandu/pengukuran/detail-pengukuran/${items.id}`,
              )
            }
          />
        ))}
      </div>
    </section>
  );
};

export default PengukuranSection;
