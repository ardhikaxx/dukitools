import { useState, useCallback } from 'react';

export type ToolStatus = 'idle' | 'processing' | 'success' | 'error';

interface ToolStateShape<TInput, TResult> {
  input: TInput | null;
  result: TResult | null;
  status: ToolStatus;
  errorMessage: string | null;
  progress: number;
}

export function useToolState<TInput = unknown, TResult = unknown>() {
  const [state, setState] = useState<ToolStateShape<TInput, TResult>>({
    input: null,
    result: null,
    status: 'idle',
    errorMessage: null,
    progress: 0,
  });

  const setInput = useCallback((input: TInput) => setState((s) => ({ ...s, input })), []);
  const setProcessing = useCallback(() => setState((s) => ({ ...s, status: 'processing', errorMessage: null, progress: 0 })), []);
  const setProgress = useCallback((progress: number) => setState((s) => ({ ...s, progress })), []);
  const setSuccess = useCallback((result: TResult) => setState((s) => ({ ...s, status: 'success', result, progress: 100 })), []);
  const setError = useCallback((errorMessage: string) => setState((s) => ({ ...s, status: 'error', errorMessage })), []);
  const reset = useCallback(() => setState({ input: null, result: null, status: 'idle', errorMessage: null, progress: 0 }), []);

  return { state, setInput, setProcessing, setProgress, setSuccess, setError, reset };
}
