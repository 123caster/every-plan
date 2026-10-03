import type { PropsWithChildren } from 'react';
import type { AppRoute } from '../app/router';
import { ContextSidebar } from './ContextSidebar';
import { IconRail } from './IconRail';
import { MobileNav } from './MobileNav';

interface AppShellProps extends PropsWithChildren {
  activeView: AppRoute;
  onViewChange: (view: AppRoute) => void;
  onQuickCreate: () => void;
}

export function AppShell({ activeView, onViewChange, onQuickCreate, children }: AppShellProps) {
  return (
    <div className="app-shell">
      <IconRail activeView={activeView} onViewChange={onViewChange} onQuickCreate={onQuickCreate} />
      <ContextSidebar activeView={activeView} />
      <main className="workspace">
        <header className="workspace__topbar">
          <div>
            <span className="runtime-pill"><i /> 本地演示</span>
            <span className="version-label">v0.2.0 · 本地优先</span>
          </div>
          <div className="workspace__actions">
            <kbd>Ctrl</kbd><kbd>K</kbd>
            <span>Chrome / Edge 优先</span>
          </div>
        </header>
        <div className="workspace__content">{children}</div>
      </main>
      <MobileNav activeView={activeView} onViewChange={onViewChange} onQuickCreate={onQuickCreate} />
    </div>
  );
}
