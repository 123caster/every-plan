import type { PropsWithChildren } from 'react';

interface StatusBannerProps extends PropsWithChildren {
  tone?: 'info' | 'success' | 'warning';
  title: string;
}

export function StatusBanner({ tone = 'info', title, children }: StatusBannerProps) {
  return (
    <section className={`status-banner status-banner--${tone}`} role="status">
      <span className="status-banner__mark" aria-hidden="true">{tone === 'success' ? '✓' : 'i'}</span>
      <div>
        <strong>{title}</strong>
        {children ? <p>{children}</p> : null}
      </div>
    </section>
  );
}

