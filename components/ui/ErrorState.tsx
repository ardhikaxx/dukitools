import { AlertCircle, RotateCcw } from 'lucide-react';
import Button from './Button';

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

export default function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <AlertCircle size={36} className="text-red-400" />
      <p className="mt-3 text-sm text-red-600">{message}</p>
      {onRetry && (
        <Button variant="secondary" onClick={onRetry} className="mt-4">
          <RotateCcw size={16} className="mr-1.5" /> Coba Lagi
        </Button>
      )}
    </div>
  );
}
