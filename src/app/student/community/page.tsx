import { getAllDiscussions } from '@/lib/database.server';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";
import { CreateDiscussionDialog } from '@/components/student/create-discussion-dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';

export default async function CommunityPage() {
  const discussions = await getAllDiscussions();

  return (
    <div className="container mx-auto max-w-4xl py-8 px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <MessageSquare className="h-10 w-10 text-primary" />
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Community Hub</h1>
            <p className="text-muted-foreground">
              Connect with peers, ask questions, and share knowledge.
            </p>
          </div>
        </div>
        <CreateDiscussionDialog />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Discussions</CardTitle>
          <CardDescription>
            Join the conversation or start a new one.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {discussions.length === 0 ? (
            <div className="text-center text-muted-foreground py-24">
              <div className="flex flex-col items-center gap-4">
                <MessageSquare className="h-16 w-16 text-muted-foreground/30" />
                <h3 className="text-xl font-semibold">No discussions yet</h3>
                <p className="max-w-xs mx-auto">Be the first to start a discussion and get the conversation going!</p>
              </div>
            </div>
          ) : (
            <ul className="space-y-6">
              {discussions.map(discussion => (
                <li key={discussion.id} className="p-4 rounded-lg border bg-card flex gap-4 items-start">
                   <Avatar>
                      <AvatarImage src={discussion.authorAvatar} alt={discussion.authorName} />
                      <AvatarFallback>{discussion.authorName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                        <h4 className="text-lg font-semibold">{discussion.title}</h4>
                        <time className="text-xs text-muted-foreground whitespace-nowrap">
                          {formatDistanceToNow(new Date(discussion.createdAt), { addSuffix: true })}
                        </time>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      By {discussion.authorName}
                    </p>
                    <p className="mt-3 text-sm">{discussion.message}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
