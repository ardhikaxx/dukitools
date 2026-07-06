'use client';

import { useState } from 'react';
import { ToolConfig } from '@/types/tool';
import { useToast } from '@/components/toast/toastStore';
import ResultCard from '@/components/ui/ResultCard';
import ErrorState from '@/components/ui/ErrorState';
import Button from '@/components/ui/Button';
import { Braces, Play } from 'lucide-react';

const KEYWORDS = new Set([
  'SELECT', 'FROM', 'WHERE', 'AND', 'OR', 'NOT', 'IN', 'IS', 'NULL',
  'JOIN', 'LEFT', 'RIGHT', 'INNER', 'OUTER', 'FULL', 'CROSS', 'ON',
  'GROUP', 'BY', 'HAVING', 'ORDER', 'ASC', 'DESC',
  'LIMIT', 'OFFSET', 'FETCH', 'NEXT', 'ROWS', 'ONLY',
  'INSERT', 'INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE',
  'CREATE', 'TABLE', 'ALTER', 'DROP', 'INDEX', 'VIEW',
  'UNION', 'ALL', 'DISTINCT', 'AS', 'EXISTS',
  'BETWEEN', 'LIKE', 'ILIKE', 'SIMILAR', 'TO',
  'CASE', 'WHEN', 'THEN', 'ELSE', 'END',
  'WITH', 'RECURSIVE', 'RETURNING', 'USING',
  'PRIMARY', 'KEY', 'FOREIGN', 'REFERENCES', 'CONSTRAINT',
  'COUNT', 'SUM', 'AVG', 'MIN', 'MAX',
  'CAST', 'COALESCE', 'NULLIF',
  'TRUE', 'FALSE',
  'IF', 'REPLACE', 'TEMPORARY', 'TEMP',
  'BEGIN', 'COMMIT', 'ROLLBACK', 'TRANSACTION',
  'EXCEPT', 'INTERSECT', 'EXEC', 'PROCEDURE',
  'FUNCTION', 'RETURNS', 'LANGUAGE', 'IMMUTABLE', 'STABLE', 'VOLATILE',
  'DECLARE', 'CURSOR', 'LOOP', 'WHILE', 'FOR', 'INTO',
  'CASCADE', 'RESTRICT', 'DEFAULT', 'CHECK', 'UNIQUE', 'AUTO_INCREMENT',
  'SERIAL', 'BIGSERIAL', 'SMALLSERIAL',
  'VARCHAR', 'CHAR', 'TEXT', 'INT', 'INTEGER', 'BIGINT', 'SMALLINT',
  'NUMERIC', 'DECIMAL', 'REAL', 'FLOAT', 'DOUBLE', 'PRECISION',
  'BOOLEAN', 'DATE', 'TIMESTAMP', 'TIME', 'INTERVAL',
  'BLOB', 'CLOB', 'ENUM', 'ARRAY', 'JSON', 'JSONB',
  'INDEX', 'UNIQUE', 'CLUSTER', 'NONCLUSTERED',
  'TOP', 'DISTINCT', 'ROW', 'ROWS', 'RANGE', 'UNBOUNDED', 'PRECEDING', 'FOLLOWING',
  'OVER', 'PARTITION', 'WINDOW', 'RANK', 'DENSE_RANK', 'ROW_NUMBER', 'NTILE',
  'LAG', 'LEAD', 'FIRST_VALUE', 'LAST_VALUE', 'NTH_VALUE',
  'MATERIALIZED', 'VIEW', 'TEMP', 'TEMPORARY',
  'TRUNCATE', 'EXPLAIN', 'ANALYZE', 'VACUUM', 'REINDEX',
  'GRANT', 'REVOKE', 'ROLE', 'USER', 'PRIVILEGES',
  'SAVEPOINT', 'RELEASE',
]);

function formatSql(sql: string): string {
  const lines: string[] = [];
  let indentLevel = 0;
  const indent = '  ';

  const upper = sql.replace(/\b\w+\b/g, (word) =>
    KEYWORDS.has(word.toUpperCase()) ? word.toUpperCase() : word
  );

  const tokens = upper.split(/(\s+|,|\(|\))/).filter(Boolean);
  let currentLine = '';

  function endLine() {
    if (currentLine.trim()) lines.push(currentLine);
    currentLine = '';
  }

  for (const token of tokens) {
    if (token === '(') {
      if (currentLine.trim()) {
        currentLine += ' ';
      }
      currentLine += '(';
      endLine();
      indentLevel++;
      continue;
    }

    if (token === ')') {
      endLine();
      indentLevel = Math.max(0, indentLevel - 1);
      currentLine = indent.repeat(indentLevel) + ')';
      endLine();
      continue;
    }

    if (token === ',') {
      currentLine += ',';
      endLine();
      continue;
    }

    const upperToken = token.toUpperCase();
    if (KEYWORDS.has(upperToken) && upperToken !== 'AS') {
      endLine();
      currentLine = indent.repeat(indentLevel) + token;
      if (['SELECT', 'FROM', 'WHERE', 'ORDER', 'GROUP', 'HAVING', 'LIMIT', 'OFFSET', 'ON', 'SET', 'VALUES', 'INTO', 'AND', 'OR', 'UNION', 'EXCEPT', 'INTERSECT'].includes(upperToken)) {
        endLine();
        currentLine = indent.repeat(indentLevel) + token;
      }
      continue;
    }

    if (currentLine.trim()) currentLine += ' ';
    currentLine += token;
  }

  if (currentLine.trim()) lines.push(currentLine);

  return lines.join('\n');
}

export default function SqlFormatterWorkspace({ tool }: { tool: ToolConfig }) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();

  function handleFormat() {
    setOutput('');
    setError(null);
    const trimmed = input.trim();
    if (!trimmed) {
      toast.warning('Masukkan SQL terlebih dahulu.');
      return;
    }
    try {
      const formatted = formatSql(trimmed);
      setOutput(formatted);
      toast.success('SQL berhasil diformat!');
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Gagal memformat SQL.';
      setError(message);
      toast.error(message);
    }
  }

  function handleReset() {
    setInput('');
    setOutput('');
    setError(null);
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">Input SQL</label>
        <textarea
          value={input}
          onChange={(e) => { setInput(e.target.value); setError(null); }}
          placeholder="Tempel kode SQL Anda di sini..."
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-mono outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition resize-y min-h-[200px]"
          rows={8}
        />
      </div>

      <div className="flex gap-3">
        <Button onClick={handleFormat}>
          <Braces size={16} className="mr-1.5" /> Format
        </Button>
        <Button variant="ghost" onClick={handleReset}>Reset</Button>
      </div>

      {error && <ErrorState message={error} onRetry={() => setError(null)} />}

      {output && (
        <ResultCard
          title="Hasil SQL"
          textResult={output}
          onReset={handleReset}
        />
      )}
    </div>
  );
}
