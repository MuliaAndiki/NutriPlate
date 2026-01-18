"use client";

import DailySummarySection from "@/components/section/private/parent/profile-anak/detail-profile-anak/daily-summary/daily-summary-section";
import { SidebarLayout } from "@/core/layouts/sidebar.layout";

const DailySummaryContainer = () => {
  return (
    <SidebarLayout>
      <main className="w-full min-h-screen overflow-x-hidden">
        <DailySummarySection />
      </main>
    </SidebarLayout>
  );
};

export default DailySummaryContainer;
