/**
 * Common error types for the application
 */

/**
 * Generic error with a message property
 */
export interface ErrorWithMessage {
  message?: string;
}

/**
 * API error response structure
 */
export interface ApiError {
  response?: {
    data?: {
      message?: string;
      errors?: Record<string, string[]>;
    };
    status?: number;
  };
  message?: string;
}

/**
 * Type guard to check if an unknown error has a message property
 */
export function isErrorWithMessage(error: unknown): error is ErrorWithMessage {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as ErrorWithMessage).message === 'string'
  );
}

/**
 * Extract error message from any error object
 */
export function getErrorMessage(error: unknown): string {
  if (isErrorWithMessage(error)) {
    return error.message || 'An error occurred';
  }

  // Check if it's an API error
  const apiError = error as ApiError;
  if (apiError?.response?.data?.message) {
    return apiError.response.data.message;
  }

  return 'An unexpected error occurred';
}