import { redirect } from 'next/navigation';
import { getCourse, getStudentProgress } from '@/lib/data';
import { getCurrentUser } from '@/lib/auth';

export default async function CoursePage({ params }: { params: { courseId: string } }) {
  const { courseId } = params;
  const user = await getCurrentUser();
  const course = await getCourse(courseId);

  if (!user || !course) {
    redirect('/student/dashboard');
  }

  const progress = await getStudentProgress(user.id, course.id);
  
  const firstLesson = course.modules[0]?.lessons[0];
  const firstUncompletedLesson = course.modules.flatMap(m => m.lessons).find(l => !progress?.completedLessons.includes(l.id));
  
  const continueLesson = firstUncompletedLesson || firstLesson;

  if (continueLesson) {
    redirect(`/student/course/${courseId}/lesson/${continueLesson.id}`);
  } else {
    // If there are no lessons in the course, redirect to dashboard
    redirect('/student/dashboard');
  }
}
