
'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { getCurrentUser } from '@/lib/auth.server';

export type LoginFormState = {
  message: string;
  status: 'idle' | 'success' | 'error';
};

export async function loginAction(
  prevState: LoginFormState,
  formData: FormData
): Promise<LoginFormState> {
  const { login } = await import('@/lib/auth.server');
  const result = await login(formData);

  if (result.error) {
    return {
      message: result.error,
      status: 'error',
    };
  }

  if (result.success) {
    const redirectUrl =
      result.role === 'admin' ? '/admin/dashboard' : '/student/dashboard';
    redirect(redirectUrl);
  }

  // This part is not expected to be reached because redirect() throws an error,
  // but it's here to satisfy TypeScript's return type requirement.
  return { message: 'An unexpected error occurred.', status: 'error' };
}


export async function logoutAction() {
  const { logout } = await import('@/lib/auth.server');
  await logout();
  redirect('/');
}

export async function markLessonCompleteAction(
  lessonId: string,
  courseId: string
) {
  const { getCurrentUser } = await import('@/lib/auth.server');
  const { updateStudentProgress } = await import('@/lib/database.server');
  const user = await getCurrentUser();
  if (!user || user.role !== 'student') {
    return { error: 'Unauthorized' };
  }

  try {
    await updateStudentProgress(user.id, courseId, lessonId);
    revalidatePath(`/student/course/${courseId}`, 'layout');
    revalidatePath(`/student/course/${courseId}/lesson/${lessonId}`);
    revalidatePath(`/student/dashboard`);
    return { success: true };
  } catch (error) {
    return { error: 'Failed to update progress' };
  }
}

export type UpdateModuleFormState = {
  message: string;
  status: 'idle' | 'success' | 'error';
};

export async function updateModuleAction(
  prevState: UpdateModuleFormState,
  formData: FormData
): Promise<UpdateModuleFormState> {
  const { updateModule } = await import('@/lib/database.server');
  const moduleId = formData.get('moduleId') as string;
  const moduleTitle = formData.get('moduleTitle') as string;
  const courseId = formData.get('courseId') as string;

  if (!moduleId || !moduleTitle || !courseId) {
    return {
      message: 'Module ID, title, and course ID are required.',
      status: 'error',
    };
  }

  try {
    await updateModule(courseId, moduleId, moduleTitle);
    revalidatePath('/admin/courses');
    revalidatePath(`/student/course/${courseId}`, 'layout');
    return {
      message: `Successfully updated module.`,
      status: 'success',
    };
  } catch (error) {
    console.error(error);
    return { message: 'Failed to update module.', status: 'error' };
  }
}

export type UpdateLessonFormState = {
  message: string;
  status: 'idle' | 'success' | 'error';
};

export async function updateLessonAction(
  prevState: UpdateLessonFormState,
  formData: FormData
): Promise<UpdateLessonFormState> {
  const { updateLesson } = await import('@/lib/database.server');

  const lessonId = formData.get('lessonId') as string;
  const courseId = formData.get('courseId') as string;
  const lessonTitle = formData.get('lessonTitle') as string;
  const lessonVideoUrl = formData.get('lessonVideoUrl') as string;

  if (!lessonId) {
    return { message: 'Lesson ID is missing. Please try again.', status: 'error' };
  }
  if (!courseId) {
    return { message: 'Course ID is missing. Please try again.', status: 'error' };
  }
  if (!lessonTitle) {
    return { message: 'Lesson title cannot be empty.', status: 'error' };
  }
  if (!lessonVideoUrl) {
    return { message: 'Lesson video URL cannot be empty.', status: 'error' };
  }

  try {
    await updateLesson(courseId, lessonId, {
      title: lessonTitle,
      videoUrl: lessonVideoUrl,
    });
    revalidatePath('/admin/courses');
    revalidatePath(`/student/course/${courseId}`, 'layout');
    revalidatePath(`/student/course/${courseId}/lesson/${lessonId}`);
    return {
      message: `Successfully updated lesson.`,
      status: 'success',
    };
  } catch (error) {
    console.error(error);
    return { message: 'Failed to update lesson.', status: 'error' };
  }
}

export async function setViewModeAction(formData: FormData) {
  const user = await getCurrentUser();
  if (user?.role !== 'admin') {
    // This action is only for admins
    return;
  }

  const mode = formData.get('mode') as 'student' | 'admin';

  if (mode === 'student') {
    cookies().set('view_mode', 'student', { path: '/' });
    redirect('/student/dashboard');
  } else {
    cookies().delete('view_mode');
    redirect('/admin/dashboard');
  }
}
