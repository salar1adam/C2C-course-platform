import Link from "next/link";
import { MainHeader } from "@/components/layout/main-header";
import { Home, Users, BookCopy } from "lucide-react";
import { NavLink } from "@/components/layout/nav-link";

const adminNavLinks = [
    { href: "/admin/dashboard", label: "Dashboard", icon: Home },
    { href: "/admin/users", label: "Users", icon: Users },
    { href: "/admin/courses", label: "Courses", icon: BookCopy },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <aside className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-16 items-center border-b px-4 lg:px-6">
            <Link href="/admin/dashboard" className="flex items-center gap-2 font-semibold">
              <span className="">Admin Panel</span>
            </Link>
          </div>
          <div className="flex-1">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              {adminNavLinks.map(link => (
                  <NavLink key={link.href} href={link.href}>
                      <link.icon className="h-4 w-4" />
                      {link.label}
                  </NavLink>
              ))}
            </nav>
          </div>
        </div>
      </aside>
      <div className="flex flex-col">
        <MainHeader />
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-background">
            {children}
        </main>
      </div>
    </div>
  );
}
