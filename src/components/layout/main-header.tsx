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
import { LogOut, Shell } from 'lucide-react';
import { logoutAction } from '@/app/actions';

export async function MainHeader() {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  const userInitials = user.name.split(' ').map(n => n[0]).join('');

  return (
    <header className="sticky top-0 z-50 flex h-16 items-center justify-between gap-4 border-b bg-background px-4 md:px-6">
      <div className="flex items-center gap-2">
        <Shell className="h-6 w-6 text-primary" />
        <h1 className="text-lg font-semibold">Magellan</h1>
      </div>
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
          <form action={logoutAction} className="w-full">
            <DropdownMenuItem asChild>
                <button type="submit" className="w-full text-left">
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                </button>
            </DropdownMenuItem>
          </form>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
