import { MainHeader } from "@/components/layout/main-header";

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <MainHeader />
      <main className="flex-1">{children}</main>
    </div>
  );
}
