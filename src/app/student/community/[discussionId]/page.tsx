import { getDiscussionById, getRepliesForDiscussion } from '@/lib/database.server';
import { getCurrentUser } from '@/lib/auth.server';
import { notFound } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDistanceToNow } from 'date-fns';
import { ReplyForm } from '@/components/student/reply-form';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default async function DiscussionPage({ params }: { params: { discussionId: string } }) {
  const { discussionId } = params;
  const [discussion, replies, user] = await Promise.all([
    getDiscussionById(discussionId),
    getRepliesForDiscussion(discussionId),
    getCurrentUser()
  ]);

  if (!discussion || !user) {
    notFound();
  }

  return (
    <div className="container mx-auto max-w-4xl py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-6">
        <Link href="/student/community" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" />
          Back to all discussions
        </Link>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-start gap-4">
          <Avatar className="h-12 w-12 border">
            <AvatarImage src={discussion.authorAvatar} alt={discussion.authorName} />
            <AvatarFallback>{discussion.authorName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <CardTitle className="text-2xl">{discussion.title}</CardTitle>
            <CardDescription className="flex items-center gap-2 mt-1">
              <span>By {discussion.authorName}</span>
              <span className="text-xs text-muted-foreground">&bull;</span>
              <time className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(discussion.createdAt), { addSuffix: true })}
              </time>
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap">
            <p>{discussion.message}</p>
          </div>
        </CardContent>
      </Card>
      
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">{replies.length} {replies.length === 1 ? 'Reply' : 'Replies'}</h2>
        <div className="space-y-6">
          {replies.map(reply => (
            <div key={reply.id} className="flex gap-4 items-start">
              <Avatar className="h-10 w-10 border">
                <AvatarImage src={reply.authorAvatar} alt={reply.authorName} />
                <AvatarFallback>{reply.authorName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <div className="flex-1 rounded-lg border bg-card p-4">
                <div className="flex items-center justify-between">
                  <p className="font-semibold">{reply.authorName}</p>
                  <time className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(reply.createdAt), { addSuffix: true })}
                  </time>
                </div>
                <p className="mt-2 text-sm whitespace-pre-wrap">{reply.message}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Separator className="my-8" />

      <div>
        <h3 className="text-lg font-semibold mb-2">Join the conversation</h3>
        <ReplyForm discussionId={discussion.id} userAvatar={'https://placehold.co/100x100.png'} userName={user.name} />
      </div>
    </div>
  );
}
