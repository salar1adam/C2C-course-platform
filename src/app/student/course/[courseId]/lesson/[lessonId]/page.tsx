import { getCourse, getStudentProgress } from "@/lib/data";
import { getCurrentUser } from "@/lib/auth";
import { notFound } from "next/navigation";
import { VideoPlayer } from "@/components/student/video-player";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { File, Download, CheckCircle } from "lucide-react";
import { markLessonCompleteAction } from "@/app/actions";
import { Badge } from "@/components/ui/badge";

function MarkCompleteButton({ lessonId, courseId, isCompleted }: { lessonId: string, courseId: string, isCompleted: boolean }) {
  if (isCompleted) {
    return <Badge variant="secondary" className="text-base font-semibold py-2 px-4 border-green-600 text-green-600"><CheckCircle className="mr-2 h-5 w-5" />Completed</Badge>;
  }
  
  return (
    <form action={async () => {
        'use server';
        await markLessonCompleteAction(lessonId, courseId);
    }}>
      <Button type="submit" size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
        <CheckCircle className="mr-2 h-5 w-5" />
        Mark as Complete
      </Button>
    </form>
  );
}

export default async function LessonPage({ params }: { params: { courseId: string, lessonId: string }}) {
  const user = await getCurrentUser();
  const course = await getCourse(params.courseId);

  if (!user || !course) notFound();

  const lesson = course.modules.flatMap(m => m.lessons).find(l => l.id === params.lessonId);
  if (!lesson) notFound();
  
  const progress = await getStudentProgress(user.id, course.id);
  const isCompleted = progress?.completedLessons.includes(lesson.id) ?? false;
  
  return (
    <div className="bg-background flex flex-col h-full">
      <main className="flex-1 p-4 md:p-6 lg:p-8 space-y-8">
        <VideoPlayer videoUrl={lesson.videoUrl} />

        <div className="container mx-auto max-w-5xl">
          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{lesson.title}</h1>
            <div className="flex-shrink-0">
                <MarkCompleteButton lessonId={lesson.id} courseId={course.id} isCompleted={isCompleted} />
            </div>
          </div>

          {lesson.resources.length > 0 && (
            <Card className="mt-8">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Download className="h-6 w-6" />
                  Downloadable Resources
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {lesson.resources.map(resource => (
                    <li key={resource.id}>
                      <a href={resource.url} download className="flex items-center justify-between p-3 rounded-lg bg-muted hover:bg-muted/80 transition-colors">
                        <div className="flex items-center gap-3">
                          <File className="h-5 w-5 text-primary" />
                          <span className="font-medium">{resource.name}</span>
                        </div>
                        <Download className="h-5 w-5 text-muted-foreground" />
                      </a>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
