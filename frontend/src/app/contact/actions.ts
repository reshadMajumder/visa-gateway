'use server';

import { z } from 'zod';
import { API_BASE_URL } from '@/lib/data';

const BookConsultationSchema = z.object({
  scheduled_at: z.string(),
  email_or_phone: z.string().min(1, 'Email or phone is required'),
  preferred_country: z.string().min(1, 'Please select a country'),
  notes: z.string().optional(),
});

type State = {
  success: boolean;
  message: string;
};

export async function bookConsultationAction(
  prevState: State | null,
  formData: FormData
): Promise<State> {
  const validatedFields = BookConsultationSchema.safeParse({
    scheduled_at: formData.get('scheduled_at'),
    email_or_phone: formData.get('email_or_phone'),
    preferred_country: formData.get('preferred_country'),
    notes: formData.get('notes'),
  });

  if (!validatedFields.success) {
    return {
      success: false,
      message:
        validatedFields.error.flatten().fieldErrors.email_or_phone?.[0] ||
        validatedFields.error.flatten().fieldErrors.preferred_country?.[0] ||
        'Invalid data provided.',
    };
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/book-consultation/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(validatedFields.data),
    });

    const responseData = await response.json();

    if (response.ok) {
      return { success: true, message: responseData.message };
    } else {
      return {
        success: false,
        message: responseData.message || 'Failed to book consultation.',
      };
    }
  } catch (error) {
    console.error('Book consultation error:', error);
    return { success: false, message: 'An unexpected error occurred.' };
  }
}
