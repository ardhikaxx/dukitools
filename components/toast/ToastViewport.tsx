'use client';

import { useToastStore } from './toastStore';
import Toast from './Toast';

export default function ToastViewport() {
  const toasts = useToastStore((s) => s.toasts);
  return (
    <div className="fixed right-4 top-4 z-[100] flex flex-col gap-2 pointer-events-none">
      {toasts.map((t) => (
        <div key={t.id} className="pointer-events-auto">
          <Toast toast={t} />
        </div>
      ))}
    </div>
  );
}
