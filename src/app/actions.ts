'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { login, logout, getCurrentUser } from '@/lib/auth';
import { createStudent, updateStudentProgress } from '@/lib/data';
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
