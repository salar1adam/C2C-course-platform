
import Link from 'next/link';
import { getCourse, getStudentProgress } from '@/lib/database.server';
import { getCurrentUser } from '@/lib/auth.server';
import { CheckCircle, Circle, Menu } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Sheet, SheetClose, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';

export default async function CourseLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { courseId: string; lessonId?: string };
}) {
  const { courseId, lessonId } = params;
  const user = await getCurrentUser();
  const course = await getCourse(courseId);
  if (!user || !course) return <div>Loading...</div>;

  const progress = await getStudentProgress(user.id, course.id);
  const completedLessons = progress?.completedLessons || [];

  const defaultOpenModules = course.modules.filter(m => m.lessons.some(l => l.id === lessonId)).map(m => m.id);
  const currentLessonTitle = course.modules.flatMap(m => m.lessons).find(l => l.id === lessonId)?.title;

  const DesktopNavigation = (
    <div className='flex-1 overflow-y-auto'>
        <Accordion type="multiple" defaultValue={defaultOpenModules} className="w-full">
            {course.modules.map((module) => (
                <AccordionItem value={module.id} key={module.id}>
                    <AccordionTrigger className='px-4 text-base font-medium hover:no-underline hover:bg-muted/50'>
                        {module.title}
                    </AccordionTrigger>
                    <AccordionContent>
                        <ul className='space-y-1 p-2'>
                        {module.lessons.map((lesson) => (
                            <li key={lesson.id}>
                                <Link href={`/student/course/${courseId}/lesson/${lesson.id}`} 
                                      className={`flex items-center gap-3 rounded-md p-2 text-sm transition-colors hover:bg-muted ${lesson.id === lessonId ? 'bg-muted font-semibold' : ''}`}
                                >
                                    {completedLessons.includes(lesson.id) ? 
                                        <CheckCircle className="h-5 w-5 text-green-500" /> : 
                                        <Circle className="h-5 w-5 text-muted-foreground" />}
                                    <span className="flex-1">{lesson.title}</span>
                                </Link>
                            </li>
                        ))}
                        </ul>
                    </AccordionContent>
                </AccordionItem>
            ))}
        </Accordion>
    </div>
  );

  const MobileNavigation = (
    <div className='flex-1 overflow-y-auto'>
        <Accordion type="multiple" defaultValue={defaultOpenModules} className="w-full">
            {course.modules.map((module) => (
                <AccordionItem value={module.id} key={module.id}>
                    <AccordionTrigger className='px-4 text-base font-medium hover:no-underline hover:bg-muted/50'>
                        {module.title}
                    </AccordionTrigger>
                    <AccordionContent>
                        <ul className='space-y-1 p-2'>
                        {module.lessons.map((lesson) => (
                            <li key={lesson.id}>
                                <SheetClose asChild>
                                    <Link href={`/student/course/${courseId}/lesson/${lesson.id}`} 
                                          className={`flex w-full items-center gap-3 rounded-md p-2 text-sm transition-colors hover:bg-muted ${lesson.id === lessonId ? 'bg-muted font-semibold' : ''}`}
                                    >
                                        {completedLessons.includes(lesson.id) ? 
                                            <CheckCircle className="h-5 w-5 text-green-500" /> : 
                                            <Circle className="h-5 w-5 text-muted-foreground" />}
                                        <span className="flex-1 text-left">{lesson.title}</span>
                                    </Link>
                                </SheetClose>
                            </li>
                        ))}
                        </ul>
                    </AccordionContent>
                </AccordionItem>
            ))}
        </Accordion>
    </div>
  );

  return (
    <div className="grid md:grid-cols-[280px_1fr] h-[calc(100vh-4rem)]">
        <aside className="hidden md:flex flex-col border-r bg-card">
            <div className='p-4 border-b'>
                <h2 className='text-lg font-semibold tracking-tight'>{course.title}</h2>
            </div>
            {DesktopNavigation}
        </aside>
        
        <div className="flex flex-col">
            <header className="flex h-16 items-center gap-4 border-b bg-background px-4 md:hidden">
                <Sheet>
                    <SheetTrigger asChild>
                        <Button
                            variant="outline"
                            size="icon"
                            className="shrink-0"
                        >
                            <Menu className="h-5 w-5" />
                            <span className="sr-only">Toggle navigation menu</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="flex flex-col p-0">
                        <div className='p-4 border-b'>
                             <h2 className='text-lg font-semibold tracking-tight'>{course.title}</h2>
                        </div>
                        {MobileNavigation}
                    </SheetContent>
                </Sheet>
                 <div className="flex-1">
                    <h1 className="font-semibold text-lg truncate" title={currentLessonTitle || course.title}>
                      {currentLessonTitle || 'Course Overview'}
                    </h1>
                 </div>
            </header>
            
            <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
    </div>
  );
}
