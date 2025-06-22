'use server';

/**
 * @fileOverview AI-powered flow to generate personalized welcome messages for new students.
 *
 * - generatePersonalizedWelcomeEmail - A function that generates a personalized welcome email.
 * - PersonalizedWelcomeEmailInput - The input type for the generatePersonalizedWelcomeEmail function.
 * - PersonalizedWelcomeEmailOutput - The return type for the generatePersonalizedWelcomeEmail function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizedWelcomeEmailInputSchema = z.object({
  studentName: z.string().describe('The name of the student.'),
  courseName: z.string().describe('The name of the course the student registered for.'),
  registrationDate: z.string().describe('The date the student registered for the course (e.g., YYYY-MM-DD).'),
  learningInterests: z
    .string()
    .describe('The student’s learning interests related to the course.'),
});
export type PersonalizedWelcomeEmailInput = z.infer<
  typeof PersonalizedWelcomeEmailInputSchema
>;

const PersonalizedWelcomeEmailOutputSchema = z.object({
  personalizedWelcomeMessage: z
    .string()
    .describe('A personalized welcome message for the student.'),
});
export type PersonalizedWelcomeEmailOutput = z.infer<
  typeof PersonalizedWelcomeEmailOutputSchema
>;

export async function generatePersonalizedWelcomeEmail(
  input: PersonalizedWelcomeEmailInput
): Promise<PersonalizedWelcomeEmailOutput> {
  return personalizedWelcomeEmailFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizedWelcomeEmailPrompt',
  input: {schema: PersonalizedWelcomeEmailInputSchema},
  output: {schema: PersonalizedWelcomeEmailOutputSchema},
  prompt: `You are an AI assistant tasked with generating personalized welcome messages for new students enrolling in online courses.

  Given the following information about the student and the course, create a warm and engaging welcome message that highlights the student's interests and encourages them to start learning.

  Student Name: {{{studentName}}}
  Course Name: {{{courseName}}}
  Registration Date: {{{registrationDate}}}
  Learning Interests: {{{learningInterests}}}

  Compose a welcome message that is approximately 100-150 words in length.
`,
});

const personalizedWelcomeEmailFlow = ai.defineFlow(
  {
    name: 'personalizedWelcomeEmailFlow',
    inputSchema: PersonalizedWelcomeEmailInputSchema,
    outputSchema: PersonalizedWelcomeEmailOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
