import { useState, useMemo } from 'react';
import { searchTools } from '@/lib/registry/registry-helpers';
import { useDebounce } from './useDebounce';

export function useToolSearch() {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 200);

  const results = useMemo(() => searchTools(debouncedQuery, 8), [debouncedQuery]);

  return { query, setQuery, results };
}
