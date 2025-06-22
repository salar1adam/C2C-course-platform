
'use client';

import { useState, useEffect, useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { updateLessonAction, type UpdateLessonFormState } from '@/app/actions';
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
import type { Lesson } from '@/lib/types';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} aria-disabled={pending}>
      {pending ? 'Saving...' : 'Save Changes'}
    </Button>
  );
}

export function EditLessonDialog({ lesson, courseId }: { lesson: Lesson; courseId: string; }) {
  const [open, setOpen] = useState(false);
  const initialState: UpdateLessonFormState = { message: '', status: 'idle' };
  
  const [state, formAction] = useActionState(updateLessonAction, initialState);

  useEffect(() => {
    if (state.status === 'success') {
      setOpen(false); // Close dialog on success
    }
  }, [state, setOpen]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Edit Lesson</DialogTitle>
          <DialogDescription>
            Make changes to the lesson title and video URL.
          </DialogDescription>
        </DialogHeader>
        <form action={formAction} className="space-y-6 py-4">
          <input type="hidden" name="lessonId" value={lesson.id} />
          <input type="hidden" name="courseId" value={courseId} />
          
          <div className="space-y-2">
            <Label htmlFor="lessonTitle">Lesson Title</Label>
            <Input id="lessonTitle" name="lessonTitle" defaultValue={lesson.title} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="lessonVideoUrl">Lesson Video URL</Label>
            <Input 
                id="lessonVideoUrl" 
                name="lessonVideoUrl" 
                defaultValue={lesson.videoUrl || ''} 
                placeholder="e.g., https://www.youtube.com/watch?v=..."
            />
             <p className="text-xs text-muted-foreground mt-1">
                Provide a direct video URL or a YouTube link.
            </p>
          </div>

          {state.status === 'error' && (
            <p className="text-sm text-destructive">{state.message}</p>
          )}

          <DialogFooter className="mt-4 pt-4 border-t">
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
