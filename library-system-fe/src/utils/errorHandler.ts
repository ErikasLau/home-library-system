import type { ApiError } from '../types/api';

/**
 * Format API error for display
 */
export function formatApiError(error: unknown): string {
  if (!error) return 'An unknown error occurred';

  const apiError = error as ApiError;

  if (apiError.error) {
    return apiError.error.message;
  }

  if (apiError.errors && Array.isArray(apiError.errors)) {
    const errorMessages = apiError.errors
      .map((e) => `${e.field}: ${e.message}`)
      .join('\n');
    return errorMessages || apiError.message;
  }

  switch (apiError.status) {
    case 400:
      return apiError.message || 'Invalid request. Please check your input.';
    case 401:
      return apiError.message || 'You are not authenticated. Please log in.';
    case 403:
      return 'You do not have permission to perform this action.';
    case 404:
      return apiError.message || 'The requested resource was not found.';
    case 409:
      return apiError.message || 'A conflict occurred. The resource may already exist.';
    case 500:
      return 'A server error occurred. Please try again later.';
    default:
      return apiError.message || 'An error occurred';
  }
}

/**
 * Check if error is authentication related
 */
export function isAuthError(error: unknown): boolean {
  const apiError = error as ApiError;
  return apiError?.status === 401;
}

/**
 * Check if error is permission related
 */
export function isPermissionError(error: unknown): boolean {
  const apiError = error as ApiError;
  return apiError?.status === 403;
}

/**
 * Check if error is validation related
 */
export function isValidationError(error: unknown): boolean {
  const apiError = error as ApiError;
  return apiError?.status === 400 && !!apiError.errors;
}

/**
 * Get validation errors as array
 */
export function getValidationErrors(error: unknown): Array<{ field: string; message: string }> | null {
  const apiError = error as ApiError;
  if (apiError?.errors && Array.isArray(apiError.errors)) {
    return apiError.errors;
  }
  return null;
}
