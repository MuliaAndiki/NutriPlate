import BlankLayout from "@/core/layouts/blank.layout";
import { ClientGate } from "@/core/providers/client-gate";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="w-full">
      <ClientGate>
        <BlankLayout>{children}</BlankLayout>
      </ClientGate>
    </main>
  );
}
