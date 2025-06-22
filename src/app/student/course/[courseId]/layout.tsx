import Link from 'next/link';
import { getCourse, getStudentProgress } from '@/lib/data';
import { getCurrentUser } from '@/lib/auth';
import { SidebarProvider, Sidebar, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarMenuSub, SidebarMenuSubItem, SidebarMenuSubButton } from '@/components/ui/sidebar';
import { CheckCircle, Circle } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export default async function CourseLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { courseId: string; lessonId: string };
}) {
  const { courseId } = params;
  const user = await getCurrentUser();
  const course = await getCourse(courseId);
  if (!user || !course) return <div>Loading...</div>;

  const progress = await getStudentProgress(user.id, course.id);
  const completedLessons = progress?.completedLessons || [];

  const allLessons = course.modules.flatMap(m => m.lessons);
  const defaultOpenModules = course.modules.filter(m => m.lessons.some(l => allLessons.find(lesson => lesson.id === params.lessonId))).map(m => m.id);

  return (
    <div className="grid md:grid-cols-[280px_1fr] h-[calc(100vh-4rem)]">
        <aside className="hidden md:flex flex-col border-r bg-card">
            <div className='p-4 border-b'>
                <h2 className='text-lg font-semibold tracking-tight'>{course.title}</h2>
            </div>
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
                                              className={`flex items-center gap-3 rounded-md p-2 text-sm transition-colors hover:bg-muted ${lesson.id === params.lessonId ? 'bg-muted font-semibold' : ''}`}
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
        </aside>
        <div className="flex flex-col">
            <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
    </div>
  );
}
