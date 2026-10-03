import { useEffect, useRef, type PropsWithChildren } from 'react';

interface DialogSurfaceProps extends PropsWithChildren {
  open: boolean;
  title: string;
  onClose: () => void;
  kind: 'modal' | 'drawer';
}

export function DialogSurface({ open, title, onClose, kind, children }: DialogSurfaceProps) {
  const surfaceRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const surface = surfaceRef.current;
    const focusable = surface?.querySelectorAll<HTMLElement>(
      'button, input, select, textarea, [href], [tabindex]:not([tabindex="-1"])',
    );
    focusable?.[0]?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
      if (event.key !== 'Tab' || !focusable?.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      previousFocus?.focus();
    };
  }, [onClose, open]);

  if (!open) return null;

  return (
    <div className="dialog-backdrop" role="presentation" onMouseDown={onClose}>
      <div
        ref={surfaceRef}
        className={`dialog-surface dialog-surface--${kind}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${kind}-title`}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className="dialog-surface__header">
          <h2 id={`${kind}-title`}>{title}</h2>
          <button type="button" className="icon-button" aria-label="关闭" onClick={onClose}>×</button>
        </header>
        {children}
      </div>
    </div>
  );
}

