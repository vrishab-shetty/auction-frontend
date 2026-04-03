import { AxiosError } from 'axios';
import { Result } from '@/api/types';

export const extractFieldErrors = (error: unknown): Record<string, string> => {
  const fieldErrors: Record<string, string> = {};
  
  if (!error) return fieldErrors;
  
  if (error instanceof AxiosError && error.response?.data) {
    const result = error.response.data as Result<any>;
    if (!result.success && result.data && typeof result.data === 'object') {
      // The backend returns a map of fieldName -> errorMessage in result.data
      Object.keys(result.data).forEach(key => {
        if (typeof result.data[key] === 'string') {
          // Normalize some common variations
          let normalizedKey = key;
          if (key === 'zipcode') normalizedKey = 'zipCode';
          
          fieldErrors[normalizedKey] = result.data[key];
        }
      });
    } else if (!result.success && result.message) {
      fieldErrors['general'] = result.message;
    }
  } else if (error instanceof Error) {
    fieldErrors['general'] = error.message;
  } else {
    fieldErrors['general'] = 'An unknown error occurred.';
  }

  return fieldErrors;
};
