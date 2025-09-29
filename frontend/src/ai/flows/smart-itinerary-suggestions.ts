// A Genkit flow to provide smart itinerary suggestions based on origin and destination countries.

'use server';

/**
 * @fileOverview This file defines a Genkit flow for providing visa suggestions based on user's travel plans.
 *
 * - `getSmartItinerarySuggestions` -  A function that takes origin and destination countries as input and returns visa suggestions.
 * - `SmartItinerarySuggestionsInput` - The input type for the getSmartItinerarySuggestions function.
 * - `SmartItinerarySuggestionsOutput` - The output type for the getSmartItinerarySuggestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SmartItinerarySuggestionsInputSchema = z.object({
  originCountry: z.string().describe('The country the user is traveling from.'),
  destinationCountry: z.string().describe('The country the user is traveling to.'),
});

export type SmartItinerarySuggestionsInput = z.infer<typeof SmartItinerarySuggestionsInputSchema>;

const SmartItinerarySuggestionsOutputSchema = z.object({
  visaSuggestions: z.string().describe('Visa suggestions based on the origin and destination countries.'),
});

export type SmartItinerarySuggestionsOutput = z.infer<typeof SmartItinerarySuggestionsOutputSchema>;

export async function getSmartItinerarySuggestions(input: SmartItinerarySuggestionsInput): Promise<SmartItinerarySuggestionsOutput> {
  return smartItinerarySuggestionsFlow(input);
}

const smartItinerarySuggestionsPrompt = ai.definePrompt({
  name: 'smartItinerarySuggestionsPrompt',
  input: {schema: SmartItinerarySuggestionsInputSchema},
  output: {schema: SmartItinerarySuggestionsOutputSchema},
  prompt: `You are a professional visa consultant. A user is traveling from {{originCountry}} to {{destinationCountry}}. Suggest relevant visa options for this itinerary. Consider tourist visas, business visas, and any other relevant visa types. Explain the requirements to the user in a conversational way.
`,
});

const smartItinerarySuggestionsFlow = ai.defineFlow(
  {
    name: 'smartItinerarySuggestionsFlow',
    inputSchema: SmartItinerarySuggestionsInputSchema,
    outputSchema: SmartItinerarySuggestionsOutputSchema,
  },
  async input => {
    const {output} = await smartItinerarySuggestionsPrompt(input);
    return output!;
  }
);
