'use client';

import { CheckCircle2, XCircle, AlertTriangle, Info, X } from 'lucide-react';
import { ToastItem, useToastStore } from './toastStore';
import { cn } from '@/lib/utils/cn';

const CONFIG = {
  success: { icon: CheckCircle2, className: 'border-emerald-200 bg-emerald-50 text-emerald-700' },
  error: { icon: XCircle, className: 'border-red-200 bg-red-50 text-red-700' },
  warning: { icon: AlertTriangle, className: 'border-amber-200 bg-amber-50 text-amber-700' },
  info: { icon: Info, className: 'border-blue-200 bg-blue-50 text-blue-700' },
};

export default function Toast({ toast }: { toast: ToastItem }) {
  const dismiss = useToastStore((s) => s.dismiss);
  const { icon: Icon, className } = CONFIG[toast.type];

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        'flex w-80 items-start gap-3 rounded-xl border p-3 shadow-lg animate-in slide-in-from-right-4 fade-in',
        className
      )}
    >
      <Icon size={20} className="mt-0.5 shrink-0" />
      <p className="flex-1 text-sm">{toast.message}</p>
      <button onClick={() => dismiss(toast.id)} aria-label="Tutup notifikasi" className="opacity-60 hover:opacity-100">
        <X size={16} />
      </button>
    </div>
  );
}
