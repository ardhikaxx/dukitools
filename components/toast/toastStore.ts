'use client';

import { create } from 'zustand';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastItem {
  id: string;
  type: ToastType;
  message: string;
  duration: number;
}

interface ToastStoreState {
  toasts: ToastItem[];
  push: (type: ToastType, message: string, duration?: number) => void;
  dismiss: (id: string) => void;
}

const MAX_TOASTS = 3;
const DEFAULT_DURATION = 4000;

export const useToastStore = create<ToastStoreState>((set) => ({
  toasts: [],
  push: (type, message, duration = DEFAULT_DURATION) => {
    const id = crypto.randomUUID();
    set((s) => ({ toasts: [...s.toasts, { id, type, message, duration }].slice(-MAX_TOASTS) }));
    setTimeout(() => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })), duration);
  },
  dismiss: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));

export function useToast() {
  const push = useToastStore((s) => s.push);
  return {
    success: (msg: string) => push('success', msg),
    error: (msg: string) => push('error', msg),
    warning: (msg: string) => push('warning', msg),
    info: (msg: string) => push('info', msg),
  };
}
