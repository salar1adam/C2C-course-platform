'use client';

import { useState, useEffect } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { createStudentAction } from '@/app/actions';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { PlusCircle, MailCheck } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} aria-disabled={pending}>
      {pending ? 'Creating Student...' : 'Create Student'}
    </Button>
  );
}

export function CreateStudentDialog() {
  const [open, setOpen] = useState(false);
  const initialState = { message: '', status: 'idle' as const };
  const [state, formAction] = useFormState(createStudentAction, initialState);

  useEffect(() => {
    if (state.status === 'success') {
      // Don't close the dialog, show the success message instead.
    } else if (state.status === 'error') {
      // Potentially show a toast or inline error
    }
  }, [state]);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Create Student
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        {state.status === 'success' ? (
          <>
            <DialogHeader>
              <DialogTitle>Student Created Successfully</DialogTitle>
              <DialogDescription>{state.message}</DialogDescription>
            </DialogHeader>
            <Alert className='border-green-500 bg-green-50 text-green-900'>
              <MailCheck className="h-4 w-4 !text-green-600" />
              <AlertTitle>Personalized Welcome Email</AlertTitle>
              <AlertDescription className="whitespace-pre-wrap font-mono text-sm">
                {state.welcomeEmail}
              </AlertDescription>
            </Alert>
            <DialogFooter>
                <DialogClose asChild>
                    <Button onClick={handleClose}>Close</Button>
                </DialogClose>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Create a New Student Account</DialogTitle>
              <DialogDescription>
                Enter student details below. A welcome email will be generated using AI.
              </DialogDescription>
            </DialogHeader>
            <form action={formAction} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="studentName">Student Name</Label>
                  <Input id="studentName" name="studentName" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Temporary Password</Label>
                <Input id="password" name="password" type="password" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="learningInterests">Learning Interests</Label>
                <Textarea
                  id="learningInterests"
                  name="learningInterests"
                  placeholder="e.g., 'I'm particularly interested in seismic interpretation and understanding stratigraphic traps.'"
                  required
                />
              </div>
              {state.status === 'error' && (
                <p className="text-sm text-destructive">{state.message}</p>
              )}
              <DialogFooter>
                <DialogClose asChild>
                    <Button type="button" variant="ghost">Cancel</Button>
                </DialogClose>
                <SubmitButton />
              </DialogFooter>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
