'use client';

import { useState } from 'react';
import { ToolConfig } from '@/types/tool';
import Button from '@/components/ui/Button';
import { Plus, Trash2 } from 'lucide-react';

interface Course {
  id: number;
  name: string;
  grade: string;
  credits: number;
}

const GRADE_VALUES: Record<string, number> = { A: 4, B: 3, C: 2, D: 1, E: 0 };
const GRADES = Object.keys(GRADE_VALUES);

let nextId = 1;

export default function GpaCalculatorWorkspace({ tool }: { tool: ToolConfig }) {
  const [courses, setCourses] = useState<Course[]>([{ id: nextId++, name: '', grade: 'A', credits: 3 }]);
  const [gpa, setGpa] = useState<number | null>(null);

  function addCourse() {
    setCourses((prev) => [...prev, { id: nextId++, name: '', grade: 'A', credits: 3 }]);
  }

  function removeCourse(id: number) {
    setCourses((prev) => prev.filter((c) => c.id !== id));
  }

  function updateCourse(id: number, field: keyof Course, value: string | number) {
    setCourses((prev) => prev.map((c) => (c.id === id ? { ...c, [field]: value } : c)));
  }

  function calculateGPA() {
    let totalCredits = 0;
    let totalPoints = 0;
    for (const c of courses) {
      const cr = c.credits || 0;
      totalCredits += cr;
      totalPoints += (GRADE_VALUES[c.grade] ?? 0) * cr;
    }
    if (totalCredits === 0) return;
    setGpa(Math.round((totalPoints / totalCredits) * 100) / 100);
  }

  function handleReset() {
    setCourses([{ id: nextId++, name: '', grade: 'A', credits: 3 }]);
    setGpa(null);
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        {courses.map((course) => (
          <div key={course.id} className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white p-3">
            <input
              type="text"
              value={course.name}
              onChange={(e) => updateCourse(course.id, 'name', e.target.value)}
              placeholder="Nama MK"
              className="flex-1 rounded border border-slate-100 px-2 py-1 text-sm outline-none focus:border-indigo-500"
            />
            <select
              value={course.grade}
              onChange={(e) => updateCourse(course.id, 'grade', e.target.value)}
              className="rounded border border-slate-100 px-2 py-1 text-sm outline-none focus:border-indigo-500"
            >
              {GRADES.map((g) => <option key={g} value={g}>{g} ({GRADE_VALUES[g]})</option>)}
            </select>
            <input
              type="number"
              value={course.credits}
              onChange={(e) => updateCourse(course.id, 'credits', parseInt(e.target.value) || 0)}
              min="1"
              max="6"
              className="w-16 rounded border border-slate-100 px-2 py-1 text-sm text-center outline-none focus:border-indigo-500"
              placeholder="SKS"
            />
            <button onClick={() => removeCourse(course.id)} className="text-red-400 hover:text-red-600">
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
      <Button variant="secondary" onClick={addCourse} fullWidth>
        <Plus size={16} className="mr-1.5" /> Tambah Mata Kuliah
      </Button>
      <div className="flex gap-3">
        <Button onClick={calculateGPA}>Hitung GPA</Button>
        <Button variant="ghost" onClick={handleReset}>Reset</Button>
      </div>
      {gpa !== null && (
        <div className="rounded-xl border border-slate-200 bg-white p-4 text-center">
          <p className="text-xs text-slate-500">Indeks Prestasi (GPA)</p>
          <p className="text-4xl font-bold text-indigo-600">{gpa.toFixed(2)}</p>
          <p className="text-sm text-slate-500 mt-1">dari {courses.reduce((s, c) => s + (c.credits || 0), 0)} SKS</p>
        </div>
      )}
    </div>
  );
}
