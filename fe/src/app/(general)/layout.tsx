import NavLayout from "@/core/layouts/nav.layout";

export default function GeneralLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <NavLayout>{children}</NavLayout>;
}
