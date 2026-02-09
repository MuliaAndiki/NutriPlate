import ProgresListCard from "@/components/card/program/program-list";
import { ChildRespone, ProgresRespone } from "@/types/res";
import { Icon } from "@iconify/react/dist/iconify.js";
import { ChevronLeft } from "lucide-react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import Link from "next/link";
import ProgramChildrenSectionSkeleton from "@/components/skeleton/private/posyandu/kelola-data/program/program-children-section-skeleton";
import DataNotFound from "@/components/empty/data-not-found";

interface ProgramChildrenPosyanduSectionProps {
  namespace: {
    router: AppRouterInstance;
    pathname: string;
  };
  service: {
    query: {
      childType: ChildRespone;
      isLoading: boolean;
      progres: ProgresRespone[];
    };
  };
  state: {
    role: string;
    section: string;
  };
}

const ProgramChildrenPosyanduSection: React.FC<
  ProgramChildrenPosyanduSectionProps
> = ({ namespace, service, state }) => {
  const resChildren = service.query.childType;
  const resProgres = service.query.progres;

  if (service.query.isLoading) {
    return <ProgramChildrenSectionSkeleton />;
  }
  if (!resChildren || !resProgres) {
    return <DataNotFound />;
  }
  const runningPrograms = resProgres.filter((item) => !item.isCompleted);

  const completedPrograms = resProgres.filter((item) => item.isCompleted);
  return (
    <section className="w-full min-h-screen flex justify-start p-2 items-center flex-col overflow-x-hidden space-y-3">
      <div className="w-full flex items-center justify-between">
        <div className="w-full items-center flex">
          <ChevronLeft
            onClick={() => namespace.router.back()}
            width={36}
            height={36}
          />
          <h1 className="text-2xl font-bold">
            Program <span>{service.query.childType.fullName}</span>
          </h1>
        </div>
      </div>
      <div className="w-full flex items-center">
        <Icon
          icon="si:ai-note-duotone"
          width="30"
          height="30"
          className="text-primary"
        />
        <h1 className="text-2xl font-bold">Program Berjalan</h1>
      </div>
      <div className="w-full">
        {runningPrograms.slice(0, 2).map((items) => (
          <ProgresListCard
            key={items.id}
            res={items}
            pathname={namespace.pathname}
            onDetail={() =>
              namespace.router.push(
                `/${state.role.toLocaleLowerCase()}/${state.section}/detail-anak/${items.childId}/program/detail-program/${items.id}`,
              )
            }
          />
        ))}
        {runningPrograms.length > 2 && (
          <Link href="#">
            <h1 className="font-light underline text-end">Selengkapnya</h1>
          </Link>
        )}
      </div>
      {completedPrograms.length > 0 && (
        <>
          <div className="w-full flex items-center">
            <Icon
              icon="si:ai-note-duotone"
              width="30"
              height="30"
              className="text-primary"
            />
            <h1 className="text-2xl font-bold">Program Selesai</h1>
          </div>
          <div className="w-full">
            {completedPrograms.slice(0, 1).map((items) => (
              <ProgresListCard
                key={items.id}
                res={items}
                pathname={namespace.pathname}
                onDetail={() =>
                  namespace.router.push(
                    `/${state.role.toLocaleLowerCase()}/${state.section}/detail-anak/${items.childId}/program/detail-program/${items.id}`,
                  )
                }
              />
            ))}
            {completedPrograms.length > 1 && (
              <Link href={"#"}>
                <h1 className="font-light underline text-end">Selengkapnya</h1>
              </Link>
            )}
          </div>
        </>
      )}
    </section>
  );
};

export default ProgramChildrenPosyanduSection;
