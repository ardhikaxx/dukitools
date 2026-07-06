'use client';

import { forwardRef, TextareaHTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(({ label, error, className, id, ...props }, ref) => {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className="space-y-1">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-slate-700">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        id={inputId}
        className={cn(
          'w-full rounded-lg border px-3 py-2 text-sm outline-none transition resize-y min-h-[100px]',
          error ? 'border-red-300 focus:border-red-500' : 'border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100',
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
});
Textarea.displayName = 'Textarea';

export default Textarea;
