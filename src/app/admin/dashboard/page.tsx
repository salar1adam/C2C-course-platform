import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { getAllUsers, getCourse } from "@/lib/database.server";
import { Users, BookCopy, ArrowRight } from "lucide-react";

export default async function AdminDashboard() {
  const users = await getAllUsers();
  const course = await getCourse('og-101');

  const studentCount = users.filter(u => u.role === 'student').length;
  const moduleCount = course?.modules.length || 0;

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
      <p className="text-muted-foreground">Overview of the Magellan platform.</p>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{studentCount}</div>
            <p className="text-xs text-muted-foreground">Currently enrolled</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Course Modules</CardTitle>
            <BookCopy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{moduleCount}</div>
            <p className="text-xs text-muted-foreground">In the main course</p>
          </CardContent>
        </Card>
      </div>

       <div className="mt-8">
            <h2 className="text-2xl font-semibold tracking-tight">Quick Actions</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-4">
                <Link href="/admin/users" className="block">
                    <Card className="hover:bg-muted/50 transition-colors">
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                Manage Users <ArrowRight className="h-4 w-4" />
                            </CardTitle>
                            <CardDescription>View, create, and manage student accounts.</CardDescription>
                        </CardHeader>
                    </Card>
                </Link>
                <Link href="/admin/courses" className="block">
                    <Card className="hover:bg-muted/50 transition-colors">
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                Manage Course <ArrowRight className="h-4 w-4" />
                            </CardTitle>
                            <CardDescription>Edit course structure, modules, and lessons.</CardDescription>
                        </CardHeader>
                    </Card>
                </Link>
            </div>
       </div>
    </div>
  );
}
