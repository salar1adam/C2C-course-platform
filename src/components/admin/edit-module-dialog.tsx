'use client';

import { useState, useEffect, useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { updateModuleAction, type UpdateModuleFormState } from '@/app/actions';
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
import { Edit } from 'lucide-react';
import type { Module } from '@/lib/types';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} aria-disabled={pending}>
      {pending ? 'Saving...' : 'Save Changes'}
    </Button>
  );
}

export function EditModuleDialog({ module, courseId }: { module: Module, courseId: string }) {
  const [open, setOpen] = useState(false);
  const initialState: UpdateModuleFormState = { message: '', status: 'idle' };
  
  const [state, formAction] = useActionState(updateModuleAction, initialState);

  useEffect(() => {
    if (state.status === 'success') {
      setOpen(false); // Close dialog on success
    }
  }, [state, setOpen]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
            <Edit className="mr-2 h-4 w-4" />
            Edit Module
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Module</DialogTitle>
          <DialogDescription>
            Make changes to the module title. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <form action={formAction} className="space-y-4 py-4">
          <input type="hidden" name="moduleId" value={module.id} />
          <input type="hidden" name="courseId" value={courseId} />
          <div className="space-y-2">
            <Label htmlFor="moduleTitle">Module Title</Label>
            <Input id="moduleTitle" name="moduleTitle" defaultValue={module.title} required />
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
      </DialogContent>
    </Dialog>
  );
}
