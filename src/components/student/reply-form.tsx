'use client';

import { useEffect, useRef, useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { createReplyAction, type CreateReplyFormState } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send } from 'lucide-react';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? 'Posting...' : 'Post Reply'}
      <Send className="ml-2 h-4 w-4" />
    </Button>
  );
}

export function ReplyForm({ discussionId, userAvatar, userName }: { discussionId: string, userAvatar: string, userName: string }) {
  const formRef = useRef<HTMLFormElement>(null);
  const { toast } = useToast();
  const initialState: CreateReplyFormState = { message: '', status: 'idle' };
  const [state, formAction] = useActionState(createReplyAction, initialState);

  useEffect(() => {
    if (state.status === 'success') {
      formRef.current?.reset();
    } else if (state.status === 'error') {
      toast({
        variant: "destructive",
        title: "Error Posting Reply",
        description: state.message,
      });
    }
  }, [state, toast]);

  return (
    <form ref={formRef} action={formAction} className="flex items-start gap-4">
      <Avatar className="hidden h-10 w-10 sm:flex border">
        <AvatarImage src={userAvatar} alt="Your avatar" />
        <AvatarFallback>{userName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
      </Avatar>
      <div className="flex-1 space-y-2">
        <input type="hidden" name="discussionId" value={discussionId} />
        <Textarea
          name="message"
          placeholder="Write your reply here..."
          className="w-full"
          rows={4}
          required
        />
        <div className="flex justify-end">
          <SubmitButton />
        </div>
      </div>
    </form>
  );
}
