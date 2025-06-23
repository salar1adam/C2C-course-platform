import { LoginForm } from '@/components/auth/login-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shell } from 'lucide-react';
import { getCurrentUser } from '@/lib/auth.server';
import { redirect } from 'next/navigation';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Logo } from '@/components/layout/logo';

export default async function LoginPage() {
  let user;
  let setupError: string | null = null;

  try {
    user = await getCurrentUser();
  } catch (error: any) {
    // Check for gRPC status code 5, which is NOT_FOUND.
    // This typically means the Firestore database hasn't been created yet.
    if (error.code === 5) {
      setupError = "Could not connect to the database. This can happen if Firestore has not been enabled in your Firebase project. Please go to the Firebase Console, find the 'Firestore Database' section, and click 'Create database' to enable it.";
    } else {
      // For any other errors, re-throw them to see the standard error page.
      throw error;
    }
  }
  
  if (user) {
    const redirectUrl = user.role === 'admin' ? '/admin/dashboard' : '/student/dashboard';
    redirect(redirectUrl);
  }

  if (setupError) {
    return (
       <main className="flex min-h-screen flex-col items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card className="shadow-lg">
            <CardHeader className="text-center">
               <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive text-destructive-foreground">
                  <Shell className="h-8 w-8" />
              </div>
              <CardTitle className="text-2xl font-bold tracking-tight">Project Setup Incomplete</CardTitle>
              <CardDescription>An essential cloud service is not configured.</CardDescription>
            </CardHeader>
            <CardContent>
              <Alert variant="destructive">
                <AlertTitle>Database Connection Error</AlertTitle>
                <AlertDescription>{setupError}</AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </div>
      </main>
    )
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <Logo className="mx-auto h-12 w-12 mb-4" />
            <CardTitle className="text-2xl font-bold tracking-tight">Core to Crust</CardTitle>
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
