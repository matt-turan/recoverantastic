// src/ai/flows/generate-affirmation.ts
'use server';

/**
 * @fileOverview A flow to generate personalized AI affirmations based on user progress and goals.
 *
 * - generateAffirmation - A function that generates a personalized affirmation.
 * - GenerateAffirmationInput - The input type for the generateAffirmation function.
 * - GenerateAffirmationOutput - The return type for the generateAffirmation function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateAffirmationInputSchema = z.object({
  progressSummary: z
    .string()
    .describe('A summary of the user\'s recovery progress.'),
  goals: z.string().describe('The user\'s stated recovery goals.'),
});
export type GenerateAffirmationInput = z.infer<typeof GenerateAffirmationInputSchema>;

const GenerateAffirmationOutputSchema = z.object({
  affirmation: z
    .string()
    .describe('An AI-generated personalized affirmation for the user.'),
});
export type GenerateAffirmationOutput = z.infer<typeof GenerateAffirmationOutputSchema>;

export async function generateAffirmation(
  input: GenerateAffirmationInput
): Promise<GenerateAffirmationOutput> {
  return generateAffirmationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateAffirmationPrompt',
  input: { schema: GenerateAffirmationInputSchema },
  output: { schema: GenerateAffirmationOutputSchema },
  prompt: `You are an AI assistant designed to provide personalized affirmations for individuals in recovery.

  Based on the user's progress summary and goals, generate a single, motivational affirmation.
  The affirmation should be positive, encouraging, and tailored to their specific situation.

  Progress Summary: {{{progressSummary}}}
  Goals: {{{goals}}}

  Affirmation:`,
});

const generateAffirmationFlow = ai.defineFlow(
  {
    name: 'generateAffirmationFlow',
    inputSchema: GenerateAffirmationInputSchema,
    outputSchema: GenerateAffirmationOutputSchema,
  },
  async input => {
    const { output } = await prompt(input);
    return output!;
  }
);
