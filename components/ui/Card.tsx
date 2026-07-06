import { cn } from '@/lib/utils/cn';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export default function Card({ children, className }: CardProps) {
  return (
    <div className={cn('rounded-2xl border border-slate-100 bg-white p-5 shadow-sm', className)}>
      {children}
    </div>
  );
}
