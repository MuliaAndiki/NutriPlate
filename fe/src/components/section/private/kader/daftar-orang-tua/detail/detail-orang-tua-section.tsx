import ChildCard from "@/components/card/child/child-card";
import ChildParent from "@/components/card/child/child-parent";
import ParentCard from "@/components/card/parent/parent-card";
import { UserResponse } from "@/types/res";
import { Icon } from "@iconify/react/dist/iconify.js";
import { ChevronLeft } from "lucide-react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

interface DetailParentSectionProps {
  namespace: {
    router: AppRouterInstance;
  };
  service: {
    query: {
      parentDetail: UserResponse;
      isLoading: boolean;
    };
  };
}
const DetailParentSection: React.FC<DetailParentSectionProps> = ({
  namespace,
  service,
}) => {
  const res = service.query.parentDetail;

  if (!res) {
    return <div>data tidak ditemukan</div>;
  }
  if (service.query.isLoading) {
    return <div>loading...</div>;
  }
  return (
    <section className="w-full min-h-screen flex flex-col p-2 space-y-2">
      <div className="w-full flex items-center">
        <ChevronLeft
          className="cursor-pointer"
          onClick={() => namespace.router.back()}
        />
        <h1 className="text-lg font-bold">Detail Orang Tua</h1>
      </div>
      <div className="w-full ">
        <ParentCard res={res} key={res.id} />
      </div>
      <div className="w-full flex items-center">
        <Icon
          icon="material-symbols:child-care-outline"
          width="44"
          height="44"
          className="text-primary"
        />
        <h1 className="text-2xl font-bold">Anak Terdaftar</h1>
      </div>
      <div className="w-full space-y-2">
        {res.children?.map((items) => (
          <ChildParent res={items} key={items.id} />
        ))}
      </div>
    </section>
  );
};

export default DetailParentSection;
