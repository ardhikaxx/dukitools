import { Inbox } from 'lucide-react';

interface EmptyStateProps {
  message?: string;
  icon?: React.ReactNode;
}

export default function EmptyState({ message = 'Belum ada data untuk ditampilkan.', icon }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      {icon ?? <Inbox size={36} className="text-slate-300" />}
      <p className="mt-3 text-sm text-slate-400">{message}</p>
    </div>
  );
}
