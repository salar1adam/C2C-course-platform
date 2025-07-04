import { getCurrentUser } from '@/lib/auth.server';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { LogOut, Eye, User, LayoutDashboard, MessageSquare } from 'lucide-react';
import { logoutAction, setViewModeAction } from '@/app/actions';
import { cookies } from 'next/headers';
import { Logo } from './logo';
import { ThemeToggle } from './theme-toggle';
import Link from 'next/link';

export async function MainHeader() {
  const user = await getCurrentUser();
  const viewMode = cookies().get('view_mode')?.value;

  if (!user) {
    return null;
  }

  const userInitials = user.name.split(' ').map(n => n[0]).join('');
  const isAdminInStudentView = user.role === 'admin' && viewMode === 'student';
  const isStudentView = user.role === 'student' || isAdminInStudentView;

  return (
    <header className="sticky top-0 z-50 flex h-16 items-center justify-between gap-4 border-b bg-background px-4 md:px-6">
      <div className="flex items-center gap-2">
        <Logo className="h-8 w-8 text-primary" />
        <h1 className="text-lg font-semibold">Core to Crust</h1>
      </div>
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Avatar>
                <AvatarImage src={`https://placehold.co/100x100.png`} alt={user.name} />
                <AvatarFallback>{userInitials}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>
              <div className='font-medium'>{user.name}</div>
              <div className='text-xs text-muted-foreground'>{user.email}</div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {isStudentView && (
              <>
                <DropdownMenuItem asChild>
                  <Link href="/student/dashboard">
                    <LayoutDashboard />
                    <span>Dashboard</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/student/community">
                    <MessageSquare />
                    <span>Community</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
              </>
            )}
            {user.role === 'admin' && (
              <form action={setViewModeAction} className="w-full">
                <input type="hidden" name="mode" value={isAdminInStudentView ? 'admin' : 'student'} />
                <DropdownMenuItem asChild>
                    <button type="submit" className="w-full text-left">
                      {isAdminInStudentView ? (
                        <>
                          <User />
                          <span>Return to Admin View</span>
                        </>
                      ) : (
                        <>
                          <Eye />
                          <span>View as Student</span>
                        </>
                      )}
                    </button>
                </DropdownMenuItem>
              </form>
            )}
            <form action={logoutAction} className="w-full">
              <DropdownMenuItem asChild>
                  <button type="submit" className="w-full text-left">
                      <LogOut />
                      <span>Logout</span>
                  </button>
              </DropdownMenuItem>
            </form>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
