"use client";
import { SidebarLayout } from "@/core/layouts/sidebar.layout";
import { useParams } from "next/navigation";

const DetailProgramContainer = () => {
  const { id } = useParams<{ id: string }>();
  return (
    <SidebarLayout>
      <main className="w-full min-h-screen overflow-x-hidden">
        <h1>initial</h1>
      </main>
    </SidebarLayout>
  );
};

export default DetailProgramContainer;
