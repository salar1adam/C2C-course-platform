import { LoginForm } from '@/components/auth/login-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shell } from 'lucide-react';
import { getCurrentUser } from '@/lib/auth.server';
import { redirect } from 'next/navigation';

export default async function LoginPage() {
  const user = await getCurrentUser();
  if (user) {
    const redirectUrl = user.role === 'admin' ? '/admin/dashboard' : '/student/dashboard';
    redirect(redirectUrl);
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Shell className="h-8 w-8" />
            </div>
            <CardTitle className="text-2xl font-bold tracking-tight">Magellan</CardTitle>
            <CardDescription>Secure Course Platform</CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm />
          </CardContent>
        </Card>
        <p className="mt-4 text-center text-sm text-muted-foreground">
            Enter your credentials to access the course content.
        </p>
      </div>
    </main>
  );
}
