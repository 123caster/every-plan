import { useCallback, useEffect, useState } from 'react';

export type AppRoute = 'today' | 'calendar' | 'plugins' | 'plugin-import' | 'appearance' | 'foundation' | 'state';

const routePaths: Record<AppRoute, string> = {
  today: '/today',
  calendar: '/calendar/week',
  plugins: '/plugins',
  'plugin-import': '/plugins/import',
  appearance: '/settings/appearance',
  foundation: '/foundation',
  state: '/foundation/state',
};

export function routeFromPath(pathname = window.location.pathname): AppRoute {
  const match = (Object.entries(routePaths) as Array<[AppRoute, string]>).find(([, path]) => path === pathname);
  return match?.[0] ?? 'today';
}

function emitNavigation() {
  window.dispatchEvent(new Event('every-plan:navigation'));
}

export function navigate(route: AppRoute, options: { taskId?: string; replace?: boolean } = {}) {
  const url = new URL(routePaths[route], window.location.origin);
  if (options.taskId) url.searchParams.set('task', options.taskId);
  window.history[options.replace ? 'replaceState' : 'pushState']({}, '', `${url.pathname}${url.search}`);
  emitNavigation();
}

export function setTaskRoute(taskId: string | null) {
  const url = new URL(window.location.href);
  if (taskId) url.searchParams.set('task', taskId);
  else url.searchParams.delete('task');
  window.history.pushState({}, '', `${url.pathname}${url.search}`);
  emitNavigation();
}

export function useAppRouter() {
  const read = useCallback(() => ({
    route: routeFromPath(),
    taskId: new URLSearchParams(window.location.search).get('task'),
  }), []);
  const [location, setLocation] = useState(read);

  useEffect(() => {
    const update = () => setLocation(read());
    window.addEventListener('popstate', update);
    window.addEventListener('every-plan:navigation', update);
    if (window.location.pathname === '/') navigate('today', { replace: true });
    return () => {
      window.removeEventListener('popstate', update);
      window.removeEventListener('every-plan:navigation', update);
    };
  }, [read]);

  return { ...location, navigate, setTaskRoute };
}
