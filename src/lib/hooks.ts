import { useEffect, useState } from 'react';
import { searchTeams } from './teams.actions';

export function useSearchTeams(query: string) {
  const [results, setResults] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    setLoading(true);
    searchTeams(query.trim())
      .then(setResults)
      .finally(() => setLoading(false));
  }, [query]);

  return { results, loading };
}