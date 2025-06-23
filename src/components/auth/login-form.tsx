
'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { loginAction, type LoginFormState } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LogIn, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending} aria-disabled={pending}>
      {pending ? 'Signing In...' : 'Sign In'}
      <LogIn />
    </Button>
  );
}

export function LoginForm() {
  const initialState: LoginFormState = { message: '', status: 'idle' };
  const [state, formAction] = useActionState(loginAction, initialState);

  return (
    <form action={formAction} className="space-y-4">
      {state.status === 'error' && (
        <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Login Failed</AlertTitle>
            <AlertDescription>
                {state.message}. Please check your credentials and try again.
            </AlertDescription>
        </Alert>
      )}
      <div className="space-y-2">
        <Label htmlFor="email">Username</Label>
        <Input
          id="email"
          name="email"
          type="text"
          placeholder="Username"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="••••••••"
          required
        />
      </div>
      <SubmitButton />
    </form>
  );
}
