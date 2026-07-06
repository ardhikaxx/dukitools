import { cn } from '@/lib/utils/cn';

interface ProgressBarProps {
  progress: number;
  className?: string;
}

export default function ProgressBar({ progress, className }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, progress));
  return (
    <div className={cn('h-2 w-full rounded-full bg-slate-100', className)}>
      <div
        className="h-full rounded-full bg-indigo-600 transition-all duration-300"
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
