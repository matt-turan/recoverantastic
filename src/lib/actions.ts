'use server';

import { generateAffirmation } from '@/ai/flows/generate-affirmation';
import { z } from 'zod';

const schema = z.object({
  progressSummary: z.string().min(10, {
    message: 'Progress summary must be at least 10 characters long.',
  }),
  goals: z
    .string()
    .min(5, { message: 'Goals must be at least 5 characters long.' }),
});

export async function getAffirmation(
  prevState: { affirmation: string; error: string },
  formData: FormData
) {
  const validatedFields = schema.safeParse({
    progressSummary: formData.get('progressSummary'),
    goals: formData.get('goals'),
  });

  if (!validatedFields.success) {
    return {
      affirmation: '',
      error: validatedFields.error.flatten().fieldErrors.goals?.[0] || validatedFields.error.flatten().fieldErrors.progressSummary?.[0] || 'Invalid input.',
    };
  }

  try {
    const { affirmation } = await generateAffirmation(validatedFields.data);
    return { affirmation, error: '' };
  } catch (e) {
    console.error(e);
    return {
      affirmation: '',
      error: 'Failed to generate affirmation. Please try again later.',
    };
  }
}
