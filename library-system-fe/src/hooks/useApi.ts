// Generic API hook with loading and error states

import { useState, useCallback } from 'react';
import type { ApiError } from '../types/api';

interface UseApiState<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useApi<T, Args extends any[] = []>(
  apiFunction: (...args: Args) => Promise<T>
) {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    isLoading: false,
    error: null,
  });

  const execute = useCallback(
    async (...args: Args) => {
      setState({ data: null, isLoading: true, error: null });

      try {
        const result = await apiFunction(...args);
        setState({ data: result, isLoading: false, error: null });
        return result;
      } catch (err) {
        const apiError = err as ApiError;
        const errorMessage = apiError.message || 'An error occurred';
        setState({ data: null, isLoading: false, error: errorMessage });
        throw err;
      }
    },
    [apiFunction]
  );

  const reset = useCallback(() => {
    setState({ data: null, isLoading: false, error: null });
  }, []);

  return {
    ...state,
    execute,
    reset,
  };
}

// Specialized hook for mutations (create, update, delete)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useMutation<T, Args extends any[] = []>(
  mutationFunction: (...args: Args) => Promise<T>
) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = useCallback(
    async (...args: Args) => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await mutationFunction(...args);
        return result;
      } catch (err) {
        const apiError = err as ApiError;
        const errorMessage = apiError.message || 'An error occurred';
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [mutationFunction]
  );

  return {
    mutate,
    isLoading,
    error,
  };
}
