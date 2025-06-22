'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { login, logout, getCurrentUser } from '@/lib/auth';
import { createStudent, updateStudentProgress, updateModule, updateLesson } from '@/lib/data';
import { generatePersonalizedWelcomeEmail } from '@/ai/flows/personalized-welcome-email';

export async function loginAction(formData: FormData) {
  const result = await login(formData);
  if (result.error) {
    // In a real app, you would handle this more gracefully.
    // For now, we just won't redirect.
    console.error(result.error);
    return result;
  }

  if (result.success) {
    const redirectUrl = result.role === 'admin' ? '/admin/dashboard' : '/student/dashboard';
    redirect(redirectUrl);
  }
}

export async function logoutAction() {
  await logout();
  redirect('/');
}

export async function markLessonCompleteAction(lessonId: string, courseId: string) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'student') {
    return { error: 'Unauthorized' };
  }

  try {
    await updateStudentProgress(user.id, courseId, lessonId);
    revalidatePath(`/student/course/${courseId}`);
    revalidatePath(`/student/dashboard`);
    return { success: true };
  } catch (error) {
    return { error: 'Failed to update progress' };
  }
}

export type CreateStudentFormState = {
  message: string;
  welcomeEmail?: string;
  status: 'idle' | 'success' | 'error';
};

export async function createStudentAction(
  prevState: CreateStudentFormState,
  formData: FormData
): Promise<CreateStudentFormState> {
  const studentName = formData.get('studentName') as string;
  const email = formData.get('email') as string;
  const learningInterests = formData.get('learningInterests') as string;

  if (!studentName || !email || !learningInterests) {
    return { message: 'All fields are required.', status: 'error' };
  }

  try {
    const newStudent = await createStudent(studentName, email);
    
    const aiInput = {
        studentName,
        courseName: 'Master Oil & Gas Exploration: From Core to Crust',
        registrationDate: new Date().toISOString().split('T')[0],
        learningInterests,
    };

    const { personalizedWelcomeMessage } = await generatePersonalizedWelcomeEmail(aiInput);

    revalidatePath('/admin/users');
    return {
      message: `Successfully created student: ${newStudent.name}.`,
      welcomeEmail: personalizedWelcomeMessage,
      status: 'success',
    };
  } catch (error) {
    console.error(error);
    return { message: 'Failed to create student.', status: 'error' };
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
  const moduleId = formData.get('moduleId') as string;
  const moduleTitle = formData.get('moduleTitle') as string;
  const courseId = formData.get('courseId') as string;

  if (!moduleId || !moduleTitle || !courseId) {
    return { message: 'Module ID, title, and course ID are required.', status: 'error' };
  }

  try {
    await updateModule(courseId, moduleId, moduleTitle);
    revalidatePath('/admin/courses');
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
  const lessonId = formData.get('lessonId') as string;
  const courseId = formData.get('courseId') as string;
  const lessonTitle = formData.get('lessonTitle') as string;
  const lessonVideoUrl = formData.get('lessonVideoUrl') as string;
  const resourcesToDelete = ((formData.get('resourcesToDelete') as string) || '').split(',').filter(Boolean);
  const newResourceFiles = formData.getAll('newResources') as File[];

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
  
  const newResources = newResourceFiles.filter(f => f.size > 0).map(file => ({ name: file.name }));

  try {
    await updateLesson(courseId, lessonId, { 
      title: lessonTitle,
      videoUrl: lessonVideoUrl,
      resourcesToDelete,
      newResources
    });
    revalidatePath('/admin/courses');
    // Also revalidate the student view of this lesson
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
