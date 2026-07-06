'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { FaqItem } from '@/types/tool';
import { cn } from '@/lib/utils/cn';

interface ToolFAQProps {
  faq: FaqItem[];
}

export default function ToolFAQ({ faq }: ToolFAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="mt-12">
      <h2 className="mb-6 text-xl font-bold text-slate-900">Pertanyaan Umum (FAQ)</h2>
      <div className="space-y-3">
        {faq.map((item, i) => (
          <div key={i} className="rounded-xl border border-slate-100 overflow-hidden">
            <button
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="flex w-full items-center justify-between px-5 py-4 text-left font-medium text-slate-800 hover:bg-slate-50 transition-colors"
              aria-expanded={openIndex === i}
            >
              <span>{item.question}</span>
              <ChevronDown
                size={18}
                className={cn(
                  'shrink-0 text-slate-400 transition-transform',
                  openIndex === i && 'rotate-180'
                )}
              />
            </button>
            {openIndex === i && (
              <div className="px-5 pb-4 text-sm text-slate-600 leading-relaxed">
                {item.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
