import Link from 'next/link';
import { ArrowRight, BookOpen } from 'lucide-react';
import { getCourse, getStudentProgress } from '@/lib/data';
import { getCurrentUser } from '@/lib/auth';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

export default async function StudentDashboard() {
  const user = await getCurrentUser();
  const course = await getCourse('og-101');
  if (!user || !course) {
    return <div>Could not load data.</div>;
  }

  const progress = await getStudentProgress(user.id, course.id);

  const totalLessons = course.modules.reduce((acc, module) => acc + module.lessons.length, 0);
  const completedLessons = progress?.completedLessons.length || 0;
  const progressPercentage = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;
  
  const firstLesson = course.modules[0]?.lessons[0];
  const firstUncompletedLesson = course.modules.flatMap(m => m.lessons).find(l => !progress?.completedLessons.includes(l.id))
  const continueLesson = firstUncompletedLesson || firstLesson;

  return (
    <div className="container mx-auto max-w-4xl py-8 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        Welcome back, {user.name.split(' ')[0]}!
      </h1>
      <p className="mt-2 text-lg text-muted-foreground">
        Continue your journey in mastering oil and gas exploration.
      </p>

      <div className="mt-12">
        <Card className="overflow-hidden shadow-lg transition-shadow hover:shadow-xl">
          <div className="md:flex">
            <div className="md:w-1/3">
              <img data-ai-hint="oil rig" src="https://placehold.co/600x400.png" alt="Oil rig" className="h-full w-full object-cover" />
            </div>
            <div className="flex flex-col p-6 md:w-2/3">
              <CardHeader className="p-0">
                <CardTitle className="text-2xl font-bold">{course.title}</CardTitle>
                <CardDescription className="mt-2 text-base">{course.description}</CardDescription>
              </CardHeader>
              <CardContent className="mt-4 flex-grow p-0">
                <div>
                    <div className='flex justify-between text-sm text-muted-foreground mb-1'>
                        <span>Progress</span>
                        <span>{completedLessons} / {totalLessons} Lessons</span>
                    </div>
                  <Progress value={progressPercentage} className="w-full" />
                </div>
              </CardContent>
              <CardFooter className="mt-6 p-0">
                <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                  <Link href={`/student/course/${course.id}/lesson/${continueLesson.id}`}>
                    Continue Learning
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </CardFooter>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
