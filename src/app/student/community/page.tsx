
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, MessageSquare } from "lucide-react";

export default function CommunityPage() {
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
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Start Discussion
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Discussions</CardTitle>
          <CardDescription>
            Join the conversation or start a new one.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center text-muted-foreground py-24">
          <div className="flex flex-col items-center gap-4">
            <MessageSquare className="h-16 w-16 text-muted-foreground/30" />
            <h3 className="text-xl font-semibold">No discussions yet</h3>
            <p className="max-w-xs mx-auto">Be the first to start a discussion and get the conversation going!</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
