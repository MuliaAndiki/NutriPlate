"use client";
import HomeAdminHeroSection from "@/components/section/private/admin/home/home-admin-sction";
import { SidebarLayout } from "@/core/layouts/sidebar.layout";
import { useAppSelector } from "@/hooks/dispatch/dispatch";
import useService from "@/hooks/mutation/prop.service";
import { Role } from "@/types/partial";
import { INotification } from "@/types/schema";

const HomeContainerAdmin = () => {
  const service = useService();
  const selector = useAppSelector((state) => state.posyandu);

  const profileQuery = service.user.query.profile();
  const profileData = profileQuery.data?.data ?? null;
  const role = (profileData?.role as Role | undefined) ?? "ADMIN";

  const parentQuery = service.user.query.parent();
  const parentData = parentQuery.data?.data ?? [];

  const kaderQuery = service.user.query.kader();
  const kaderData = kaderQuery.data?.data ?? [];

  const childQuery = service.user.query.childAll({ role });
  const childData = childQuery.data?.data ?? [];

  const posyanduQuery = service.posyandu.query.getPosyandu();
  const posyanduData = posyanduQuery.data?.data ?? [];

  const foodClassQuery = service.foodSummary.query.foofClases();
  const foodClassData = foodClassQuery.data?.data ?? [];

  const notificationQuery = service.notafication.query.getNotification(
    selector.token!,
  );
  const notificationData: INotification[] = notificationQuery.data?.data ?? [];

  const unreadNotifications = notificationData.filter((item) => !item.isRead);

  return (
    <SidebarLayout>
      <main className="w-full min-h-screen overflow-x-hidden">
        <HomeAdminHeroSection
          service={{
            query: {
              isLoading:
                profileQuery.isLoading ||
                parentQuery.isLoading ||
                kaderQuery.isLoading ||
                childQuery.isLoading ||
                posyanduQuery.isLoading ||
                foodClassQuery.isLoading ||
                notificationQuery.isLoading,
              profile: profileData,
              totals: {
                parent: parentData.length,
                kader: kaderData.length,
                child: childData.length,
                posyandu: posyanduData.length,
                foodClass: foodClassData.length,
                notification: notificationData.length,
                unreadNotification: unreadNotifications.length,
              },
              latestNotifications: notificationData.slice(0, 5),
            },
          }}
        />
      </main>
    </SidebarLayout>
  );
};

export default HomeContainerAdmin;
