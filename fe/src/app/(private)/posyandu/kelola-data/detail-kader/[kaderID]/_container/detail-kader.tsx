"use client";

import DetailKaderPosyanduSection from "@/components/section/private/posyandu/kelola-data/detail-kader/detail-kader-section";
import { useAppNameSpace } from "@/hooks/useAppNameSpace";
import { useParams } from "next/navigation";

const DetailKaderPosyanduContainer = () => {
  const namespace = useAppNameSpace();
  const { kaderID } = useParams<{ kaderID: string }>();
  console.log(kaderID, "ini id kader");
  return (
    <main className="w-full min-h-screen">
      <DetailKaderPosyanduSection
        namespace={{
          router: namespace.router,
        }}
      />
    </main>
  );
};

export default DetailKaderPosyanduContainer;
