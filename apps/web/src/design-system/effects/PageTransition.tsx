import type { PropsWithChildren } from 'react';

interface PageTransitionProps extends PropsWithChildren {
  activeKey: string;
  enabled?: boolean;
}

export function PageTransition({ activeKey, enabled = true, children }: PageTransitionProps) {
  return (
    <div key={activeKey} className={enabled ? 'page-transition' : undefined} data-effect={enabled ? 'on' : 'off'}>
      {children}
    </div>
  );
}

