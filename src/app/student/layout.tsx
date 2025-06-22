import { MainHeader } from "@/components/layout/main-header";
import { getCurrentUser } from "@/lib/auth.server";
import { redirect } from "next/navigation";

export default async function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/');
  }

  if (user.role !== 'student') {
    redirect('/admin/dashboard');
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <MainHeader />
      <main className="flex-1">{children}</main>
    </div>
  );
}
