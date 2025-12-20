import BlankLayout from "@/core/layouts/blank.layout";
import { MobileOnly } from "@/core/layouts/mobile.only";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="w-full">
      <MobileOnly>
        <BlankLayout>{children}</BlankLayout>
      </MobileOnly>
    </main>
  );
}
