'use server';
/**
 * @fileoverview A flow for generating a journal prompt based on a user's mood.
 *
 * - generateJournalPrompt - A function that calls the Genkit flow.
 * - GenerateJournalPromptInput - The input type for the flow.
 * - GenerateJournalPromptOutput - The return type for the flow.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateJournalPromptInputSchema = z.object({
  mood: z.string().describe('The user-selected mood.'),
});
export type GenerateJournalPromptInput = z.infer<
  typeof GenerateJournalPromptInputSchema
>;

const GenerateJournalPromptOutputSchema = z.object({
  prompt: z
    .string()
    .describe('The generated journal prompt for the user to write about.'),
});
export type GenerateJournalPromptOutput = z.infer<
  typeof GenerateJournalPromptOutputSchema
>;

export async function generateJournalPrompt(
  input: GenerateJournalPromptInput
): Promise<GenerateJournalPromptOutput> {
  return generateJournalPromptFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateJournalPrompt',
  input: { schema: GenerateJournalPromptInputSchema },
  output: { schema: GenerateJournalPromptOutputSchema },
  prompt: `You are a therapeutic journal assistant. Your purpose is to provide a single, non-judgmental, open-ended question to help a user explore their feelings.

The user has selected the mood: {{{mood}}}

Generate one thoughtful question based on this mood to serve as a writing prompt.

Do NOT be conversational. Do NOT include any preamble or explanation. Your entire response must be only the question itself.
Do NOT use platitudes or overly cheerful language. The tone should be neutral, introspective, and empathetic.
The question should be short and easy to understand.

Example for 'Overwhelmed': "What is one small part of this feeling that you could describe right now?"
Example for 'Grateful': "What is one detail about this feeling of gratitude that you want to remember?"
Example for 'Anxious': "What is the story that my anxiety is telling me right now?"
Example for 'Numb': "If this feeling of numbness had a color, what would it be and why?"
`,
});

const generateJournalPromptFlow = ai.defineFlow(
  {
    name: 'generateJournalPromptFlow',
    inputSchema: GenerateJournalPromptInputSchema,
    outputSchema: GenerateJournalPromptOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
