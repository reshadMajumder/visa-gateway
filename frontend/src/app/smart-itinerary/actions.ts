'use server';

import { getSmartItinerarySuggestions } from '@/ai/flows/smart-itinerary-suggestions';
import { z } from 'zod';

const schema = z.object({
  originCountry: z.string(),
  destinationCountry: z.string(),
});

type State = {
  suggestions?: string;
  error?: string;
} | null;

export async function getSmartItinerarySuggestionsAction(
  prevState: State,
  formData: FormData
): Promise<State> {
  try {
    const validatedFields = schema.safeParse({
      originCountry: formData.get('originCountry'),
      destinationCountry: formData.get('destinationCountry'),
    });

    if (!validatedFields.success) {
      return { error: 'Invalid input data.' };
    }
    
    if (validatedFields.data.originCountry === validatedFields.data.destinationCountry) {
        return { error: 'Origin and destination countries cannot be the same.' };
    }

    const result = await getSmartItinerarySuggestions(validatedFields.data);

    if (result.visaSuggestions) {
      return { suggestions: result.visaSuggestions };
    } else {
      return { error: 'Could not generate suggestions. Please try again.' };
    }
  } catch (error) {
    console.error(error);
    return { error: 'An unexpected error occurred. Please try again later.' };
  }
}
