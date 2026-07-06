import { CheckCircle2 } from 'lucide-react';

interface ToolBenefitsProps {
  benefits: string[];
}

export default function ToolBenefits({ benefits }: ToolBenefitsProps) {
  if (!benefits.length) return null;
  return (
    <ul className="space-y-1.5">
      {benefits.map((b, i) => (
        <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
          <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-emerald-500" />
          <span>{b}</span>
        </li>
      ))}
    </ul>
  );
}
