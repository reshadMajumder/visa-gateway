
'use server';

import { API_BASE_URL } from '@/lib/data';
import { z } from 'zod';

const schema = z.object({
  countryId: z.string(),
  visaTypeId: z.string(),
  accessToken: z.string(),
});

type State = {
  success: boolean;
  error?: string;
  data?: any;
};

export async function createApplicationAction(input: { countryId: string, visaTypeId: string, accessToken: string }): Promise<State> {
  const validatedFields = schema.safeParse(input);

  if (!validatedFields.success) {
    return { success: false, error: 'Invalid input data.' };
  }

  const { countryId, visaTypeId, accessToken } = validatedFields.data;

  try {
    const formData = new FormData();
    formData.append('country_id', countryId);
    formData.append('visa_type_id', visaTypeId);

    const response = await fetch(`${API_BASE_URL}/api/v2/visa-applications/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
      body: formData,
    });

    const responseData = await response.json();

    if (response.ok) {
      return { success: true, data: responseData };
    } else {
      return { success: false, error: responseData.message || 'Failed to create application.' };
    }
  } catch (error) {
    console.error('Create application error:', error);
    return { success: false, error: 'An unexpected error occurred.' };
  }
}

export async function createApplicationWithDocumentsAction(input: { formData: FormData, accessToken: string }): Promise<State> {
  const { formData, accessToken } = input;

  try {
    const response = await fetch(`${API_BASE_URL}/api/v2/visa-applications/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
      body: formData,
    });
    
    const responseData = await response.json();

    if (response.ok) {
      return { success: true, data: responseData };
    } else {
      // Handle nested error messages
      let errorMessage = 'Failed to create application with documents.';
      if (typeof responseData.message === 'object' && responseData.message !== null) {
          errorMessage = Object.values(responseData.message).flat().join(' ');
      } else if (responseData.message) {
          errorMessage = responseData.message;
      }
      return { success: false, error: errorMessage };
    }
  } catch (error) {
    console.error('Create application with documents error:', error);
    return { success: false, error: 'An unexpected error occurred while uploading documents.' };
  }
}


export async function updateApplicationDocumentsAction(input: { applicationId: string, formData: FormData, accessToken: string }): Promise<State> {
  const { applicationId, formData, accessToken } = input;

  try {
    const response = await fetch(`${API_BASE_URL}/api/v2/visa-applications/${applicationId}/`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
      body: formData,
    });
    
    const responseData = await response.json();

    if (response.ok) {
      return { success: true, data: responseData };
    } else {
      let errorMessage = 'Failed to update documents.';
      if (typeof responseData.message === 'object' && responseData.message !== null) {
          errorMessage = Object.values(responseData.message).flat().join(' ');
      } else if (responseData.message) {
          errorMessage = responseData.message;
      }
      return { success: false, error: errorMessage };
    }
  } catch (error) {
    console.error('Update documents error:', error);
    return { success: false, error: 'An unexpected error occurred while updating documents.' };
  }
}
