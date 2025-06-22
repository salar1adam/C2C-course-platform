'use server';

import { MainHeader } from "@/components/layout/main-header";
import { getCurrentUser } from "@/lib/auth.server";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export default async function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  const viewMode = cookies().get('view_mode')?.value;

  if (!user) {
    redirect('/');
  }

  const isRealStudent = user.role === 'student';
  const isAdminViewingAsStudent = user.role === 'admin' && viewMode === 'student';

  if (!isRealStudent && !isAdminViewingAsStudent) {
    redirect('/admin/dashboard');
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <MainHeader />
      <main className="flex-1">{children}</main>
    </div>
  );
}
