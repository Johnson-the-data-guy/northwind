import { useEffect, useState } from 'react';

export type Project = {
  slug: string;
  title: string;
  client: string;
  year: number;
  discipline: string;
  summary: string;
  cover: string;
};

type Result<T> =
  | { status: 'loading' }
  | { status: 'error' }
  | { status: 'not-found' }
  | { status: 'ready'; data: T };

function useApi<T>(url: string): Result<T> {
  const [result, setResult] = useState<Result<T> & { url?: string }>({ status: 'loading' });

  useEffect(() => {
    const controller = new AbortController();
    fetch(url, { signal: controller.signal })
      .then(async (res) => {
        if (res.status === 404) return setResult({ status: 'not-found', url });
        if (!res.ok) return setResult({ status: 'error', url });
        setResult({ status: 'ready', data: (await res.json()) as T, url });
      })
      .catch(() => {
        if (!controller.signal.aborted) setResult({ status: 'error', url });
      });
    return () => controller.abort();
  }, [url]);

  // A result from the previous URL must not render under the new route.
  return result.url === url ? result : { status: 'loading' };
}

export const useProjects = () => useApi<Project[]>('/api/projects');
export const useProject = (slug: string) =>
  useApi<Project>(`/api/projects/${encodeURIComponent(slug)}`);
