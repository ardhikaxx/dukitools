import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  label?: string;
}

export default function LoadingSpinner({ label }: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <Loader2 size={36} className="animate-spin text-indigo-600" />
      {label && <p className="mt-4 text-sm text-slate-500">{label}</p>}
    </div>
  );
}
